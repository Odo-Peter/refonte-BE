import { IDataSources } from '../../../../types/datasource';
import { IUser, IUserDocument } from '../../../../types/user';

import dotenv from 'dotenv';
import logger from '../../../../utils/logger';
import { generateJWT } from '../../../../utils/auth';
dotenv.config();

const loginUser = async (parent: any, { email, password }: any, { dataSources }: { dataSources: IDataSources }) => {
  try {
    const user = await dataSources.user.getByEmail(email);
    if (!user) {
      logger.info('User does not exist!');
      return {
        response: {
          status: 404,
          message: 'Email does not exist! Please verify and try again',
        },
      };
    }

    const matchPassword = await user.isValidPassword(password);
    if (!matchPassword) {
      return {
        response: {
          status: 401,
          message: 'Invalid password! Please verify and try again',
        },
      };
    }

    const jwtToken = await generateJWT({
      id: user._id.toString(),
      email,
      name: user.name,
    });

    return {
      token: jwtToken,
      user: user,
      response: {
        status: 200,
        message: 'Login Successful!',
      },
    };
  } catch (error: any) {
    logger.error(error);
    return {
      token: null,
      user: null,
      response: {
        status: 404,
        message: 'Invalid password! Please verify and try again',
      },
    };
  }
};

export default loginUser;
