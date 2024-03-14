import { IDataSources } from "../../../../types/datasource";
import logger from "../../../../utils/logger";

export default async function registerUser(
  parent: any,
  { name, email, password }: { name: string; email: string; password: string },
  { dataSources }: { dataSources: IDataSources }
) {
  try {
    const existingUser = await dataSources.user.getByEmail(email);

    if (existingUser) {
      return {
        user: null,
        response: {
          status: 409,
          message:
            "Your email already exists. Try to login instead or use another email",
        },
      };
    }
    const user = await dataSources.user.create({ name, email, password });

    return {
      user: user,
      response: {
        status: 201,
        message: "User created successfully",
      },
    };
  } catch (error) {
    logger.error(error);

    // error handling is still poorly done
    return {
      user: null,
      response: {
        status: 400,
        message: "User creation failed",
      },
    };
  }
}
