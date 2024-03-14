import { IDataSources } from '../../../../types/datasource';
import logger from '../../../../utils/logger';

export default async function registerAdmin(
  parent: any,
  { name, email, password }: { name: string; email: string; password: string },
  { dataSources }: { dataSources: IDataSources }
) {
  try {
    const existingAdmin = await dataSources.admin.getByEmail(email);

    if (existingAdmin) {
      return {
        admin: null,
        response: {
          status: 409,
          message: 'Your email already exists. Try to login instead or use another email',
        },
      };
    }
    const admin = await dataSources.admin.create({ name, email, password });

    return {
      admin: admin,
      response: {
        status: 201,
        message: 'Administrator created successfully',
      },
    };
  } catch (error) {
    logger.error(error);

    // error handling is still poorly done
    return {
      admin: null,
      response: {
        status: 400,
        message: 'Administrator creation failed',
      },
    };
  }
}
