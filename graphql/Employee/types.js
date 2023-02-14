const types = `
  type Employee {
    _id: ID
    first_name: String
    last_name: String
    email: String
    gender: String
    salary: Float
  }
`;

const queries = `
  getEmployees: [Employee]

  getEmployee(eid: ID!): Employee
`;

const mutations = `
  createEmployee(
    first_name: String!
    last_name: String!
    email: String!
    gender: String!
    salary: Float!
  ): Employee

  updateEmployee(
    eid: ID!
    first_name: String
    last_name: String
    email: String
    gender: String
    salary: Float
  ): Employee

  deleteEmployee(eid: ID!): String
`;

export const typeDefs = { types, queries, mutations };