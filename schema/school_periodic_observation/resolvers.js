import { GraphQLError } from "graphql";
import { GraphQLDate, GraphQLDateTime, } from "graphql-scalars";
import { db } from "../../config/config.js";
import saveData from "../../utils/db/saveData.js";
import { v4 as uuidv4 } from 'uuid';

export const getSchoolPeriodicObservations = async ({
  limit = 10,
  offset = 0,
  school_id,
  id,
}) => {
  try {
    let where = "WHERE spo.deleted = 0";
    let values = [];
    let joins = "";

    if (school_id) {
      where += " AND spo.school_id = ?";
      values.push(school_id);
    }

    if (id) {
      where += " AND spo.id = ?";
      values.push(id);
    }

    // Main query with all joins
    let sql = `
      SELECT 
        spo.*,
        oi.computers, oi.tablets, oi.projectors, oi.printers,
        oi.internet_connection, oi.internet_speed_mbps, oi.power_backup, oi.functional_devices,
        ou.teachers_using_ict, ou.total_teachers, ou.weekly_computer_lab_hours, ou.student_digital_literacy_rate,
        os.office_applications,
        oc.ict_trained_teachers, oc.support_staff,
        (
          SELECT GROUP_CONCAT(ops.power_source SEPARATOR ', ')
          FROM observation_power_sources ops
          WHERE ops.observation_id = spo.id
        ) AS power_sources,
        (
          SELECT GROUP_CONCAT(oos.operating_system SEPARATOR ', ')
          FROM observation_operating_systems oos
          WHERE oos.observation_id = spo.id
        ) AS operating_systems,
        (
          SELECT GROUP_CONCAT(oes.software_name SEPARATOR ', ')
          FROM observation_educational_software oes
          WHERE oes.observation_id = spo.id
        ) AS educational_software
      FROM school_periodic_observations spo
      LEFT JOIN observation_infrastructure oi ON oi.observation_id = spo.id
      LEFT JOIN observation_usage ou ON ou.observation_id = spo.id
      LEFT JOIN observation_software os ON os.observation_id = spo.id
      LEFT JOIN observation_capacity oc ON oc.observation_id = spo.id
      ${where}
      ORDER BY spo.updated_at DESC
      LIMIT ? OFFSET ?
    `;

    values.push(limit, offset);

    const [results] = await db.execute(sql, values);

    // Transform array strings back to arrays
    return results.map((row) => ({
      ...row,
      power_source: row.power_sources ? row.power_sources.split(", ") : [],
      operating_systems: row.operating_systems
        ? row.operating_systems.split(", ")
        : [],
      educational_software: row.educational_software
        ? row.educational_software.split(", ")
        : [],
    }));
  } catch (error) {
    throw new GraphQLError(error.message);
  }
};

