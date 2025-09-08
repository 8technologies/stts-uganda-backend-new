const userTypeDefs = `#graphql
    scalar Date

    type Role {
        id: ID!
        name: String!,
        description: String,
        permissions: String
    }

    type Query {
        roles: [Role!]!
        all_roles: [Role!]!
    }

      type Mutation {
        saveRole(payload: RoleInput!): ResponseMessage
        deleteRole(role_id: ID!): ResponseMessage
    }

    input RoleInput {
        id: ID
        role_name: String!
        description: String
    }

`;

export default userTypeDefs;
