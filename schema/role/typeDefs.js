const userTypeDefs = `#graphql
    scalar Date

    type Role {
        id: ID!
        name: String!,
        description: String,
        _modules: [App]!
        permissions: String
    }

    type Query {
        roles: [Role!]!
        user(id: ID!): User
        currentUser: User
        all_roles: [Role!]!
        role_modules(role_id: String!): [App]!
    }

      type Mutation {
        saveRole(payload: RoleInput!): ResponseMessage
        updateRolePermissions(payload: RolePermissionInput!): ResponseMessage 
        updateRoleModules(payload: RoleModuleInput!): ResponseMessage 
        deleteRole(role_id: ID!): ResponseMessage
        deleteRoleModule(role_id: String!, module_id: String!): ResponseMessage
    }

    input RoleInput {
        id: ID
        role_name: String!
        description: String
    }

    input RolePermissionInput {
        role_id: ID!
        permissions: String!
    }

    input RoleModuleInput {
        role_id: ID!
        module_ids: [String!]!
    }

   
`;

export default userTypeDefs;
