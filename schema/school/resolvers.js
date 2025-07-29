import { GraphQLError } from "graphql";
import { GraphQLDateTime } from "graphql-scalars";
import { db } from "../../config/config.js";
import saveData from "../../utils/db/saveData.js";
import { getSchoolPeriodicObservations } from "../school_periodic_observation/resolvers.js";
import { v4 as uuidv4 } from "uuid";

const getSchools = async ({ limit = 100, offset = 0, id, user_id }) => {
  try {
    let where = "";
    let values = [];

    if (id) {
      where += " AND schools.id = ?";
      values.push(id);
    }

    if (user_id) {
      where += " AND schools.last_modified_by = ?";
      values.push(user_id);
    }

    let sql = `
      SELECT 
      schools.*
      FROM schools
      LEFT JOIN users ON users.id = schools.last_modified_by
      WHERE schools.deleted = 0 ${where}
      ORDER BY schools.created_at DESC
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
      const results = await getSchools({
        user_id: args.user_id,
      });
      return results;
    },
    school: async (parent, args, context) => {
      try {
        const { id } = args;
        const results = await getSchools({
          limit: 1,
          offset: 0,
          id,
        });
        return results[0];
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },
  School: {
    periodic_observations: async (parent, args) => {
      const observations = await getSchoolPeriodicObservations({
        school_id: parent.id,
      });
      return observations;
    },
  },
  Mutation: {
    addSchool: async (parent, args, context) => {
      try {
        console.log("payload", args.payload);
        const {
          id,
          name,
          region,
          district,
          subCounty,
          location,
          type,
          environment,
          emisNumber,
          upiCode,
          ownershipType,
          schoolCategory,
          signatureProgram,
          yearEstablished,
          enrollmentData,
          contactInfo,
          infrastructure,
          internet,
          software,
          humanCapacity,
          pedagogicalUsage,
          governance,
          studentEngagement,
          communityEngagement,
          security,
          accessibility,
          schoolFacilities,
          performance,
          lastModifiedBy,
          lastUpdated,
        } = args.payload;

        // logic for savinng new school
        const data = {
          name,
          emis_number: emisNumber,
          upi_code: upiCode,
          region: region,
          district: district,
          sub_county: subCounty,
          latitude: location.latitude,
          longitude: location.longitude,
          type: type,
          environment: environment,
          ownership_type: ownershipType,
          school_category: schoolCategory,
          signature_program: signatureProgram,
          year_established: yearEstablished,

          head_teacher: contactInfo.headTeacher,
          school_email: contactInfo.email,
          school_phone: contactInfo.phone,

          total_students: enrollmentData.totalStudents,
          male_students: enrollmentData.maleStudents,
          female_students: enrollmentData.femaleStudents,

          student_computers: infrastructure.studentComputers,
          teacher_computers: infrastructure.teacherComputers,
          projectors: infrastructure.projectors,
          smart_boards: infrastructure.smartBoards,
          tablets: infrastructure.tablets,
          laptops: infrastructure.laptops,
          has_computer_lab: infrastructure.hasComputerLab,
          lab_condition: infrastructure.labCondition,
          has_ict_room: infrastructure.hasICTRoom,
          has_electricity: infrastructure.hasElectricity,
          has_secure_room: infrastructure.hasSecureRoom,
          has_furniture: infrastructure.hasFurniture,
          power_backup: JSON.stringify(infrastructure.powerBackup),

          connection_type: internet.connectionType,
          bandwidth_mbps: internet.bandwidthMbps,
          wifi_coverage: JSON.stringify(internet.wifiCoverage),
          stability: internet.stability,
          has_usage_policy: internet.hasUsagePolicy,
          provider: internet.provider,
          is_stable: internet.isStable,

          has_lms: software.hasLMS,
          lms_name: software.lmsName,
          has_licensed_software: software.hasLicensedSoftware,
          licensed_software: JSON.stringify(software.licensedSoftware),
          has_productivity_suite: software.hasProductivitySuite,
          productivity_suite: JSON.stringify(software.productivitySuite),
          has_digital_library: software.hasDigitalLibrary,
          has_local_content: software.hasLocalContent,
          content_source: software.contentSource,

          ict_trained_teachers: humanCapacity.ictTrainedTeachers,
          total_teachers: humanCapacity.totalTeachers,
          male_teachers: humanCapacity.maleTeachers,
          female_teachers: humanCapacity.femaleTeachers,
          p5_to_p7_teachers: humanCapacity.p5ToP7Teachers,
          support_staff: humanCapacity.supportStaff,
          monthly_trainings: humanCapacity.monthlyTrainings,
          teacher_competency_level: humanCapacity.teacherCompetencyLevel,
          has_capacity_building: humanCapacity.hasCapacityBuilding,

          ict_integrated_lessons: pedagogicalUsage.ictIntegratedLessons,
          uses_ict_assessments: pedagogicalUsage.usesICTAssessments,
          has_student_projects: pedagogicalUsage.hasStudentProjects,
          uses_blended_learning: pedagogicalUsage.usesBlendedLearning,
          has_assistive_tech: pedagogicalUsage.hasAssistiveTech,
          digital_tool_usage_frequency:
            pedagogicalUsage.digitalToolUsageFrequency,
          has_digital_content: pedagogicalUsage.hasDigitalContent,
          has_peer_support: pedagogicalUsage.hasPeerSupport,

          has_ict_policy: governance.hasICTPolicy,
          aligned_with_national_strategy:
            governance.alignedWithNationalStrategy,
          has_ict_committee: governance.hasICTCommittee,
          has_ict_budget: governance.hasICTBudget,
          has_monitoring_system: governance.hasMonitoringSystem,
          has_active_smc: governance.hasActiveSMC,
          has_active_pta: governance.hasActivePTA,
          has_local_leader_engagement: governance.hasLocalLeaderEngagement,

          digital_literacy_level: studentEngagement.digitalLiteracyLevel,
          has_ict_club: studentEngagement.hasICTClub,
          uses_online_platforms: studentEngagement.usesOnlinePlatforms,
          student_feedback_rating: studentEngagement.studentFeedbackRating,
          students_using_digital_content:
            studentEngagement.studentsUsingDigitalContent,

          has_parent_portal: communityEngagement.hasParentPortal,
          has_community_outreach: communityEngagement.hasCommunityOutreach,
          has_industry_partners: communityEngagement.hasIndustryPartners,
          partner_organizations: JSON.stringify(
            communityEngagement.partnerOrganizations
          ),
          ngo_support: JSON.stringify(communityEngagement.ngoSupport),
          community_contributions: JSON.stringify(
            communityEngagement.communityContributions
          ),

          is_fenced: security.isFenced,
          has_security_guard: security.hasSecurityGuard,
          has_recent_incidents: security.hasRecentIncidents,
          incident_details: security.incidentDetails,
          has_toilets: security.hasToilets,
          has_water_source: security.hasWaterSource,

          distance_from_hq: accessibility.distanceFromHQ,
          is_accessible_all_year: accessibility.isAccessibleAllYear,
          is_inclusive: accessibility.isInclusive,
          serves_girls: accessibility.servesGirls,
          serves_pwds: accessibility.servesPWDs,
          serves_refugees: accessibility.servesRefugees,
          is_only_school_in_area: accessibility.isOnlySchoolInArea,

          permanent_classrooms: schoolFacilities.permanentClassrooms,
          semi_permanent_classrooms: schoolFacilities.semiPermanentClassrooms,
          temporary_classrooms: schoolFacilities.temporaryClassrooms,
          pupil_classroom_ratio: schoolFacilities.pupilClassroomRatio,
          boys_toilets: schoolFacilities.boysToilets,
          girls_toilets: schoolFacilities.girlsToilets,
          staff_toilets: schoolFacilities.staffToilets,
          water_access: schoolFacilities.waterAccess,
          security_infrastructure: JSON.stringify(
            schoolFacilities.securityInfrastructure
          ),
          school_accessibility: schoolFacilities.schoolAccessibility,
          nearby_health_facility: schoolFacilities.nearbyHealthFacility,
          health_facility_distance: schoolFacilities.healthFacilityDistance,

          ple_pass_rate_year1: performance.plePassRateYear1,
          ple_pass_rate_year2: performance.plePassRateYear2,
          ple_pass_rate_year3: performance.plePassRateYear3,
          literacy_trends: performance.literacyTrends,
          numeracy_trends: performance.numeracyTrends,
          innovations: performance.innovations,
          unique_achievements: performance.uniqueAchievements,
          last_modified_by: lastModifiedBy,
          last_modified_on: lastUpdated,
        };

        console.log("data", data);

        if (!id) {
          data.id = uuidv4();
        }

        // // console.log("data", data)

        await saveData({
          table: "schools",
          data,
          id: id,
        });

        return {
          success: true,
          message: "School Information saved successfully",
        };
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    addSchoolMobile: async (parent, args, context) => {
      try {
        const {
          id,
          name,
          region,
          district,
          subCounty,
          location,
          type,
          environment,
          emisNumber,
          upiCode,
          ownershipType,
          schoolCategory,
          signatureProgram,
          yearEstablished,
          enrollmentData,
          contactInfo,
          infrastructure,
          internet,
          software,
          humanCapacity,
          pedagogicalUsage,
          governance,
          studentEngagement,
          communityEngagement,
          security,
          accessibility,
          schoolFacilities,
          performance,
          lastModifiedBy,
          lastUpdated,
        } = args.payload;

        // logic for savinng new school
        const data = {
          id: id || uuidv4(),
          name,
          emis_number: emisNumber,
          upi_code: upiCode,
          region: region,
          district: district,
          sub_county: subCounty,
          latitude: location.latitude,
          longitude: location.longitude,
          type: type,
          environment: environment,
          ownership_type: ownershipType,
          school_category: schoolCategory,
          signature_program: signatureProgram,
          year_established: yearEstablished,
          head_teacher: contactInfo.headTeacher,
          school_email: contactInfo.email,
          school_phone: contactInfo.phone,
          total_students: enrollmentData.totalStudents,
          male_students: enrollmentData.maleStudents,
          female_students: enrollmentData.femaleStudents,
          student_computers: infrastructure.studentComputers,
          teacher_computers: infrastructure.teacherComputers,
          projectors: infrastructure.projectors,
          smart_boards: infrastructure.smartBoards,
          tablets: infrastructure.tablets,
          laptops: infrastructure.laptops,
          has_computer_lab: infrastructure.hasComputerLab,
          lab_condition: infrastructure.labCondition,
          has_ict_room: infrastructure.hasICTRoom,
          has_electricity: infrastructure.hasElectricity,
          has_secure_room: infrastructure.hasSecureRoom,
          has_furniture: infrastructure.hasFurniture,
          power_backup: JSON.stringify(infrastructure.powerBackup),
          connection_type: internet.connectionType,
          bandwidth_mbps: internet.bandwidthMbps,
          wifi_coverage: JSON.stringify(internet.wifiCoverage),
          stability: internet.stability,
          has_usage_policy: internet.hasUsagePolicy,
          provider: internet.provider,
          is_stable: internet.isStable,
          has_lms: software.hasLMS,
          lms_name: software.lmsName,
          has_licensed_software: software.hasLicensedSoftware,
          licensed_software: JSON.stringify(software.licensedSoftware),
          has_productivity_suite: software.hasProductivitySuite,
          productivity_suite: JSON.stringify(software.productivitySuite),
          has_digital_library: software.hasDigitalLibrary,
          has_local_content: software.hasLocalContent,
          content_source: software.contentSource,
          ict_trained_teachers: humanCapacity.ictTrainedTeachers,
          total_teachers: humanCapacity.totalTeachers,
          male_teachers: humanCapacity.maleTeachers,
          female_teachers: humanCapacity.femaleTeachers,
          p5_to_p7_teachers: humanCapacity.p5ToP7Teachers,
          support_staff: humanCapacity.supportStaff,
          monthly_trainings: humanCapacity.monthlyTrainings,
          teacher_competency_level: humanCapacity.teacherCompetencyLevel,
          has_capacity_building: humanCapacity.hasCapacityBuilding,
          ict_integrated_lessons: pedagogicalUsage.ictIntegratedLessons,
          uses_ict_assessments: pedagogicalUsage.usesICTAssessments,
          has_student_projects: pedagogicalUsage.hasStudentProjects,
          uses_blended_learning: pedagogicalUsage.usesBlendedLearning,
          has_assistive_tech: pedagogicalUsage.hasAssistiveTech,
          digital_tool_usage_frequency:
            pedagogicalUsage.digitalToolUsageFrequency,
          has_digital_content: pedagogicalUsage.hasDigitalContent,
          has_peer_support: pedagogicalUsage.hasPeerSupport,
          has_ict_policy: governance.hasICTPolicy,
          aligned_with_national_strategy:
            governance.alignedWithNationalStrategy,
          has_ict_committee: governance.hasICTCommittee,
          has_ict_budget: governance.hasICTBudget,
          has_monitoring_system: governance.hasMonitoringSystem,
          has_active_smc: governance.hasActiveSMC,
          has_active_pta: governance.hasActivePTA,
          has_local_leader_engagement: governance.hasLocalLeaderEngagement,
          digital_literacy_level: studentEngagement.digitalLiteracyLevel,
          has_ict_club: studentEngagement.hasICTClub,
          uses_online_platforms: studentEngagement.usesOnlinePlatforms,
          student_feedback_rating: studentEngagement.studentFeedbackRating,
          students_using_digital_content:
            studentEngagement.studentsUsingDigitalContent,
          has_parent_portal: communityEngagement.hasParentPortal,
          has_community_outreach: communityEngagement.hasCommunityOutreach,
          has_industry_partners: communityEngagement.hasIndustryPartners,
          partner_organizations: JSON.stringify(
            communityEngagement.partnerOrganizations
          ),
          ngo_support: JSON.stringify(communityEngagement.ngoSupport),
          community_contributions: JSON.stringify(
            communityEngagement.communityContributions
          ),
          is_fenced: security.isFenced,
          has_security_guard: security.hasSecurityGuard,
          has_recent_incidents: security.hasRecentIncidents,
          incident_details: security.incidentDetails,
          has_toilets: security.hasToilets,
          has_water_source: security.hasWaterSource,
          distance_from_hq: accessibility.distanceFromHQ,
          is_accessible_all_year: accessibility.isAccessibleAllYear,
          is_inclusive: accessibility.isInclusive,
          serves_girls: accessibility.servesGirls,
          serves_pwds: accessibility.servesPWDs,
          serves_refugees: accessibility.servesRefugees,
          is_only_school_in_area: accessibility.isOnlySchoolInArea,
          permanent_classrooms: schoolFacilities.permanentClassrooms,
          semi_permanent_classrooms: schoolFacilities.semiPermanentClassrooms,
          temporary_classrooms: schoolFacilities.temporaryClassrooms,
          pupil_classroom_ratio: schoolFacilities.pupilClassroomRatio,
          boys_toilets: schoolFacilities.boysToilets,
          girls_toilets: schoolFacilities.girlsToilets,
          staff_toilets: schoolFacilities.staffToilets,
          water_access: schoolFacilities.waterAccess,
          security_infrastructure: JSON.stringify(
            schoolFacilities.securityInfrastructure
          ),
          school_accessibility: schoolFacilities.schoolAccessibility,
          nearby_health_facility: schoolFacilities.nearbyHealthFacility,
          health_facility_distance: schoolFacilities.healthFacilityDistance,
          ple_pass_rate_year1: performance.plePassRateYear1,
          ple_pass_rate_year2: performance.plePassRateYear2,
          ple_pass_rate_year3: performance.plePassRateYear3,
          literacy_trends: performance.literacyTrends,
          numeracy_trends: performance.numeracyTrends,
          innovations: performance.innovations,
          unique_achievements: performance.uniqueAchievements,
          last_modified_by: lastModifiedBy,
          last_modified_on: lastUpdated,
        };
        console.log("data", data);
        await saveData({
          table: "schools",
          data,
          id: null,
        });
        return {
          success: true,
          message: "School Information saved successfully",
        };
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
    updateSchoolMobile: async (parent, args, context) => {
      try {
        const {
          id,
          name,
          region,
          district,
          subCounty,
          location,
          type,
          environment,
          emisNumber,
          upiCode,
          ownershipType,
          schoolCategory,
          signatureProgram,
          yearEstablished,
          enrollmentData,
          contactInfo,
          infrastructure,
          internet,
          software,
          humanCapacity,
          pedagogicalUsage,
          governance,
          studentEngagement,
          communityEngagement,
          security,
          accessibility,
          schoolFacilities,
          performance,
          lastModifiedBy,
          lastUpdated,
        } = args.payload;

        console.log("payload", args);

        // logic for savinng new school
        const data = {
          name,
          emis_number: emisNumber,
          upi_code: upiCode,
          region: region,
          district: district,
          sub_county: subCounty,
          latitude: location.latitude,
          longitude: location.longitude,
          type: type,
          environment: environment,
          ownership_type: ownershipType,
          school_category: schoolCategory,
          signature_program: signatureProgram,
          year_established: yearEstablished,
          head_teacher: contactInfo.headTeacher,
          school_email: contactInfo.email,
          school_phone: contactInfo.phone,
          total_students: enrollmentData.totalStudents,
          male_students: enrollmentData.maleStudents,
          female_students: enrollmentData.femaleStudents,
          student_computers: infrastructure.studentComputers,
          teacher_computers: infrastructure.teacherComputers,
          projectors: infrastructure.projectors,
          smart_boards: infrastructure.smartBoards,
          tablets: infrastructure.tablets,
          laptops: infrastructure.laptops,
          has_computer_lab: infrastructure.hasComputerLab,
          lab_condition: infrastructure.labCondition,
          has_ict_room: infrastructure.hasICTRoom,
          has_electricity: infrastructure.hasElectricity,
          has_secure_room: infrastructure.hasSecureRoom,
          has_furniture: infrastructure.hasFurniture,
          power_backup: JSON.stringify(infrastructure.powerBackup),
          connection_type: internet.connectionType,
          bandwidth_mbps: internet.bandwidthMbps,
          wifi_coverage: JSON.stringify(internet.wifiCoverage),
          stability: internet.stability,
          has_usage_policy: internet.hasUsagePolicy,
          provider: internet.provider,
          is_stable: internet.isStable,
          has_lms: software.hasLMS,
          lms_name: software.lmsName,
          has_licensed_software: software.hasLicensedSoftware,
          licensed_software: JSON.stringify(software.licensedSoftware),
          has_productivity_suite: software.hasProductivitySuite,
          productivity_suite: JSON.stringify(software.productivitySuite),
          has_digital_library: software.hasDigitalLibrary,
          has_local_content: software.hasLocalContent,
          content_source: software.contentSource,
          ict_trained_teachers: humanCapacity.ictTrainedTeachers,
          total_teachers: humanCapacity.totalTeachers,
          male_teachers: humanCapacity.maleTeachers,
          female_teachers: humanCapacity.femaleTeachers,
          p5_to_p7_teachers: humanCapacity.p5ToP7Teachers,
          support_staff: humanCapacity.supportStaff,
          monthly_trainings: humanCapacity.monthlyTrainings,
          teacher_competency_level: humanCapacity.teacherCompetencyLevel,
          has_capacity_building: humanCapacity.hasCapacityBuilding,
          ict_integrated_lessons: pedagogicalUsage.ictIntegratedLessons,
          uses_ict_assessments: pedagogicalUsage.usesICTAssessments,
          has_student_projects: pedagogicalUsage.hasStudentProjects,
          uses_blended_learning: pedagogicalUsage.usesBlendedLearning,
          has_assistive_tech: pedagogicalUsage.hasAssistiveTech,
          digital_tool_usage_frequency:
            pedagogicalUsage.digitalToolUsageFrequency,
          has_digital_content: pedagogicalUsage.hasDigitalContent,
          has_peer_support: pedagogicalUsage.hasPeerSupport,
          has_ict_policy: governance.hasICTPolicy,
          aligned_with_national_strategy:
            governance.alignedWithNationalStrategy,
          has_ict_committee: governance.hasICTCommittee,
          has_ict_budget: governance.hasICTBudget,
          has_monitoring_system: governance.hasMonitoringSystem,
          has_active_smc: governance.hasActiveSMC,
          has_active_pta: governance.hasActivePTA,
          has_local_leader_engagement: governance.hasLocalLeaderEngagement,
          digital_literacy_level: studentEngagement.digitalLiteracyLevel,
          has_ict_club: studentEngagement.hasICTClub,
          uses_online_platforms: studentEngagement.usesOnlinePlatforms,
          student_feedback_rating: studentEngagement.studentFeedbackRating,
          students_using_digital_content:
            studentEngagement.studentsUsingDigitalContent,
          has_parent_portal: communityEngagement.hasParentPortal,
          has_community_outreach: communityEngagement.hasCommunityOutreach,
          has_industry_partners: communityEngagement.hasIndustryPartners,
          partner_organizations: JSON.stringify(
            communityEngagement.partnerOrganizations
          ),
          ngo_support: JSON.stringify(communityEngagement.ngoSupport),
          community_contributions: JSON.stringify(
            communityEngagement.communityContributions
          ),
          is_fenced: security.isFenced,
          has_security_guard: security.hasSecurityGuard,
          has_recent_incidents: security.hasRecentIncidents,
          incident_details: security.incidentDetails,
          has_toilets: security.hasToilets,
          has_water_source: security.hasWaterSource,
          distance_from_hq: accessibility.distanceFromHQ,
          is_accessible_all_year: accessibility.isAccessibleAllYear,
          is_inclusive: accessibility.isInclusive,
          serves_girls: accessibility.servesGirls,
          serves_pwds: accessibility.servesPWDs,
          serves_refugees: accessibility.servesRefugees,
          is_only_school_in_area: accessibility.isOnlySchoolInArea,
          permanent_classrooms: schoolFacilities.permanentClassrooms,
          semi_permanent_classrooms: schoolFacilities.semiPermanentClassrooms,
          temporary_classrooms: schoolFacilities.temporaryClassrooms,
          pupil_classroom_ratio: schoolFacilities.pupilClassroomRatio,
          boys_toilets: schoolFacilities.boysToilets,
          girls_toilets: schoolFacilities.girlsToilets,
          staff_toilets: schoolFacilities.staffToilets,
          water_access: schoolFacilities.waterAccess,
          security_infrastructure: JSON.stringify(
            schoolFacilities.securityInfrastructure
          ),
          school_accessibility: schoolFacilities.schoolAccessibility,
          nearby_health_facility: schoolFacilities.nearbyHealthFacility,
          health_facility_distance: schoolFacilities.healthFacilityDistance,
          ple_pass_rate_year1: performance.plePassRateYear1,
          ple_pass_rate_year2: performance.plePassRateYear2,
          ple_pass_rate_year3: performance.plePassRateYear3,
          literacy_trends: performance.literacyTrends,
          numeracy_trends: performance.numeracyTrends,
          innovations: performance.innovations,
          unique_achievements: performance.uniqueAchievements,
          last_modified_by: lastModifiedBy,
          last_modified_on: lastUpdated,
        };
        console.log("data", data);
        await saveData({
          table: "schools",
          data,
          id: id,
        });
        return {
          success: true,
          message: "School Information saved successfully",
        };
      } catch (error) {
        throw new GraphQLError(error.message);
      }
    },
  },
};

export default schoolResolvers;
