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
        souce_of_seed: String
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
        type: String
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
        cropping_histroy: String
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

    enum StatusType {
       pending
       accept
       reject
       halt
       assign_inspector
       recommend 
    }

    type Query {
        sr4_applications: [SR4ApplicationForm!]!
        sr6_applications:[SR6ApplicationForm!]!
        qds_applications:[SR4ApplicationForm!]!
    }

    type Mutation{
        saveForm(payload: GenericFormInput!, form: String) : FormResponseMessage
    }

    input GenericFormInput {
        form_sr4s: SR4ApplicationFormInput
        form_sr6s: SR6ApplicationFormInput
        # qds: QDSApplicationFormInput
    }


    input SR4ApplicationFormInput {
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
        souce_of_seed: String
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
        type: String
        processing_of_other: String
    }

    input SR6ApplicationFormInput {
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
        cropping_histroy: String
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

    type FormResponseMessage{
        success: Boolean
        message: String
        data: JSON
    }


   

`;

export default applicationFormsTypeDefs;
