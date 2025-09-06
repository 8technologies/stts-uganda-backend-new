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
        user(id: ID!): User
        currentUser: User
    }

   
`;

export default userTypeDefs;
