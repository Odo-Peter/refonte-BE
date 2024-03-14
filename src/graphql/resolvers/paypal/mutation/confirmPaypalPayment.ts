import { IDataSources } from "../../../../types/datasource";
import { IUser } from "../../../../types/user";
import { verifyJWT } from "../../../../utils/auth";
import dotenv from "dotenv";
import logger from "../../../../utils/logger";
import axios from "axios";
import { PAYPAL_API_URL, generateAccessToken } from "../../../../utils/paypal";
import { randomInt } from "crypto";
import { sendLoginInfosMail } from "../../../../utils/mailers";

dotenv.config();

const confirmPaypalPayment = async (
  parents: any,
  {
    paymentInput,
  }: {
    paymentInput: {
      orderId: string;
      courseId: string;
      email: string;
      name: string;
      contactNumber: string;
      batch: string;
      dayTime: string;
      type: "apply" | "bootcamp" | "enroll";
      program: string;
      field: string;
      cohort: string;
    };
  },
  { dataSources, token }: { dataSources: IDataSources; token: string }
) => {
  try {
    logger.info(paymentInput, "Paypal payment Id");
    const fakePassword = paymentInput.name + randomInt(1000, 9999);
    let user: IUser | null = null;

    if (!token) {
      const retrievedUser = await dataSources.user.getByEmail(paymentInput.email);

      if (retrievedUser) {
        user = retrievedUser;
        return {
          status: 409,
          message: "Email already exists! Please login to continue!",
        };
      } else {
        user = await dataSources.user.create({
          email: paymentInput.email,
          password: fakePassword,
          name: paymentInput.name,
          contactNumber: paymentInput.contactNumber,
        });
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
          status: 400,
          message: "User does not exist!",
        };
      }
    }
    if (!user) {
      console.log("User does not exist!");
      return {
        status: 400,
        message: "User does not exist!",
      };
    }
    logger.info(paymentInput?.orderId, "Paypal Order ID");

    let accessToken = await dataSources.paypalAccessToken.getOne();
    if (!accessToken) {
      // create paypal access token
      const token = await generateAccessToken();
      accessToken = await dataSources.paypalAccessToken.create(token);
    }
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${PAYPAL_API_URL}/v2/checkout/orders/${paymentInput?.orderId}`,
      headers: {
        Authorization: accessToken!.accessToken,
      },
    };
    let tokenExpired = false;
    let order: any;
    // there is no need to make a call to paypal for a 0$ payment cause it will fail anyway
    order = await axios
      .request(config)
      .then((response) => response.data)
      .catch((error) => {
        if (error?.response?.status == 401) {
          tokenExpired = true;
        } else {
          console.log(error);
        }
      });

    logger.info(order, "Paypal Order");
    if (tokenExpired) {
      // get new and update expired token
      const token = await generateAccessToken();
      await dataSources.paypalAccessToken.update(token);
      order = await axios
        .request({
          ...config,
          headers: {
            Authorization: token,
          },
        })
        .then((response) => response.data)
        .catch((error) => {
          logger.error(error);
        });

      logger.info(order, "Paypal Order");
    }
    await dataSources.deposit.create({
      trxId: order.id,
      amount: order.purchase_units[0].amount.value,
      address: order.purchase_units[0].payee.email_address,
      createdAt: new Date(order.create_time),
      method: "paypal",
    });

    switch (paymentInput.type) {
      case "apply":
        // create user application
        await dataSources.userApplication.create({
          user: user._id,
          program: paymentInput.program,
          field: paymentInput.field,
          cohort: paymentInput.cohort,
        });
        break;
      case "bootcamp":
        // create user bootcamp
        await dataSources.userBootcamp.create({
          user: user._id,
          program: paymentInput.program,
          field: paymentInput.field,
          dayTime: paymentInput.dayTime,
        });
        break;
      case "enroll":
        // create user course
        const userCourseInput = {
          course: paymentInput.courseId,
          user: user._id,
          batch: paymentInput.batch,
          dayTime: paymentInput.dayTime,
        };

        logger.info({ userCourseInput });

        await dataSources.userCourse.create(userCourseInput);

        logger.info("Successfully purchased course");
        break;
    }

    // send confirmation email
    try {
      await sendLoginInfosMail(paymentInput.name, paymentInput.email, fakePassword);
    } catch (error) {
      logger.error(error, "Error sending login info mail");
    }

    return {
      status: 200,
      message: `Successfully verified payment of customer!`,
    };
  } catch (error: any) {
    logger.error(error, "ERROR While verifying payment of customer");
    return {
      status: error?.statusCode ?? 400,
      message: "User confirm PayPal payment failed!" + " : " + error.message,
    };
  }
};

export default confirmPaypalPayment;
