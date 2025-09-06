const appsTypeDefs = `#graphql
    type App {
        id: ID!,
        title: String!,
        description: String!,
        route: String!,
        logo: String!
    }

    type Query {
        apps: [App]!
    }

`;

export default appsTypeDefs;
