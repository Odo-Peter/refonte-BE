import axios from "axios";
import logger from "./logger";

export const PAYPAL_API_URL = process.env.PAYPAL_API_URL;
export async function generateAccessToken() {
  const clientId = process.env.PAYPAL_KEY;
  const clientSecret = process.env.PAYPAL_SECRET;
  const data = "grant_type=client_credentials";
  const config = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString("base64")}`,
    },
  };
  let token = "";
  try {
    const res = await axios.post(
      `${PAYPAL_API_URL}/v1/oauth2/token`,
      data,
      config
    );

    logger.info(res.data, "Paypal Access Token");

    token = `Bearer ${res.data.access_token}`;
  } catch (error) {
    logger.error(error);
  }
  return token;
}
