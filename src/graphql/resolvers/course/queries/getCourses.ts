import { IDataSources } from "../../../../types/datasource";
import convertToUserLocalCurrency from "../../../../utils/convertToUserLocalCurrency";
import logger from "../../../../utils/logger";

export default async function getCourses(parent: any, args: any, { dataSources, cookie }: { dataSources: IDataSources; cookie: { ipAddress: string } }) {
  try {
    const courses = await dataSources.course.getAll();
    let currency: null | string = null;

    // Don't forget to specify a dummy IP address for testing. Otherwise, it will not work when you try testing it locally
    // cookie.ipAddress = "154.66.143.159"; // set your ip address here
    const finalCourses = await Promise.all(
      courses.map(async (course: any) => {
        if (!currency) {
          currency = (await convertToUserLocalCurrency(cookie.ipAddress, course.fees.total))?.currency ?? "USD";
        }
        return {
          ...course.toObject(),
          fees: {
            ...course.fees,
            total: (await convertToUserLocalCurrency(cookie.ipAddress, course.fees.total))?.amount ?? course.fees.total,
            installment1: (await convertToUserLocalCurrency(cookie.ipAddress, course.fees.installment1))?.amount ?? course.fees.installment1,
            installment2: (await convertToUserLocalCurrency(cookie.ipAddress, course.fees.installment2))?.amount ?? course.fees.installment2,
          },
        };
      })
    );

    return {
      courses: finalCourses,
      currency,
      response: {
        status: 200,
        message: "Courses fetched successfully",
      },
    };
  } catch (error) {
    logger.error(error);

    return {
      courses: [],
      response: {
        status: 400,
        message: "Failed to get courses",
      },
    };
  }
}
