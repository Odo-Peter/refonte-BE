import { IDataSources } from '../../../../types/datasource';

export default async function getAdmins(parent: any, args: any, { dataSources }: { dataSources: IDataSources }) {
  try {
    const admins = await dataSources.admin.getAdmins();

    return {
      admins: admins,
      response: {
        status: 200,
        message: 'Administrators fetched successfully',
      },
    };
  } catch (error) {
    console.log(error);

    // error handling is still poorly done
    return {
      admins: [],
      response: {
        status: 400,
        message: 'Failed to get administrators',
      },
    };
  }
}
