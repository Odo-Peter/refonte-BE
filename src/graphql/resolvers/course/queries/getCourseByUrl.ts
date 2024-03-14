import { IDataSources } from "../../../../types/datasource";

export default async function getCourseByUrl(
  parent: any,
  { url }: { url: string },
  { dataSources }: { dataSources: IDataSources }
) {
  try {
    // this to not do useless request to the db
    if (!url) {
      return {
        course: null,
        response: {
          status: 400,
          message: "Failed to get course by url",
        },
      };
    }

    const course = await dataSources.course.getByUrl(url);

    if (!course) {
      return {
        course: null,
        response: {
          status: 400,
          message: "Course not found",
        },
      };
    }

    return {
      course: course,
      response: {
        status: 200,
        message: "Course fetched successfully",
      },
    };
  } catch (error) {
    return {
      course: null,
      response: {
        status: 400,
        message: "Failed to get course by url",
      },
    };
  }
}
