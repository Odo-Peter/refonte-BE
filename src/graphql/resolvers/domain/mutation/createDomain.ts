import { IDataSources } from "../../../../types/datasource";
import logger from "../../../../utils/logger";

export default async function createDomain(
  parent: any,
  { payload }: { payload: { name: string } },
  { dataSources }: { dataSources: IDataSources }
) {
  try {
    const existingDomain = await dataSources.domain.getByName(payload.name);

    if (existingDomain) {
      return {
        domain: null,
        response: {
          status: 409,
          message: "Domain already exists. Please use another name",
        },
      };
    }

    const domain = await dataSources.domain.create({
      ...payload,
      courses: [],
    });

    delete (domain as any).courses;

    return {
      domain: domain,
      response: {
        status: 201,
        message: "Domain created successfully",
      },
    };
  } catch (error) {
    logger.error(error);
    return {
      domain: null,
      response: {
        status: 400,
        message: "Domain creation failed",
      },
    };
  }
}
