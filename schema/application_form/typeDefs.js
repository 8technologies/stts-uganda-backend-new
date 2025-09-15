const applicationFormsTypeDefs = `#graphql
    scalar Date
    scalar JSON
    type SR4ApplicationForm {
        id: ID
        user_id: String
        name_of_applicant: String!
        address: String!
        phone_number: String!
        company_initials: String!
        premises_location: String!
        years_of_experience: String
        experienced_in: String
        dealers_in: String
        processing_of: String
        marketing_of: String
        have_adequate_land: Boolean
        land_size: String
        equipment: String
        have_adequate_equipment: Boolean
        have_contractual_agreement: Boolean
        have_adequate_field_officers: Boolean
        have_conversant_seed_matters: Boolean
        have_adequate_land_for_production: Boolean
        have_internal_quality_program: Boolean
        source_of_seed: String
        receipt: String
        accept_declaration: Boolean
        valid_from: Date
        valid_until: Date
        status: StatusType
        status_comment: String
        recommendation: String
        inspector_id: String
        dealers_in_other: String
        marketing_of_other: String
        have_adequate_storage: Boolean
        seed_board_registration_number: String
        type: Sr4Type
        processing_of_other: String
        inspector: User
        
    }

    type SR6ApplicationForm {
        id: ID
        user_id:String
        name_of_applicant:String
        address:String
        phone_number: String
        company_initials: String
        premises_location: String
        years_of_expirience: String
        dealers_in: String
        previous_grower_number: String
        cropping_history: String
        have_adequate_isolation: Boolean
        have_adequate_labor: Boolean
        aware_of_minimum_standards: Boolean
        signature_of_applicant: String
        grower_number: String
        registration_number: String
        valid_from: Date
        valid_until: Date
        status: StatusType
        inspector_id: String
        status_comment: String
        recommendation: String
        have_adequate_storage: Boolean
        seed_grower_in_past: Boolean
        type: Sr6Type
    }

    type QDsApplicationForm {
        id: ID
        user_id: String
        name_of_applicant: String
        address: String
        phone_number: String
        farm_location: String
        recommendation: String
        certification: String
        company_initials: String
        premises_location: String
        years_of_expirience: String
        dealers_in: String
        previous_grower_number: String
        cropping_history: String
        have_adequate_isolation: Boolean
        have_adequate_labor: Boolean
        aware_of_minimum_standards: Boolean
        signature_of_applicant: String
        grower_number: String
        registration_number: String
        valid_from: Date
        valid_until: Date
        status: StatusType
        inspector_id: String
        status_comment: String
        inspector_comment: String
        have_been_qds:Boolean
        isolation_distance: Int
        number_of_labors: Int
        have_adequate_storage_facility: Boolean
        is_not_used: Boolean
        examination_category: Int
        created_at: Date
        updated_at: Date

    }
    enum Sr4Type {
        seed_merchant
        seed_exporter_or_importer
    }
    enum Sr6Type {
        seed_breeder
        seed_producer
    }

    enum StatusType {
       pending
       accepted
       rejected
       halted
       assigned_inspector
       recommended
    }

    enum FormType {
        sr4
        sr6
        qds
    }

    type Query {
        sr4_applications: [SR4ApplicationForm!]!
        sr4_application_details(id: ID!): SR4ApplicationForm
        sr6_applications:[SR6ApplicationForm!]!
        qds_applications:[QDsApplicationForm!]!
    }

    type Mutation{
        saveSr4Form(payload: SR4ApplicationFormInput!) : Sr4ResponseMessage
        saveSr6Form(payload: SR6ApplicationFormInput!) : Sr6ResponseMessage
    }

    input GenericFormInput {
        form_sr4s: SR4ApplicationFormInput
        form_sr6s: SR6ApplicationFormInput
        # qds: QDSApplicationFormInput
    }


    input SR4ApplicationFormInput {
        id: ID
        name_of_applicant: String!
        address: String!
        phone_number: String!
        company_initials: String!
        premises_location: String!
        years_of_experience: String
        experienced_in: String
        dealers_in: String
        processing_of: String
        marketing_of: String
        have_adequate_land: Boolean
        land_size: String
        equipment: String
        have_adequate_equipment: Boolean
        have_contractual_agreement: Boolean
        have_adequate_field_officers: Boolean
        have_conversant_seed_matters: Boolean
        have_adequate_land_for_production: Boolean
        have_internal_quality_program: Boolean
        source_of_seed: String
        receipt: String
        accept_declaration: Boolean
        valid_from: Boolean
        valid_until: Boolean
        status: StatusType
        status_comment: String
        recommendation: String
        inspector_id: Int
        dealers_in_other: String
        marketing_of_other: String
        have_adequate_storage: Boolean
        seed_board_registration_number: String
        type: Sr4Type
        processing_of_other: String
    }

    input SR6ApplicationFormInput {
        id: ID
        name_of_applicant:String
        address:String
        phone_number: String
        company_initials: String
        premises_location: String
        years_of_experience: String
        dealers_in: String
        previous_grower_number: String
        cropping_history: String
        have_adequate_isolation: Boolean
        have_adequate_labor: Boolean
        aware_of_minimum_standards: Boolean
        signature_of_applicant: String
        grower_number: String
        registration_number: String
        valid_from: Date
        valid_until: Date
        status: StatusType
        inspector_id: String
        status_comment: String
        recommendation: String
        have_adequate_storage: Boolean
        seed_grower_in_past: Boolean
        type: String
    }

    type Sr4ResponseMessage{
        success: Boolean
        message: String
        result: SR4ApplicationForm
    }

    type Sr6ResponseMessage{
        success: Boolean
        message: String
        result: SR6ApplicationForm
    }

`;

export default applicationFormsTypeDefs;
