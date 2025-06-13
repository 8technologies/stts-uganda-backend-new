const schoolTypDefs = `#graphql
    scalar DateTime
    type School {
        id: ID!,
        name: String!,
        emis_number: String,
        upi_code: String,
        ownership_type: OwnershipType,
        school_category: SchoolCategory,
        year_established: String,
        head_teacher_name: String,
        head_teacher_contact: String,
        district: String,
        region: String,
        sub_county: String,
        parish: String,
        distance_from_achor_hq: String,
        latitude: String,
        longitude: String,
        total_enrollment: Int,
        total_teachers: Int,
        male_teachers: Int,
        female_teachers: Int,
        num_of_staff: Int,
        signature_program: String,
        
        # Section 2: Infrastructure
        has_electricity: Boolean,
        electricity_planned: Boolean,
        has_secure_room_for_ict: Boolean,
        has_computer_lab: Boolean,
        has_furniture: Boolean,
        computers: Int,
        tablets: Int,
        smartphones: Int,
        projectors: Int,
        interactive_whiteboards: Int,
        other_devices: String
        
        # Section 3: Connectivity
        has_internet: Boolean,
        connection_types: [String],
        is_connection_stable: Boolean,
        internet_provider: String,
        # willing_toSubscribe: boolean;
        
        # Section 4: Security & Safety
        is_fenced: Boolean,
        has_security_guard: Boolean,
        has_theft_incidents: Boolean,
        theft_details: String,
        has_toilets: Boolean,
        has_water_source: Boolean
        
        # Section 5: Accessibility
        within_30km_from_archor_school: Boolean,
        accessible_all_year: Boolean,
        is_inclusive: [String],
        serves_special_needs: Boolean
        
        # Section 6: Digital Readiness
        ict_trained_teachers: Int,
        digital_tool_usage: DigitalToolUsage,
        has_digital_content: Boolean,
        content_source: String,
        has_peer_support: Boolean,
        ongoing_capacity_building: String
        
        # Section 7: Environment & Governance
        location_type: Environment,
        permanent_classrooms: Int,
        semi_permanent_classrooms: Int,
        temporary_classrooms: Int,
        pupil_classroom_ratio: Int,
        boys_toilets: Int,
        girls_toilets: Int,
        staff_toilets: Int,
        water_access: [String],
        security_infrastructure: [String],
        school_accessibility: String,
        nearby_health_facility: String,
        has_active_smc: Boolean,
        has_active_pta: Boolean,
        engagement_with_deo: Boolean,
        ngo_support: String,
        community_contributions: String,
        ple_pass_rate: String,
        literacy_trends: String,
        digital_content_users: String,
        innovations: String
        
        # Final Assessment
        assessor_notes: String,
        assessed_by: String,
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
     name: String!,
     emisNumber: String!,
     upiCode: String!,
     ownershipType: OwnershipType!,
     schoolCategory: SchoolCategory!,
     signatureProgram: String!,
     yearEstablished: String!,
    headTeacherName: String!,
    headTeacherContact: String!,
    district: String!,
    subCounty: String!,
    parish: String!,
    latitude: String!,
    longitude: String!,
    distanceFromHQ: String!,
    totalEnrollment: String!,
    totalTeachers: String!,
    maleTeachers: String!,
    femaleTeachers: String!,
    p5p7Staff: String!,
    region: String!,
    locationType: Environment!,
    hasElectricity: Boolean!,
    electricityPlanned: Boolean!,
    hasSecureRoom: Boolean!,
    hasComputerLab: Boolean!,
    hasFurniture: Boolean!,
    computers: String!,
    tablets: String!,
    smartphones: String!,
    projectors: String!,
    interactiveWhiteboards: String!,
    otherDevices: String!,
    hasInternet: Boolean!,
    connectionTypes: [String]!,
    isConnectionStable: Boolean!,
    internetProvider: String!,
    willingToSubscribe: Boolean,
    isFenced: Boolean!,
    hasSecurityGuard: Boolean!,
    hasTheftIncidents: Boolean,
    theftDetails: String,
    hasToilets: Boolean,
    hasWaterSource: Boolean,
    within30km: Boolean,
    accessibleAllYear: Boolean,
    isInclusive: [String]!,
    servesSpecialNeeds: Boolean,
    ictTrainedTeachers: String!,
    digitalToolUsage: DigitalToolUsage!,
    hasDigitalContent: Boolean!,
    contentSource: String,
    hasPeerSupport: Boolean,
    ongoingCapacityBuilding: String,
    permanentClassrooms: String!,
    semiPermanentClassrooms: String!,
    temporaryClassrooms: String!,
    pupilClassroomRatio: String!,
    boysToilets: String!,
    girlsToilets: String!,
    staffToilets: String!,
    waterAccess: [String]!,
    securityInfrastructure: [String]!,
    schoolAccessibility: String!,
    nearbyHealthFacility: String!,
    hasActiveSMC: Boolean!,
    hasActivePTA: Boolean!,
    engagementWithDEO: Boolean,
    ngoSupport: String,
    communityContributions: String,
    plePassRate: String,
    literacyTrends: String,
    digitalContentUsers: String,
    innovations: String,
    assessorNotes: String,
    # assessedBy: 
    }

    enum SchoolType {
        Public
        Private
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
