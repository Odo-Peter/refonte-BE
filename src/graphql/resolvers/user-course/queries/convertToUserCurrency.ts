import { IDataSources } from "../../../../types/datasource";
import convertToUserLocalCurrency from "../../../../utils/convertToUserLocalCurrency";
import logger from "../../../../utils/logger";
const CC = require("currency-converter-lt");

export default async function convertToUserCurrency(
  parent: any,
  { amount }: { amount: number },
  { dataSources, token, cookie }: { dataSources: IDataSources; token: string; cookie: { ipAddress: string } }
) {
  /**
   *
   * Because your local address ip address is something like 127.0.0.1 or localhost, it will not work when you try testing it locally
   * You can go on https://whatismyipaddress.com/fr/mon-ip to get your public ip address and replace it in the cookie.ipAddress just for testing.
   * It is working perfectly on the server or online
   *
   * */

  // cookie.ipAddress = "154.66.143.159"; // set your ip address here

  logger.info({ amount }, "convertToUserCurrency input");

  const result = (await convertToUserLocalCurrency(cookie.ipAddress, amount)) ?? { amount, currency: "USD" };
  return {
    ...result,
    response: {
      status: 200,
      message: "User Currency Conversion",
    },
  };
}
