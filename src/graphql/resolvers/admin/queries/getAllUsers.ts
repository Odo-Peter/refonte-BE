import { IDataSources } from '../../../../types/datasource';

export default async function getAllUsers(parent: any, args: any, { dataSources }: { dataSources: IDataSources }) {
  try {
    const users = await dataSources.user.getUsers();

    return {
      users: users,
      response: {
        status: 200,
        message: 'Users fetched by admin successfully',
      },
    };
  } catch (error) {
    console.log(error);

    // error handling is still poorly done
    return {
      users: [],
      response: {
        status: 400,
        message: 'Failed to get users',
      },
    };
  }
}
