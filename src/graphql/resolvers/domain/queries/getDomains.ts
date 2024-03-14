import { IDataSources } from "../../../../types/datasource";
import logger from "../../../../utils/logger";

export default async function getDomains(
  parent: any,
  args: any,
  { dataSources }: { dataSources: IDataSources }
) {
  try {
    const domains = await dataSources.domain.getAll();

    domains.forEach((domain) => {
      delete (domain as any).courses;
    });

    return {
      domains: domains,
      response: {
        status: 200,
        message: "Domains fetched successfully",
      },
    };
  } catch (error) {
    logger.error(error);

    return {
      domains: [],
      response: {
        status: 400,
        message: "Failed to get domains",
      },
    };
  }
}
