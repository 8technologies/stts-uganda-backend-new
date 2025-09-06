const userTypeDefs = `#graphql
    scalar DateTime

    type User {
        id: ID!
        salutation: String,
        surname: String!
        other_names: String!,
        email: String!
        role_id: String!,
        role: Role!
        is_active: Boolean!
        last_modified_at: DateTime!
        last_modified_by: String!
    }


    input CreateUserInput {
        id: ID,
        email: String!
        firstName: String!
        lastName: String!
        # role: Role!
        password: String!
        district: String
        subcounty: String
        school_id: String
    }

    input UpdateUserInput {
        id: ID!
        email: String
        firstName: String
        lastName: String
        # role: Role
        isActive: Boolean
        district: String
        subcounty: String
        school_id: String
    }

    type UserResponse {
        success: Boolean!
        message: String
        user: User
    }

    type UserLoginResponse {
        success: Boolean!
        message: String
        token: String!
        user: User
    }


    type Query {
        users: [User!]!
        user(id: ID!): User
        currentUser: User
    }

    type Mutation {
        createUser(payload: CreateUserInput!): UserResponse!
        updateUser(payload: UpdateUserInput!): UserResponse!
        toggleUserStatus(id: ID!): UserResponse!
        login(username: String!, password: String!) :UserLoginResponse!
        resetPassword(id: String!, newPassword: String!): UserResponse!
        deleteUser(user_id: String!): UserResponse
    }
`;

export default userTypeDefs;
