const userTypeDefs = `#graphql
    scalar Date

    type User {
        id: ID!
        email: String!
        first_name: String!
        last_name: String!
        role: UserRole!
        is_active: Boolean!
        created_at: Date!
        updated_at: Date!
    }

    enum UserRole {
        ADMIN
        SCHOOL_ADMIN
        MINISTRY_ADMIN
        DISTRICT_ADMIN
        VIEWER
    }

    input CreateUserInput {
        id: ID,
        email: String!
        firstName: String!
        lastName: String!
        role: UserRole!
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
        role: UserRole
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

    type Query {
        users: [User!]!
        user(id: ID!): User
        currentUser: User
    }

    type Mutation {
        createUser(payload: CreateUserInput!): UserResponse!
        updateUser(payload: UpdateUserInput!): UserResponse!
        toggleUserStatus(id: ID!): UserResponse!
        login(email: String!, password: String!) :UserResponse!
        resetPassword(id: String!, newPassword: String!): UserResponse!
        deleteUser(user_id: String!): UserResponse
    }
`;

export default userTypeDefs;
