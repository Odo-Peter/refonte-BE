import { IDataSources } from "../../../../types/datasource";
import { IUser } from "../../../../types/user";
const Stripe = require("stripe");
import { verifyJWT } from "../../../../utils/auth";
import dotenv from "dotenv";
import logger from "../../../../utils/logger";
import { sendBoughtMail } from "../../../../utils/mailers";
dotenv.config();

const confirmStripePayment = async (
  parents: any,
  { course, batch, dayTime, type, cohort, field, program }: any,
  { dataSources, token }: { dataSources: IDataSources; token: string }
) => {
  const stripeFR = Stripe(process.env.STRIPE_FR_KEY);
  const stripeUK = Stripe(process.env.STRIPE_UK_KEY);

  try {
    const decodedToken: any = await verifyJWT(token);
    if (!token || !decodedToken.id) {
      return {
        status: 401,
        message: "token missing or invalid",
      };
    }

    const user = (await dataSources.user.getByEmail(decodedToken?.email)) as IUser;
    if (!user) {
      console.log("User does not exist!");
      return {
        status: 400,
        message: "User does not exist!",
      };
    }

    logger.info({ course, batch, dayTime, type, cohort, field, program }, "Stripe Payment Confirmation");

    const sessionsFR = await stripeFR.checkout.sessions.list({
      customer: user.stripeFRCustomerId,
    });

    // logger.info(sessionsFR, "Stripe FR sessions");

    const sessionsUK = await stripeUK.checkout.sessions.list({
      customer: user.stripeUKCustomerId,
    });

    // logger.info(sessionsUK, "Stripe UK sessions");

    for (const session of [...sessionsFR.data, ...sessionsUK.data].filter((session: any) => session.payment_status == "paid")) {
      const retrievedTrx = await dataSources.deposit.getByTransactionId(session.id);
      if (!retrievedTrx) {
        const userDeposit = await dataSources.deposit.create({
          trxId: session.id,
          amount: (session.amount_total / 100).toString(),
          address: session.customer_details.email,
          createdAt: new Date(session.created),
          method: "stripe",
        });

        switch (type) {
          case "enroll":
            // create user course
            const userCourseInput = {
              course,
              user: user._id,
              batch,
              dayTime,
            };

            logger.info({ userCourseInput });

            await dataSources.userCourse.create(userCourseInput);

            logger.info("Successfully purchased course");
            break;
          case "apply":
            // create user application
            const userApplicationInput = {
              user: user._id,
              program,
              field,
              cohort,
            };

            logger.info({ userApplicationInput });

            await dataSources.userApplication.create(userApplicationInput);

            logger.info("Successfully purchased application");
            break;

          case "bootcamp":
            // create user bootcamp
            const userBootcampInput = {
              user: user._id,
              program,
              field,
              dayTime,
            };

            logger.info({ userBootcampInput });

            await dataSources.userBootcamp.create(userBootcampInput);

            logger.info("Successfully purchased bootcamp");
            break;
        }
      }
    }

    try {
      await sendBoughtMail(user.name, user.email);
    } catch (error) {
      logger.error(error, "ERROR While sending bought mail to customer");
    }

    return {
      response: {
        status: 200,
        message: "Successfully Purchased course",
      },
      user: null,
    };
  } catch (error: any) {
    logger.error(error, "ERROR While verifying payment of customer");
    return {
      response: {
        status: error?.statusCode ?? 400,
        message: "User confirm stripe payment failed!" + " : " + error.message,
      },
      user: null,
    };
  }
};

export default confirmStripePayment;
