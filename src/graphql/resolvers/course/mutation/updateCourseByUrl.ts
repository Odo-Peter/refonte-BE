import { ICourse } from "../../../../types/course";
import { IDataSources } from "../../../../types/datasource";
import { verifyJWT } from "../../../../utils/auth";

export default async function updateCourseByUrl(
  parents: any,
  { url, course }: { url: string; course: Partial<ICourse> },
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

    const updatedCourse = await dataSources.course.updateByUrl(url, course);

    if (!updatedCourse) {
      return {
        course: null,
        response: {
          status: 400,
          message: `Course "${course}" not found!`,
        },
      };
    }

    return {
      course: updatedCourse,
      response: {
        status: 200,
        message: "Course update successful!",
      },
    };
  } catch (error: any) {
    console.log(error);
    return {
      course: null,
      response: {
        status: 400,
        response: {
          status: error?.statusCode ?? 400,
          message: error?.statusCode
            ? "Unauthorized, token invalid"
            : "Failed to update course",
        },
      },
    };
  }
}
