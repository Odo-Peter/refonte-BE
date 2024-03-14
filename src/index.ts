import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { ApolloServer } from '@apollo/server';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { loadFiles } from 'graphql-import-files';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { useServer } from 'graphql-ws/lib/use/ws';
import requestIP from 'request-ip';
import resolvers from './graphql/resolvers';
import connectDB from './utils/db';
import { AdminDataSource } from './datasources/admin-datasource';
import AdminModel from './models/admin-model';
import { UserDataSource } from './datasources/user-datasource';
import UserModel from './models/user-model';
import cors, { CorsRequest } from 'cors';
import { expressMiddleware } from '@apollo/server/express4';
import { UserEnrollmentDataSource } from './datasources/user-enrollment-datasource';
import UserEnrollmentModel from './models/user-enrollment-model';
import logger from './utils/logger';
import { DomainDataSource } from './datasources/domain-datasource';
import Domain from './models/domain-model';
import { CourseDataSource } from './datasources/course-datasource';
import Course from './models/course-model';
import UserCourse from './models/user-course-model';
import { UserCourseDataSource } from './datasources/user-course-datasource';
import { PaypalAccessTokenDataSource } from './datasources/paypal-accesstoken-datasource';
import PaypalAccessToken from './models/paypal-accesstoken-model';
import { DepositDataSource } from './datasources/deposit-datasource';
import Deposit from './models/deposit-model';
import { UserApplicationDataSource } from './datasources/user-application-datasource';
import UserApplication from './models/user-application-model';
import { UserBootcampDataSource } from './datasources/user-bootcamp-datasource';
import UserBootcamp from './models/user-bootcamp';

dotenv.config();

const PORT: number = (process.env.PORT as unknown as number) || 4000;

const app = express();

const httpServer = http.createServer(app);

const schema = makeExecutableSchema({
  typeDefs: loadFiles('**/typeDefs/*.{graphql,gql}'),
  resolvers,
});

const server = new ApolloServer<any>({
  schema: schema,
  csrfPrevention: true,
  cache: 'bounded',
  introspection: process.env.NODE_ENV !== 'production',
  plugins: [
    // ApolloServerPluginLandingPageDisabled(),
    ApolloServerPluginDrainHttpServer({ httpServer }),
    // not needed until adding Websocket
    // {
    //   async serverWillStart() {
    //     return {
    //       async drainServer() {
    //         await serverCleanup.dispose();
    //       },
    //     };
    //   },
    // },
  ],
});

const dataSources = {
  admin: new AdminDataSource(AdminModel),
  user: new UserDataSource(UserModel),
  userEnrollment: new UserEnrollmentDataSource(UserEnrollmentModel),
  domain: new DomainDataSource(Domain),
  course: new CourseDataSource(Course),
  userCourse: new UserCourseDataSource(UserCourse),
  paypalAccessToken: new PaypalAccessTokenDataSource(PaypalAccessToken),
  deposit: new DepositDataSource(Deposit),
  userApplication: new UserApplicationDataSource(UserApplication),
  userBootcamp: new UserBootcampDataSource(UserBootcamp),
};

async function startServer() {
  connectDB()
    .then(() => {
      console.log('📊 Database connected');
    })
    .catch((err) => {
      console.error('Failed to connect to Mongodb:', err);
    });

  await server.start();

  app.use(
    '/',
    cors<CorsRequest>(),
    express.json({ limit: '50mb' }),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const userCookie = {
          ipAddress: requestIP.getClientIp(req),
          language: req.headers['accept-language'],
          software: req.headers['user-agent'],
        };
        // when needed, add cookie parser here

        return {
          dataSources,
          token: req.headers.authorization || '',
          cookie: userCookie,
          req,
        };
      },
    })
  );

  await new Promise<void>((resolve) => httpServer.listen({ port: PORT }, resolve));
  logger.info(`🚀 Server ready at http://localhost:${PORT}/`);
}

startServer();
