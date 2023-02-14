const types = `
  type SignInResponse {
    token: String!
  }

  type User {
    username: String!
    password: String!
    email: String!
  }
`;

const queries = `
  signIn(username: String!, password: String!): SignInResponse
`;

const mutations = `
  register(
    username: String!, 
    email: String!, 
    password: String!
  ): User
`;

export const typeDefs = { types, queries, mutations};