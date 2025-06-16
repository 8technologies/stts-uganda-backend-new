const schoolTypDefs = `#graphql
    scalar DateTime
    type School {
        id: ID!
        name: String!
        emis_number: String
        upi_code: String
        region: String
        district: String
        sub_county: String
        latitude: Float
        longitude: Float
        type: SchoolType
        environment: Environment
        ownership_type: OwnershipType
        school_category: SchoolCategory
        signature_program: String
        year_established: Int

        # Contact
        head_teacher: String
        school_email: String
        school_phone: String

        # Enrollment
        total_students: Int
        male_students: Int
        female_students: Int

        # Infrastructure
        student_computers: Int
        teacher_computers: Int
        projectors: Int
        smart_boards: Int
        tablets: Int
        laptops: Int
        has_computer_lab: Boolean
        lab_condition: String
        has_ict_room: Boolean
        has_electricity: Boolean
        has_secure_room: Boolean
        has_furniture: Boolean
        power_backup: String

        # Internet
        connection_type: String
        bandwidth_mbps: Int
        wifi_coverage: String
        stability: String
        has_usage_policy: Boolean
        provider: String
        is_stable: Boolean

        # Software
        has_lms: Boolean
        lms_name: String
        has_licensed_software: Boolean
        licensed_software: String
        has_productivity_suite: Boolean
        productivity_suite: String
        has_digital_library: Boolean
        has_local_content: Boolean
        content_source: String

        # Human Capacity
        ict_trained_teachers: Int
        total_teachers: Int
        male_teachers: Int
        female_teachers: Int
        p5_to_p7_teachers: Int
        support_staff: Int
        monthly_trainings: Int
        teacher_competency_level: String
        has_capacity_building: Boolean

        # Pedagogical Use
        ict_integrated_lessons: Int
        uses_ict_assessments: Boolean
        has_student_projects: Boolean
        uses_blended_learning: Boolean
        has_assistive_tech: Boolean
        digital_tool_usage_frequency: DigitalToolUsage
        has_digital_content: Boolean
        has_peer_support: Boolean

        # Governance
        has_ict_policy: Boolean
        aligned_with_national_strategy: Boolean
        has_ict_committee: Boolean
        has_ict_budget: Boolean
        has_monitoring_system: Boolean
        has_active_smc: Boolean
        has_active_pta: Boolean
        has_local_leader_engagement: Boolean

        # Student Engagement
        digital_literacy_level: String
        has_ict_club: Boolean
        uses_online_platforms: Boolean
        student_feedback_rating: Int
        students_using_digital_content: Int

        # Community Engagement
        has_parent_portal: Boolean
        has_community_outreach: Boolean
        has_industry_partners: Boolean
        partner_organizations: String
        ngo_support: String
        community_contributions: String

        # Security
        is_fenced: Boolean
        has_security_guard: Boolean
        has_recent_incidents: Boolean
        incident_details: String
        has_toilets: Boolean
        has_water_source: Boolean

        # Accessibility
        distance_from_hq: Float
        is_accessible_all_year: Boolean
        is_inclusive: Boolean
        serves_girls: Boolean
        serves_pwds: Boolean
        serves_refugees: Boolean
        is_only_school_in_area: Boolean

        # Facilities
        permanent_classrooms: Int
        semi_permanent_classrooms: Int
        temporary_classrooms: Int
        pupil_classroom_ratio: Float
        boys_toilets: Int
        girls_toilets: Int
        staff_toilets: Int
        water_access: String
        security_infrastructure: String
        school_accessibility: String
        nearby_health_facility: String
        health_facility_distance: Float

        # Performance
        ple_pass_rate_year1: Float
        ple_pass_rate_year2: Float
        ple_pass_rate_year3: Float
        literacy_trends: String
        numeracy_trends: String
        innovations: String
        unique_achievements: String
        periodic_observations: [SchoolPeriodicObservation]
    }

    type ResponseMessage {
        success: Boolean,
        message: String
    }

    type Location {
        latitude: Float!
        longitude: Float!
    }

    type EnrollmentData {
        totalStudents: Int!
        maleStudents: Int!
        femaleStudents: Int!
    }

    type Query {
        schools: [School]
        school(id: ID!): School
    }

    type Mutation {
        addSchool(payload: SchoolInput!): ResponseMessage!
    }

    input SchoolInput {
        id: ID,
        name: String!
        region: String!
        district: String
        subCounty: String
        location: LocationInput
        type: String
        environment: String
        emisNumber: String
        upiCode: String
        ownershipType: String
        schoolCategory: String
        signatureProgram: String
        yearEstablished: Int
        enrollmentData: EnrollmentDataInput
        contactInfo: ContactInfoInput
        infrastructure: InfrastructureInput
        internet: InternetInput
        software: SoftwareInput
        humanCapacity: HumanCapacityInput
        pedagogicalUsage: PedagogicalUsageInput
        governance: GovernanceInput
        studentEngagement: StudentEngagementInput
        communityEngagement: CommunityEngagementInput
        security: SecurityInput
        accessibility: AccessibilityInput
        schoolFacilities: SchoolFacilitiesInput
        performance: PerformanceInput
    }

input LocationInput {
  latitude: Float
  longitude: Float
}

input EnrollmentDataInput {
  totalStudents: Int
  maleStudents: Int
  femaleStudents: Int
}

input ContactInfoInput {
 headTeacher: String
  email: String
  phone: String
}

input InfrastructureInput {
  studentComputers: Int
  teacherComputers: Int
  projectors: Int
  smartBoards: Int
  tablets: Int
  laptops: Int
  hasComputerLab: Boolean
  labCondition: String
  powerBackup: [String]
  hasICTRoom: Boolean
  hasElectricity: Boolean
  hasSecureRoom: Boolean
  hasFurniture: Boolean
}

input InternetInput {
  connectionType: String
  bandwidthMbps: Int
  wifiCoverage: [String]
  stability: String
  hasUsagePolicy: Boolean
  provider: String
  isStable: Boolean
}

input SoftwareInput {
  hasLMS: Boolean
  lmsName: String
  hasLicensedSoftware: Boolean
  licensedSoftware: [String]
  hasProductivitySuite: Boolean
  productivitySuite: [String]
  hasDigitalLibrary: Boolean
  hasLocalContent: Boolean
  contentSource: String
}

input HumanCapacityInput {
  ictTrainedTeachers: Int
  totalTeachers: Int
  maleTeachers: Int
  femaleTeachers: Int
  p5ToP7Teachers: Int
  supportStaff: Int
  monthlyTrainings: Int
  teacherCompetencyLevel: String
  hasCapacityBuilding: Boolean
}

input PedagogicalUsageInput {
  ictIntegratedLessons: Int
  usesICTAssessments: Boolean
  hasStudentProjects: Boolean
  usesBlendedLearning: Boolean
  hasAssistiveTech: Boolean
  digitalToolUsageFrequency: String
  hasDigitalContent: Boolean
  hasPeerSupport: Boolean
}

input GovernanceInput {
  hasICTPolicy: Boolean
  alignedWithNationalStrategy: Boolean
  hasICTCommittee: Boolean
  hasICTBudget: Boolean
  hasMonitoringSystem: Boolean
  hasActiveSMC: Boolean
  hasActivePTA: Boolean
  hasLocalLeaderEngagement: Boolean
}

input StudentEngagementInput {
  digitalLiteracyLevel: String
  hasICTClub: Boolean
  usesOnlinePlatforms: Boolean
  studentFeedbackRating: Int
  studentsUsingDigitalContent: Int
}

input CommunityEngagementInput {
  hasParentPortal: Boolean
  hasCommunityOutreach: Boolean
  hasIndustryPartners: Boolean
  partnerOrganizations: [String]
  ngoSupport: [String]
  communityContributions: [String]
}

input SecurityInput {
  isFenced: Boolean
  hasSecurityGuard: Boolean
  hasRecentIncidents: Boolean
  incidentDetails: String
  hasToilets: Boolean
  hasWaterSource: Boolean
}

input AccessibilityInput {
  distanceFromHQ: Float
  isAccessibleAllYear: Boolean
  isInclusive: Boolean
  servesGirls: Boolean
  servesPWDs: Boolean
  servesRefugees: Boolean
  isOnlySchoolInArea: Boolean
}

input SchoolFacilitiesInput {
  permanentClassrooms: Int
  semiPermanentClassrooms: Int
  temporaryClassrooms: Int
  pupilClassroomRatio: Float
  boysToilets: Int
  girlsToilets: Int
  staffToilets: Int
  waterAccess: String
  securityInfrastructure: [String]
  schoolAccessibility: String
  nearbyHealthFacility: String
  healthFacilityDistance: Float
}

input PerformanceInput {
  plePassRateYear1: Float
  plePassRateYear2: Float
  plePassRateYear3: Float
  literacyTrends: String
  numeracyTrends: String
  innovations: String
  uniqueAchievements: String
}

    enum SchoolType {
        public
        private
    }

    enum Environment {
        urban
        rural
        suburban
    }

    enum InternetConnection {
    None
    Slow
    Medium
    Fast
    }

    enum PowerSource {
    NationalGrid
    Solar
    Generator
    }

    enum OwnershipType {
        government
        government_aided
        community
    }

    enum SchoolCategory {
        mixed
        girls
        boys
        special_needs
    }

    enum DigitalToolUsage {
        daily
        weekly
        rarely
        never
    }
`;

export default schoolTypDefs;
