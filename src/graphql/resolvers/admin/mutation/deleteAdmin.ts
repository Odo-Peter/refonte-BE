import { IDataSources } from '../../../../types/datasource';
import logger from '../../../../utils/logger';

export default async function deleteAdmin(parent: any, { id }: { id: string }, { dataSources }: { dataSources: IDataSources }) {
  try {
    const existingAdmin = await dataSources.admin.getById(id);

    if (!existingAdmin) {
      return {
        admin: null,
        response: {
          status: 404,
          message: 'No admin found',
        },
      };
    }
    await dataSources.admin.deleteAdmin(id);

    return {
      admin: null,
      response: {
        status: 204,
        message: 'Administrator profile deleted successfully',
      },
    };
  } catch (error) {
    logger.error(error);

    // error handling is still poorly done
    return {
      admin: null,
      response: {
        status: 400,
        message: 'Administrator deletion failed',
      },
    };
  }
}
