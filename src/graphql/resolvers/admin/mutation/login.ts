import { IDataSources } from '../../../../types/datasource';
import { IUser, IUserDocument } from '../../../../types/user';

import dotenv from 'dotenv';
import logger from '../../../../utils/logger';
import { generateJWT } from '../../../../utils/auth';
dotenv.config();

const loginAdmin = async (parent: any, { email, password }: any, { dataSources }: { dataSources: IDataSources }) => {
  try {
    const admin = await dataSources.admin.getByEmail(email);
    if (!admin) {
      logger.info('Administrator does not exist!');
      return {
        response: {
          status: 404,
          message: 'Email does not exist! Please verify and try again',
        },
      };
    }

    const matchPassword = await admin.isValidPassword(password);
    if (!matchPassword) {
      return {
        response: {
          status: 401,
          message: 'Invalid password! Please verify and try again',
        },
      };
    }

    const jwtToken = await generateJWT({
      id: admin._id.toString(),
      email,
      name: admin.name,
      role: admin.role,
    });

    return {
      token: jwtToken,
      admin: admin,
      response: {
        status: 200,
        message: 'Login Successful!',
      },
    };
  } catch (error: any) {
    logger.error(error);
    return {
      token: null,
      admin: null,
      response: {
        status: 404,
        message: 'Invalid password! Please verify and try again',
      },
    };
  }
};

export default loginAdmin;
