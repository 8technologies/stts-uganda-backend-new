const systemSettingsTypeDefs = `#graphql
    scalar JSON
    type SystemSetting {
        id: ID!,
        setting_title: String!
        setting_value: JSON!
    }

    type Query {
        system_settings: [SystemSetting]!
    }

`;

export default systemSettingsTypeDefs;
