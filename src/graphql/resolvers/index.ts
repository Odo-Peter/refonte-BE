import userEnrollmentMutation from './user-enrollement/mutation';
import userMutation from './user/mutation';
import userQuery from './user/queries';
import adminQuery from './admin/queries';
import adminMutation from './admin/mutation';
import domainMutation from './domain/mutation';
import domainQuery from './domain/queries';
import courseMutation from './course/mutation';
import courseQuery from './course/queries';
import stripeMutation from './stripe/mutation';
import paypalMutation from './paypal/mutation';
import stripeQuery from './stripe/queries';
import userCourseQueries from './user-course/queries';
import userEnrollmentQuery from './user-enrollement/queries';

const resolvers = {
  Mutation: {
    ...userMutation,
    ...adminMutation,
    ...userEnrollmentMutation,
    ...domainMutation,
    ...courseMutation,
    ...stripeMutation,
    ...paypalMutation,
  },
  Query: {
    ...userCourseQueries,
    ...userQuery,
    ...adminQuery,
    ...domainQuery,
    ...courseQuery,
    ...stripeQuery,
    ...userEnrollmentQuery,
  },
};
export default resolvers;