const schoolPeriodicObservationResolvers = {
  Date: GraphQLDate,
  Query: {
    school_periodic_observations: async (_, { input = {} }) => {
      const { limit, offset, school_id, id } = input;
      return await getSchoolPeriodicObservations({
        limit,
        offset,
        school_id,
        id,
      });
    },
  },
  SchoolPeriodicObservation: {
    infrastructure: (parent) => ({
      computers: parent.computers,
      tablets: parent.tablets,
      projectors: parent.projectors,
      printers: parent.printers,
      internet_connection: parent.internet_connection,
      internet_speed_mbps: parent.internet_speed_mbps,
      power_source: parent.power_source,
      power_backup: parent.power_backup,
      functional_devices: parent.functional_devices,
    }),
    usage: (parent) => ({
      teachers_using_ict: parent.teachers_using_ict,
      total_teachers: parent.total_teachers,
      weekly_computer_lab_hours: parent.weekly_computer_lab_hours,
      student_digital_literacy_rate: parent.student_digital_literacy_rate,
    }),
    software: (parent) => ({
      operating_systems: parent.operating_systems,
      educational_software: parent.educational_software,
      office_applications: parent.office_applications,
    }),
    capacity: (parent) => ({
      ict_trained_teachers: parent.ict_trained_teachers,
      support_staff: parent.support_staff,
    }),
  },
  Mutation: {
    add_school_periodic_observation: async (parent, { payload }, context) => {
      try {
        const { infrastructure, usage, software, capacity, ...observationData } = payload;
        const connection = await db.getConnection();
        
        try {
          await connection.beginTransaction();
    
          // Determine if this is an update or insert
          const isUpdate = Boolean(observationData?.id);
          const observationId = observationData?.id || uuidv4();
    
          // 1. Save main observation record
          await saveData({
            table: "school_periodic_observations",
            data: {
              school_id: observationData.schoolId,
              date: new Date(observationData.date),
              period: observationData.period
            },
            id: isUpdate ? observationId : null,
            connection
          });
    
          // For update operations, first delete existing related records
          if (isUpdate) {
            await connection.execute(
              `DELETE FROM observation_power_sources WHERE observation_id = ?`,
              [observationId]
            );
            await connection.execute(
              `DELETE FROM observation_operating_systems WHERE observation_id = ?`,
              [observationId]
            );
            await connection.execute(
              `DELETE FROM observation_educational_software WHERE observation_id = ?`,
              [observationId]
            );
          }
    
          // 2. Save infrastructure (upsert)
          await saveData({
            table: "observation_infrastructure",
            data: {
              observation_id: observationId,
              computers: infrastructure.computers,
              tablets: infrastructure.tablets,
              projectors: infrastructure.projectors,
              printers: infrastructure.printers,
              internet_connection: infrastructure.internetConnection,
              internet_speed_mbps: infrastructure.internetSpeedMbps,
              power_backup: infrastructure.powerBackup,
              functional_devices: infrastructure.functionalDevices
            },
            id: isUpdate ? observationId : null,
            idColumn: "observation_id",
            connection
          });
    
          // 3. Save power sources (always insert)
          if (infrastructure.powerSource.length > 0) {
            await saveData({
              table: "observation_power_sources",
              data: infrastructure.powerSource.map(source => ({
                observation_id: observationId,
                power_source: source
              })),
              id: null,
              connection
            });
          }
    
          // 4. Save usage (upsert)
          await saveData({
            table: "observation_usage",
            data: {
              observation_id: observationId,
              teachers_using_ict: usage.teachersUsingICT,
              total_teachers: usage.totalTeachers,
              weekly_computer_lab_hours: usage.weeklyComputerLabHours,
              student_digital_literacy_rate: usage.studentDigitalLiteracyRate
            },
            id: isUpdate ? observationId : null,
            idColumn: "observation_id",
            connection
          });
    
          // 5. Save software (upsert)
          await saveData({
            table: "observation_software",
            data: {
              observation_id: observationId,
              office_applications: software.officeApplications
            },
            id: isUpdate ? observationId : null,
            idColumn: "observation_id",
            connection
          });
    
          // 6. Save operating systems (always insert)
          if (software.operatingSystems.length > 0) {
            await saveData({
              table: "observation_operating_systems",
              data: software.operatingSystems.map(os => ({
                observation_id: observationId,
                operating_system: os
              })),
              id: null,
              connection
            });
          }
    
          // 7. Save educational software (always insert)
          if (software.educationalSoftware.length > 0) {
            await saveData({
              table: "observation_educational_software",
              data: software.educationalSoftware.map(app => ({
                observation_id: observationId,
                software_name: app
              })),
              id: null,
              connection
            });
          }
    
          // 8. Save capacity (upsert)
          await saveData({
            table: "observation_capacity",
            data: {
              observation_id: observationId,
              ict_trained_teachers: capacity.ictTrainedTeachers,
              support_staff: capacity.supportStaff
            },
            id: isUpdate ? observationId : null,
            idColumn: "observation_id",
            connection
          });
    
          await connection.commit();
          connection.release();
    
          return {
            success: true,
            message: `School Periodic Observation ${isUpdate ? 'updated' : 'saved'} successfully`,
            observationId
          };
    
        } catch (error) {
          await connection.rollback();
          connection.release();
          throw new GraphQLError(`Failed to ${observationData?.id ? 'update' : 'save'} observation: ${error.message}`);
        }
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    }
  },
};

export default schoolPeriodicObservationResolvers;
