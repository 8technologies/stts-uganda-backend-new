import { GraphQLError } from "graphql";
import { GraphQLDateTime } from "graphql-scalars";
import { db } from "../../config/config.js";
import saveData from "../../utils/db/saveData.js";

const getSchoolPeriodicObservations = async ({ limit = 10, offset = 0, school_id}) => {
    try {
      let where = "";
      let values = [];
  
      let sql = `
        SELECT 
        school_periodic_observations.*
        FROM school_periodic_observations
        WHERE school_periodic_observations.deleted = 0 ${where}
        ORDER BY school_periodic_observations.updated_at DESC
        LIMIT ? OFFSET ?
      `;
  
      values.push(limit, offset);
  
      const [results] = await db.execute(sql, values);
      console.log("results", results)
      return results;
    } catch (error) {
      throw new GraphQLError(error.message);
    }
  };

const schoolPeriodicObservationResolvers = {
  DateTime: GraphQLDateTime,
  Query: {
    school_periodic_observations: async (parent, args, context) => {
        console.log("args", args)
      const results = await getSchoolPeriodicObservations({});
      return results;
    },
  },
  Mutation: {
    add_school_periodic_observation: async (parent, args, context) => {
      try {
        console.log("payload", args.payload);
        const {
          school_id,
          termQuarter,
          classAttendance,
          teacherAttendance,
          dropouts,
          digitalSubjects,
          lessonFrequency,
          teachersUsingDigital,
          goodLessonObserved,
          peerSupport,
          learnersEngaged,
          learnersUsingDevices,
          engagementLevel,
          challenges,
          devices,
          deviceStorage,
          signInRegister,
          powerAvailable,
          internetStatus,
          contentSources,
          newContentIntroduced,
          learnerAccessLevels,
          headTeacherInvolved,
          ictCoordinator,
          ictSchedule,
          smcMeeting,
          ictDiscussions,
          communityEngagement,
          achievements,
          infrastructureChallenges,
          trainingChallenges,
          connectivityChallenges,
          contentChallenges,
          otherChallenges,
          immediateActions,
          capacityBuildingNeeds,
          supportRequests,
          scores,
          nextVisit
        } = args.payload;

        const data = {
          school_id,
          observation_date: new Date, 
          term_quarter: termQuarter,
          p6_registered: classAttendance?.p6Registered || 0,
          p6_present: classAttendance?.p6Present || 0,
          p6_notes: classAttendance?.p6Notes || "",
          p7_registered: classAttendance?.p7Registered || 0,
          p7_present: classAttendance?.p7Present || 0,
          p7_notes: classAttendance?.p7Notes || "",
          teacher_attendance_total: teacherAttendance?.totalAssigned || 0,
          teacher_attendance_present: teacherAttendance?.present || 0,
          teacher_attendance_absent: teacherAttendance?.absent || 0,
          dropouts_total: dropouts?.number || 0,
          dropouts_male: dropouts?.maleDropouts || 0,
          dropouts_female: dropouts?.femaleDropouts || 0,
          dropouts_reasons: dropouts?.reasons || "",
          digital_subjects: digitalSubjects,
          lesson_frequency: lessonFrequency,
          teachers_using_digital: teachersUsingDigital,
          good_lesson_observed: goodLessonObserved,
          peer_support: peerSupport,
          learners_engaged: learnersEngaged,
          learners_using_devices: learnersUsingDevices,
          engagement_level: engagementLevel,
          // challenges: challenges,
          laptops_total: devices?.laptopsTotal || 0,
          laptops_working: devices?.laptopsWorking || 0,
          laptops_not_working: devices?.laptopsNotWorking || 0,
          laptops_notes: devices?.laptopsNotes || "",
          projectors_total: devices?.projectorTotal || 0,
          projectors_working: devices?.projectorWorking || 0,
          projectors_not_working: devices?.projectorNotWorking || 0,
          projectors_notes: devices?.projectorNotes || "",
          routers_total: devices?.routerTotal || 0,
          routers_working: devices?.routerWorking || 0,
          routers_not_working: devices?.routerNotWorking || 0,
          routers_notes: devices?.routerNotes || "",
          solar_total: devices?.solarTotal || 0,
          solar_working: devices?.solarWorking || 0,
          solar_not_working: devices?.solarNotWorking || 0,
          solar_notes: devices?.solarNotes || "",
          device_storage: deviceStorage,
          sign_in_register: signInRegister,
          // power_available: powerAvailable,
          internet_status: internetStatus,
          content_sources: contentSources,
          new_content_introduced: newContentIntroduced,
          learner_access_levels: learnerAccessLevels,
          head_teacher_involved: headTeacherInvolved,
          ict_coordinator: ictCoordinator,
          ict_schedule: ictSchedule,
          smc_meeting: smcMeeting,
          ict_discussions: ictDiscussions,
          // community_engagement: [String]
          achievements: achievements,
          infrastructure_challenges: infrastructureChallenges,
          training_challenges: trainingChallenges,
          connectivity_challenges: connectivityChallenges,
          content_challenges: contentChallenges,
          other_challenges: otherChallenges,
          immediate_actions: immediateActions,
          capacity_building_needs: capacityBuildingNeeds,
          support_requests: supportRequests,
          learner_attendance: scores?.learnerAttendance || 0,
          teacher_attendance: scores?.teacherAttendance || 0,
          digital_tools_use: scores?.digitalToolsUse || 0,
          infrastructure_condition: scores?.infrastructureCondition || 0,
          internet_availability: scores?.internetAvailability || 0,
          management_support: scores?.managementSupport || 0,
          next_visit: nextVisit,
          // assessor_notes: "",
          // assessed_by: String
          // created_at: String
          // updated_at: String
        }

        console.log("data", data)
        
        await saveData({
          table: "school_periodic_observations",
          data,
          id: null
        })

        return {
          success: true,
          message: "School Periodic Observation saved successfully"
        }
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },
};

export default schoolPeriodicObservationResolvers;
