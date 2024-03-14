import { ICourse } from "../../../../types/course";
import { IDataSources } from "../../../../types/datasource";
import logger from "../../../../utils/logger";

export default async function createCourse(parent: any, { payload }: { payload: Omit<ICourse, "_id"> }, { dataSources }: { dataSources: IDataSources }) {
  try {
    const existingDomain = await dataSources.domain.getById(payload.domain);

    if (!existingDomain) {
      return {
        course: null,
        response: {
          status: 404,
          message: `Domain does not exist.`,
        },
      };
    }

    logger.info({ name: payload.name, domain: existingDomain._id }, "existingDomain");
    const existingCourse = await dataSources.course.getByNameAndDomain(payload.name, existingDomain._id);

    logger.info(existingCourse, "existingCourse");

    if (existingCourse) {
      return {
        course: null,
        response: {
          status: 409,
          message: `Course already exists in ${existingDomain.name} domain. Please use another domain or course name.`,
        },
      };
    }

    const urlReg = /(https:\/\/www\.|http:\/\/www\.|https:\/\/|http:\/\/)?[a-zA-Z0-9]{2,}(\.[a-zA-Z0-9]{2,})(\.[a-zA-Z0-9]{2,})?/;

    if (!urlReg.test(payload.image)) {
      return {
        course: null,
        response: {
          status: 400,
          message: `Please provide a valid image URL.`,
        },
      };
    }

    const course = await dataSources.course.create(payload);

    if (course) {
      existingDomain.courses.push(course._id);
      await (existingDomain as any).save();
    }

    return {
      course: course,
      response: {
        status: 201,
        message: "Course created successfully",
      },
    };
  } catch (error) {
    logger.error(error);
    return {
      course: null,
      response: {
        status: 400,
        message: "Course creation failed",
      },
    };
  }
}
