const schoolPeriodicObservationsTypDefs = `#graphql
    scalar Date
    scalar DateString
    type SchoolPeriodicObservation {
        id: ID!
        school_id: ID!
        date: DateString!
        period: String!
        infrastructure: Infrastructure
        usage: Usage
        software: Software
        capacity: Capacity
    }

        type Infrastructure {
        computers: Int
        tablets: Int
        projectors: Int
        printers: Int
        internet_connection: String
        internet_speed_mbps: Int
        power_source: [String!]
        power_backup: Boolean
        functional_devices: Int
    }

        type Usage {
        teachers_using_ict: Int
        total_teachers: Int
        weekly_computer_lab_hours: Int
        student_digital_literacy_rate: Int
        }

        type Software {
        operating_systems: [String!]
        educational_software: [String!]
        office_applications: Boolean
        }

        type Capacity {
        ict_trained_teachers: Int
        support_staff: Int
        }

    type Query {
        school_periodic_observations(limit: Int, offset: Int, school_id: ID): [SchoolPeriodicObservation]
    }

    type Mutation {
        add_school_periodic_observation(payload: SchoolPeriodicObservationInput!): ResponseMessage!
    }

    input SchoolPeriodicObservationInput {
        id: ID
        schoolId: ID!
        date: Date!
        period: String!
        infrastructure: PeriodicInfrastructureInput
        usage: UsageInput
        software: SoftwareInput
        capacity: CapacityInput
    }

    input PeriodicInfrastructureInput {
        computers: Int
        tablets: Int
        projectors: Int
        printers: Int
        internetConnection: String
        internetSpeedMbps: Int
        powerSource: [String!]
        powerBackup: Boolean
        functionalDevices: Int
    }

    input UsageInput {
        teachersUsingICT: Int
        totalTeachers: Int
        weeklyComputerLabHours: Int
        studentDigitalLiteracyRate: Int
    }
  
  input SoftwareInput {
    operatingSystems: [String!]
    educationalSoftware: [String!]
    officeApplications: Boolean
    }
    
    input CapacityInput {
        ictTrainedTeachers: Int
        supportStaff: Int
    }
`

export default schoolPeriodicObservationsTypDefs;