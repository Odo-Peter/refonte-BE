import { IDataSources } from '../../../../types/datasource';
import { verifyJWT } from '../../../../utils/auth';

export default async function upgradeUser(parent: any, { email }: { email: string }, { dataSources, token }: { dataSources: IDataSources; token: string }) {
  try {
    const user = await dataSources.user.getByEmail(email);

    if (!user) {
      return {
        response: {
          status: 404,
          message: 'No user with this email found, please verify',
        },
      };
    }

    // const decodedToken: any = await verifyJWT(token);

    // console.log('Token here <===', decodedToken);

    // if (!token || decodedToken.role !== 'ADMIN') {
    //   return {
    //     response: {
    //       status: 401,
    //       message: 'Unauthorized, token invalid',
    //     },
    //   };
    // }

    const updatedUser = await dataSources.user.upgradeUserToAdmin({ email: email }, { role: 'ADMIN' });

    return {
      admin: updatedUser,
      response: {
        status: 200,
        message: 'User upgraded to an administrator successfully',
      },
    };
  } catch (error) {
    console.log(error);

    // error handling is still poorly done
    return {
      user: [],
      response: {
        status: 400,
        message: 'Failed to upgrade user',
      },
    };
  }
}
