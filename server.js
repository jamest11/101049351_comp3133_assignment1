import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import { resolvers as employeeResolvers } from './graphql/Employee/resolvers.js';
import { resolvers as userResolvers } from './graphql/User/resolvers.js';

import { typeDefs as userTypeDefs } from './graphql/User/types.js';
import { typeDefs as employeeTypeDefs } from './graphql/Employee/types.js';

const typeDefs = `#graphql
  ${userTypeDefs.types}
  ${employeeTypeDefs.types}

  type Query {
    ${userTypeDefs.queries}
    ${employeeTypeDefs.queries}
  }

  type Mutation {
    ${userTypeDefs.mutations}
    ${employeeTypeDefs.mutations}
  }
`;

const resolvers = {
  Query: {
    ...userResolvers.queries,
    ...employeeResolvers.queries  
  },

  Mutation: {
    ...userResolvers.mutations,
    ...employeeResolvers.mutations
  }
};

const getUser = (token) => {
  try {
      if (token) {
          return jwt.verify(token, process.env.TOKEN_KEY);
      }
      return null
  } 
  catch (error) {
      return null
  }
};

const connectDb = async () => {
  mongoose.set('strictQuery', false);
  mongoose.connect(process.env.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: 'assignment1'
  });
};


const app = express();
const httpServer = http.createServer(app);

connectDb()
    .then(console.log('Successfully connected to the database mongoDB Atlas Server'))
    .catch((err) => {
        console.log('Could not connect to the database. Exiting now...', err);
        process.exit();
    });

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();

app.use(
  cors(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => { 
      const token = req.headers.authorization;
      const user = getUser(token);

      return { user }
    },
  }),
);

await new Promise((resolve) => httpServer.listen({ port: process.env.API_PORT }, resolve));
console.log(`Apollo server ready at http://localhost:${process.env.API_PORT}`);
