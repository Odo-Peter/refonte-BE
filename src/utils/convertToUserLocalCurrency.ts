import { lookup } from "geoip-lite";
import countryToCurrency from "country-to-currency";
import logger from "./logger";
const CC = require("currency-converter-lt");

export default async function convertToUserLocalCurrency(
  ipAddress: string,
  amount: number,
  from?: string
): Promise<{ amount: number | null; currency: string } | null> {
  try {
    let result: number | null = null;
    logger.info({ ip: ipAddress, amount }, "IP Address");

    const res = lookup(ipAddress);

    const userCountry = res?.country;

    const userCurrency = countryToCurrency[userCountry as keyof typeof countryToCurrency];

    logger.info({ userCountry, userCurrency }, "User Country and Currency");

    let currencyConverter = new CC({ from: from ?? "USD", to: userCurrency, amount });

    await currencyConverter
      .convert()
      .then((response: number) => {
        result = response;
      })
      .catch((error: any) => {
        logger.error(error, "ERROR While converting currency");
        result = null;
      });

    logger.info(result, "Currency Conversion Result");

    return { amount: result, currency: userCurrency };
  } catch (error) {
    return null;
  }
}
