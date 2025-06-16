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
    }

    input UpdateUserInput {
        id: ID!
        email: String
        firstName: String
        lastName: String
        role: UserRole
        isActive: Boolean
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
        deleteUser(id: ID!): UserResponse!
        toggleUserStatus(id: ID!): UserResponse!
        login(email: String!, password: String!) :UserResponse!
    }
`;

export default userTypeDefs;
