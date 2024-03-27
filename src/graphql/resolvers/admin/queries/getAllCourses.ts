import { IDataSources } from '../../../../types/datasource';

export default async function getAllCourses(parent: any, args: any, { dataSources }: { dataSources: IDataSources }) {
  try {
    const courses = await dataSources.course.getAll();

    return {
      courses: courses,
      response: {
        status: 200,
        message: 'Courses fetched by admin successfully',
      },
    };
  } catch (error) {
    console.log(error);

    // error handling is still poorly done
    return {
      courses: [],
      response: {
        status: 400,
        message: 'Failed to get courses',
      },
    };
  }
}
