const userTypeDefs = `#graphql
    scalar DateTime

    type User {
        id: ID!
        username: String!
        first_name: String!
        other_names: String!
        email: String!
        district: String!
        image: String
        created_at: DateTime!
        updated_at: DateTime!
    }


    input CreateUserInput {
        id: ID,
        username: String!
        first_name: String!
        other_names: String!
        password: String!
        email: String!
        district: String!
        image: String
    }

    input UpdateUserInput {
        id: ID!
        email: String
        firstName: String
        lastName: String
        isActive: Boolean
        district: String
        subcounty: String
        school_id: String
    }


    type Query {
        users: [User!]!
        user(id: ID!): User
        currentUser: User
        me: User
    }

    type Mutation {
        login(username: String!, password: String!) :UserLoginResponse!
        createUser(payload: CreateUserInput!): UserResponse!
        updateUser(payload: UpdateUserInput!): UserResponse!
        toggleUserStatus(id: ID!): UserResponse!
        resetPassword(id: String!, newPassword: String!): UserResponse!
        deleteUser(user_id: String!): UserResponse
    }
`;

export default userTypeDefs;
