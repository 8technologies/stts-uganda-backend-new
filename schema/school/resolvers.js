import { GraphQLError } from "graphql";
import { GraphQLDateTime } from "graphql-scalars";
import { db } from "../../config/config.js";
import saveData from "../../utils/db/saveData.js";

const getSchools = async ({ limit = 10, offset = 0, id}) => {
  try {
    let where = "";
    let values = [];

    if (id) {
      where = " AND schools.id = ?";
      values.push(id);
    }

    let sql = `
      SELECT 
      schools.*
      FROM schools
      WHERE schools.deleted = 0 ${where}
      ORDER BY schools.updated_at DESC
      LIMIT ? OFFSET ?
    `;

    values.push(limit, offset);

    const [results] = await db.execute(sql, values);
    return results;
  } catch (error) {
    throw new GraphQLError(error.message);
  }
};

const schoolResolvers = {
  DateTime: GraphQLDateTime,
  Query: {
    schools: async (parent, args, context) => {
      const results = await getSchools({});
      return results;
    },
    school: async (parent, args, context) => {
      try {
        const { id } = args;
        const results = await getSchools({
          limit: 1,
          offset: 0,
          id
        });
        return results[0];
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },
  Mutation: {
    addSchool: async (parent, args, context) => {
      try {
        console.log("payload", args.payload);
        const {
          name,
          emisNumber,
          upiCode,
          ownershipType,
          schoolCategory,
          signatureProgram,
          yearEstablished,
          headTeacherName,
          headTeacherContact,
          district,
          subCounty,
          parish,
          latitude,
          longitude,
          distanceFromHQ,
          totalEnrollment,
          totalTeachers,
          maleTeachers,
          femaleTeachers,
          p5p7Staff,
          region,
          locationType,
          hasElectricity,
          electricityPlanned,
          hasSecureRoom,
          hasComputerLab,
          hasFurniture,
          computers,
          tablets,
          smartphones,
          projectors,
          interactiveWhiteboards,
          otherDevices,
          hasInternet,
          connectionTypes,
          isConnectionStable,
          internetProvider,
          willingToSubscribe,
          isFenced,
          hasSecurityGuard,
          hasTheftIncidents,
          theftDetails,
          hasToilets,
          hasWaterSource,
          within30km,
          accessibleAllYear,
          isInclusive,
          servesSpecialNeeds,
          ictTrainedTeachers,
          digitalToolUsage,
          hasDigitalContent,
          contentSource,
          hasPeerSupport,
          ongoingCapacityBuilding,
          permanentClassrooms,
          semiPermanentClassrooms,
          temporaryClassrooms,
          pupilClassroomRatio,
          boysToilets,
          girlsToilets,
          staffToilets,
          waterAccess,
          securityInfrastructure,
          schoolAccessibility,
          nearbyHealthFacility,
          hasActiveSMC,
          hasActivePTA,
          engagementWithDEO,
          ngoSupport,
          communityContributions,
          plePassRate,
          literacyTrends,
          digitalContentUsers,
          innovations,
          assessorNotes,
        } = args.payload;

        // logic for savinng new school
        const data = {
          name,
          emis_number: emisNumber,
          upi_code: upiCode,
          ownership_type: ownershipType,
          school_category: schoolCategory,
          year_established: yearEstablished,
          head_teacher_name: headTeacherName,
          head_teacher_contact: headTeacherContact,
          district,
          region,
          sub_county: subCounty,
          parish,
          distance_from_achor_hq: distanceFromHQ,
          latitude,
          longitude,
          total_enrollment: totalEnrollment,
          total_teachers: totalTeachers,
          male_teachers: maleTeachers,
          female_teachers: femaleTeachers,
          num_of_staff: p5p7Staff,
          signature_program: signatureProgram,
          has_electricity: hasElectricity,
          electricity_planned: electricityPlanned,
          has_secure_room_for_ict: hasSecureRoom,
          has_computer_lab: hasComputerLab,
          has_furniture: hasFurniture,
          computers,
          tablets,
          smartphones,
          projectors,
          // interactive_whiteboards,
          other_devices: otherDevices,
          has_internet: hasInternet,
          // connection_types: [String],
          is_connection_stable: isConnectionStable,
          internet_provider: internetProvider,
          willing_toSubscribe: willingToSubscribe,

          is_fenced: isFenced,
          has_security_guard: hasSecurityGuard,
          has_theft_incidents: hasTheftIncidents,
          theft_details: theftDetails,
          has_toilets: hasToilets,
          has_water_source: hasWaterSource,

          within_30km_from_archor_school: within30km,
          accessible_all_year: accessibleAllYear,
          // is_inclusive: [String],
          serves_special_needs: servesSpecialNeeds,

          ict_trained_teachers: ictTrainedTeachers,
          digital_tool_usage: digitalToolUsage,
          has_digital_content: hasDigitalContent,
          content_source: contentSource,
          has_peer_support: hasPeerSupport,
          ongoing_capacity_building: ongoingCapacityBuilding,

          location_type: locationType,
          permanent_classrooms: permanentClassrooms,
          semi_permanent_classrooms: semiPermanentClassrooms,
          temporary_classrooms: temporaryClassrooms,
          pupil_classroom_ratio: pupilClassroomRatio,
          boys_toilets: boysToilets,
          girls_toilets: girlsToilets,
          staff_toilets: staffToilets,
          // water_access: [String],
          // security_infrastructure: [String],
          school_accessibility: schoolAccessibility,
          nearby_health_facility: nearbyHealthFacility,
          has_active_smc: hasActiveSMC,
          has_active_pta: hasActivePTA,
          engagement_with_deo: engagementWithDEO,
          ngo_support: ngoSupport,
          community_contributions: communityContributions,
          ple_pass_rate: plePassRate,
          literacy_trends: literacyTrends,
          digital_content_users: digitalContentUsers,
          innovations,
          assessor_notes: assessorNotes,
        };

        await saveData({
          table: "schools",
          data,
          id: null
        })

        return {
          success: true,
          message: "School Information saved successfully"
        }
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },
};

export default schoolResolvers;
