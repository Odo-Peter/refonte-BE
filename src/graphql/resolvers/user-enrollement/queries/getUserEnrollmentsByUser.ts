import { IDataSources } from "../../../../types/datasource";
import { verifyJWT } from "../../../../utils/auth";

export default async function getUserEnrollmentsByUser(
  parent: any,
  { completed }: { completed?: boolean },
  { dataSources, token }: { dataSources: IDataSources; token: string }
) {
  try {
    const decodedToken: any = await verifyJWT(token);
    if (!token || !decodedToken.id) {
      return {
        userEnrollments: null,
        response: {
          status: 401,
          message: "Unauthorized, token invalid",
        },
      };
    }


    const userEnrollments =
      await dataSources.userEnrollment.getUserEnrollmentsByUser(
        decodedToken.email,
        completed
      );

    return {
      userEnrollments,
      response: {
        status: 200,
        message: "Query successful!",
      },
    };
  } catch (error: any) {
    return {
      userEnrollments: null,
      response: {
        status: error?.statusCode ?? 400,
        message: error?.statusCode
          ? "Unauthorized, token invalid"
          : "Query failed!",
      },
    };
  }
}
