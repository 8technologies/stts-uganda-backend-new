const schoolPeriodicObservationsTypDefs = `#graphql
    type SchoolPeriodicObservation {
    id: ID!
    school_id: ID!
    observation_date: String! 
    term_quarter: String!
    p6_registered: Int!
    p6_present: Int!
    p6_notes: String!
    p7_registered: Int!
    p7_present: Int!
    p7_notes: String!
    teacher_attendance_total: Int!
    teacher_attendance_present: Int!
    teacher_attendance_absent: Int!
    dropouts_total: Int!
    dropouts_male: Int!
    dropouts_female: Int!
    dropouts_reasons: String!
    digital_subjects: String!
    lesson_frequency: String
    teachers_using_digital: String!
    good_lesson_observed: String!
    peer_support: Boolean!
    learners_engaged: Boolean!
    learners_using_devices: Int!
    engagement_level: String!
    challenges: [String]!
    # devices: Devices!
    laptops_total: Int
    laptops_working: Int
    laptops_not_working: Int
    laptops_notes: String
    projectors_total: Int
    projectors_working: Int
    projectors_not_working: Int
    projectors_notes: String
    routers_total: Int
    routers_working: Int
    routers_not_working: Int
    routers_notes: String
    solar_total: Int
    solar_working: Int
    solar_not_working: Int
    solar_notes: String
    device_storage: Boolean
    sign_in_register: Boolean
    power_available: [String]
    internet_status: String
    content_sources: String
    new_content_introduced: Boolean
    learner_access_levels: String
    head_teacher_involved: Boolean
    ict_coordinator: Boolean
    ict_schedule: Boolean
    smc_meeting: Boolean
    ict_discussions: Boolean
    community_engagement: [String]
    achievements: String
    infrastructure_challenges: String
    training_challenges: String
    connectivity_challenges: String
    content_challenges: String
    other_challenges: String
    immediate_actions: String
    capacity_building_needs: String
    support_requests: String
    # scores: Scores!
    learner_attendance: Int
    teacher_attendance: Int
    digital_tools_use: Int
    infrastructure_condition: Int
    internet_availability: Int
    management_support: Int
    next_visit: String

    # Notes
    assessor_notes: String
    assessed_by: String
    created_at: String
    updated_at: String
    }

    type Query {
        school_periodic_observations(limit: Int, offset: Int, school_id: ID): [SchoolPeriodicObservation]
    }

    type Mutation {
        add_school_periodic_observation(payload: SchoolPeriodicObservationInput!): ResponseMessage!
    }

    input SchoolPeriodicObservationInput {
        school_id: ID!
        termQuarter: String!,
        classAttendance: ClassAttendanceInput,
        teacherAttendance: TeacherAttendanceInput,
        dropouts: DropoutsInput,
        digitalSubjects: String,
        lessonFrequency: String,
        teachersUsingDigital: String,
        goodLessonObserved: String,
        peerSupport: Boolean,
        learnersEngaged: Boolean,
        learnersUsingDevices: Int,
        engagementLevel: String,
        challenges: [String]!,
        devices: Devices,
        deviceStorage: Boolean,
        signInRegister: Boolean,
        powerAvailable: [String],
        internetStatus: String,
        contentSources: String,
        newContentIntroduced: Boolean,
        learnerAccessLevels: String,
        headTeacherInvolved: Boolean,
        ictCoordinator: Boolean,
        ictSchedule: Boolean,
        smcMeeting: Boolean,
        ictDiscussions: Boolean,
        communityEngagement: [String],
        achievements: String,
        infrastructureChallenges: String,
        trainingChallenges: String,
        connectivityChallenges: String,
        contentChallenges: String,
        otherChallenges: String,
        immediateActions: String,
        capacityBuildingNeeds: String,
        supportRequests: String,
        scores: ScoresInput,
        nextVisit: String
    }

    input ScoresInput {
        learnerAttendance: Int,
        teacherAttendance: Int,
        digitalToolsUse: Int,
        infrastructureCondition: Int,
        internetAvailability: Int,
        managementSupport: Int
    }


    input ClassAttendanceInput {
        p6Registered: Int,
        p6Present: Int,
        p6Notes: String,
        p7Registered: Int,
        p7Present: Int,
        p7Notes: String
    }

    input TeacherAttendanceInput {
        totalAssigned: Int,
        present: Int,
        absentTeachers: String
    }

    input DropoutsInput {
        number: Int,
        maleDropouts: Int,
        femaleDropouts: Int,
        reasons: String
    }

    input Devices {
            laptopsTotal: Int,
            laptopsWorking: Int,
            laptopsNotWorking: Int,
            laptopsNotes: String,
            projectorTotal: Int,
            projectorWorking: Int,
            projectorNotWorking: Int,
            projectorNotes: String,
            routerTotal: Int,
            routerWorking: Int,
            routerNotWorking: Int,
            routerNotes: String,
            solarTotal: Int,
            solarWorking: Int,
            solarNotWorking: Int,
            solarNotes: String
        }
    
`

export default schoolPeriodicObservationsTypDefs;