import { IDataSources } from "../../../../types/datasource";
import { IUser } from "../../../../types/user";
const Stripe = require("stripe");
import { generateJWT, verifyJWT } from "../../../../utils/auth";
import dotenv from "dotenv";
import logger from "../../../../utils/logger";
import IPinfoWrapper, { IPinfo } from "node-ipinfo";
import { randomInt } from "crypto";
import { sendLoginInfosMail } from "../../../../utils/mailers";
dotenv.config();

const initStripePayment = async (
  parent: any,
  { paymentInput }: any,
  { dataSources, token, cookie }: { dataSources: IDataSources; token: string; cookie: any }
) => {
  const stripeFR = Stripe(process.env.STRIPE_FR_KEY);
  const stripeUK = Stripe(process.env.STRIPE_UK_KEY);
  const { price, program } = paymentInput;
  const fakePassword = paymentInput.name + randomInt(1000, 9999);

  logger.info(paymentInput);

  /**
   * Here we are sending all payment made in France to the FR based stripe account
   * and all payment made in others countries to the UK based stripe account
   */

  try {
    const ipinfoWrapper = new IPinfoWrapper("d24e71143ff7d7");

    let result: IPinfo | undefined;

    await ipinfoWrapper.lookupIp(cookie.ipAddress).then((response: IPinfo) => {
      // logger.info(response, "USER INFO DETAILS");
      result = response;
    });

    let user;
    let jwtToken = null;
    const STRIPE_KEY = result?.countryCode == "FR" ? process.env.STRIPE_FR_KEY : process.env.STRIPE_UK_KEY;

    const stripe = Stripe(STRIPE_KEY);

    logger.info(token, "Token ");
    if (!token) {
      const retrievedUser = await dataSources.user.getByEmail(paymentInput.email);
      if (retrievedUser) {
        user = retrievedUser;
        return {
          response: {
            status: 400,
            message: "Missing token",
          },
          url: null,
        };
      } else {
        user = await dataSources.user.create({
          email: paymentInput.email,
          password: fakePassword,
          name: paymentInput.name,
        });
        if (user) {
          try {
            jwtToken = await generateJWT({
              id: user._id.toString(),
              email: user.email,
              password: user.password,
            });
          } catch (error) {
            logger.error(error, "Error sending login info mail");
          }
        }
      }
    } else {
      const decodedToken: any = await verifyJWT(token);

      if (!decodedToken.id) {
        return {
          response: {
            status: 400,
            message: "Invalid token",
          },
          url: null,
        };
      }
      console.log(decodedToken);

      user = (await dataSources.user.getByEmail(decodedToken?.email)) as IUser;
      if (!user) {
        console.log("User does not exist!");
        return {
          url: null,
          response: {
            status: 400,
            message: "User does not exist!",
          },
        };
      }
    }

    if (user) {
      if (!user.stripeFRCustomerId) {
        const customer = await stripeFR.customers.create({
          email: user.email,
          name: `${user.name ?? ""}`,
          description: "New customer for refonteinfini.com ",
        });

        logger.info(customer, "response from createCustomer");

        user.stripeFRCustomerId = customer.id;
        await (user as any).save();
      }
      if (!user.stripeUKCustomerId) {
        const customer = await stripeUK.customers.create({
          email: user.email,
          name: `${user.name ?? ""}`,
          description: "New customer for refonteinfini.com ",
        });

        logger.info(customer, "response from createCustomer");

        user.stripeUKCustomerId = customer.id;
        await (user as any).save();
      }

      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Refonte International training & Internship program | ${program}`,
              },
              unit_amount: price * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        customer: result?.countryCode == "FR" ? user.stripeFRCustomerId : user.stripeUKCustomerId,
        success_url: `${process.env.FRONTEND_URL}/payment-success`,
        cancel_url: `${process.env.FRONTEND_URL}/enroll-now/payment/${
          program ? (program as string).toLowerCase().replace(" ", "-") + "-program" : "data-science-program"
        }`,
      });

      try {
        await sendLoginInfosMail(user.name, paymentInput.email, fakePassword);
      } catch (error) {
        console.log("Error sending login info mail", error);
      }

      return {
        response: {
          status: 200,
          message: "",
        },
        url: session.url,
        token: jwtToken,
      };
    } else {
      return {
        response: {
          status: 400,
          message: "Can't init stripe payment",
        },
        url: null,
        token: null,
      };
    }
  } catch (error: any) {
    return {
      response: {
        status: error?.statusCode ?? 400,
        message: "Can't init stripe payment" + " : " + error.message,
      },
      url: null,
      token: null,
    };
  }
};

export default initStripePayment;
