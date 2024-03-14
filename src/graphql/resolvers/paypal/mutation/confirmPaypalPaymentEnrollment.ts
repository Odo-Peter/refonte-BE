import dotenv from "dotenv";
import axios from "axios";
import logger from "../../../../utils/logger";

import { IDataSources } from "../../../../types/datasource";
import { PAYPAL_API_URL, generateAccessToken } from "../../../../utils/paypal";
import { sendSingleEmail } from "../../../../utils/mailers";
import { randomInt } from "crypto";

dotenv.config();

type paymentInput = {
  orderId: string;
  program: string;
  batch: string;
  dayTime: string;
  name: string;
  email: string;
  contactNumber: string;
  country: string;
  gender: string;
  address: string;
  price: number;
  discount: number;
};

/*
  THIS IS A QUICK SOLUTION SO WE HAVE PAYMENT WORKING ,but we have to change it later on
*/
export default async function confirmPaypalPaymentEnrollment(
  parent: any,
  { paymentInput }: { paymentInput: paymentInput },
  { dataSources }: { dataSources: IDataSources }
) {
  try {
    /**
     * PAYPAL ORDER HANDLING
     */
    let accessToken = await dataSources.paypalAccessToken.getOne();
    if (!accessToken) {
      // create paypal access token
      const token = await generateAccessToken();
      accessToken = await dataSources.paypalAccessToken.create(token);
    }

    const courseCompletion =
      await dataSources.userEnrollment.checkProgramCompletion(
        paymentInput.email,
        paymentInput.program
      );

    if (!courseCompletion) {
      return {
        userEnrollment: null,
        response: {
          status: 409,
          message:
            "You already own this course and haven't completed it yet. Please resume learning or visit your course library.",
        },
      };
    }

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${PAYPAL_API_URL}/v2/checkout/orders/${paymentInput.orderId}`,
      headers: {
        Authorization: accessToken!.accessToken,
      },
    };
    let tokenExpired = false;
    let order: any;
    order = await axios
      .request(config)
      .then((response) => response.data)
      .catch((error) => {
        if (error?.response?.status == 401) {
          tokenExpired = true;
        } else {
          logger.error(error);
        }
      });
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

    /**
     * SAVE TRANSACTION INFO
     */
    await dataSources.deposit.create({
      trxId: order.id,
      amount: order.purchase_units[0].amount.value,
      address: order.purchase_units[0].payee.email_address,
      createdAt: new Date(order.create_time),
      method: "paypal",
    });

    /**
     * Save enrollment info
     */
    const userEnrollment = await dataSources.userEnrollment.create({
      program: paymentInput.program,
      batch: paymentInput.batch,
      dayTime: paymentInput.dayTime,
      name: paymentInput.name,
      email: paymentInput.email,
      contactNumber: paymentInput.contactNumber,
      country: paymentInput.country,
      gender: paymentInput.gender,
      address: paymentInput.address,
      price: paymentInput.price,
      discount: paymentInput.discount,
      bought: true,
    });

    /**
     * Geting program
     */
    let program: any;
    try {
      program = await dataSources.course.getById(paymentInput.program);
    } catch (error) {
      console.log("error getting program", error);
    }
    const date = new Date();

    try {
      await sendSingleEmail({
        to: paymentInput.email,
        subject: ` ${
          program?.name ? program?.name + " | " : ""
        }Refonte International training & Internship program`,
        htmlFile: "paymentSucces.html",
        replacements: {
          name: paymentInput.name,
          year: date.getFullYear(),
        },
      });
    } catch (error) {
      console.log("Failed sending email!", error);
    }

    /**
     * CREATE USER IF NOT YET REGISTERED
     */

    const foundUser = await dataSources.user.getByEmail(paymentInput.email);

    if (!foundUser) {
      const assignedPassword = randomInt(100000, 999999);

      const user = await dataSources.user.create({
        name: paymentInput.name,
        email: paymentInput.email,
        password: assignedPassword.toString(),
        contactNumber: paymentInput.contactNumber,
      });

      if (user) {
        try {
          await sendSingleEmail({
            to: paymentInput.email,
            subject: `Login information`,
            htmlFile: "loginInfos.html",
            replacements: {
              name: paymentInput.name,
              course: program.name
                ? program.name
                : "Refonte International training & Internship program",
              email: paymentInput.email,
              password: assignedPassword.toString(),
              year: date.getFullYear(),
            },
          });
        } catch (error) {
          console.log(
            "Couldn't sent login information for: " + paymentInput.email
          );
          console.log(error);
        }
      }
    }

    return {
      userEnrollment,
      response: {
        status: 204,
        message: "User enrollment successful",
      },
    };
  } catch (error) {
    console.log(error);
    return {
      userEnrollment: null,
      response: {
        status: 400,
        message: "User enrollment failed",
      },
    };
  }
}
