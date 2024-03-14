import { IDataSources } from "../../../../types/datasource";
import { verifyJWT } from "../../../../utils/auth";
import logger from "../../../../utils/logger";

export default async function getUserCourses(
  parent: any,
  {}: any,
  { dataSources, token }: { dataSources: IDataSources; token: string }
) {
  try {
    logger.info({ token }, "getUserCourses");
    const decodedToken: any = await verifyJWT(token);
    if (!token || !decodedToken.id) {
      return {
        domains: [],
        response: {
          status: 401,
          message: "token missing or invalid",
        },
      };
    }
    const userCourses = await dataSources.userCourse.getByUserId(
      decodedToken.id
    );

    return {
      courses: userCourses.map((userCourse) => userCourse.course),
      response: {
        status: 200,
        message: "Courses fetched successfully",
      },
    };
  } catch (error: any) {
    logger.error(error);

    return {
      courses: [],
      response: {
        status: error?.statusCode ?? 400,
        message: "Failed to get user  Courses",
      },
    };
  }
}
