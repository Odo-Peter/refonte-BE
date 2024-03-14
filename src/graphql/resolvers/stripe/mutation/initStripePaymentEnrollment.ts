import IPinfoWrapper, { IPinfo } from "node-ipinfo";
import Stripe from "stripe";
import { IDataSources } from "../../../../types/datasource";

type TpaymentInput = {
  programId: string;
  email: string;
  name: string;
  price: number;
};

/**
 * YET THIS IS A QUICK SOLUTION TO MAKE THE PAYMENT WORK, need to adapt it later on when working with other payment
 * this is just handling the payment initialization
 */
export default async function initStripePaymentEnrollment(
  parent: any,
  { paymentInput }: { paymentInput: TpaymentInput },
  { dataSources, cookie }: { cookie: any; dataSources: IDataSources }
) {
  try {
    const courseCompletion =
      await dataSources.userEnrollment.checkProgramCompletion(
        paymentInput.email,
        paymentInput.programId
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
    
    const stripeFR = new Stripe(process.env.STRIPE_FR_KEY ?? "");
    const stripeUK = new Stripe(process.env.STRIPE_UK_KEY ?? "");

    /* set which stripe account to use */
    let result: IPinfo | undefined;
    const ipinfoWrapper = new IPinfoWrapper("d24e71143ff7d7");
    await ipinfoWrapper.lookupIp(cookie.ipAddress).then((response: IPinfo) => {
      result = response;
    });
    const STRIPE_KEY =
      result?.countryCode == "FR"
        ? process.env.STRIPE_FR_KEY
        : process.env.STRIPE_UK_KEY;

    const stripe = new Stripe(STRIPE_KEY ?? "");

    /* Create customer id */
    const customerFr = await stripeFR.customers.create({
      email: paymentInput.email,
      name: paymentInput.name,
      description: "New customer for refontelearning.com",
    });

    const customerUk = await stripeUK.customers.create({
      email: paymentInput.email,
      name: paymentInput.name,
      description: "New customer for refontelearning.com",
    });

    // find a way to deal with this later
    const user = {
      stripeFRCustomerId: customerFr.id,
      stripeUKCustomerId: customerUk.id,
    };

    /*
      PRICE IS HARD CODED, it should came from course (bellow)
    */

    /* Sending the payment request to stripe */
    const course = await dataSources.course.getById(paymentInput.programId);

    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Refonte International training & Internship program | ${
                course?.name ?? ""
              }`,
            },
            unit_amount: paymentInput.price * 100,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      customer:
        result?.countryCode == "FR"
          ? user.stripeFRCustomerId
          : user.stripeUKCustomerId,
      success_url: `${process.env.FRONTEND_URL}/payment-success`,
      cancel_url: `${process.env.FRONTEND_URL}/enroll-now/payment/${
        course?.url ? course?.url : "data-science-program"
      }`,
    });

    return {
      url: session.url,
      customerIds: user,
      response: {
        status: 200,
        message: "Payment initialized!",
      },
    };
  } catch (error: any) {
    console.log(error);
    return {
      url: null,
      customerIds: null,
      response: {
        status: 400,
        message:
          "Couldn't initialize stripe payment: " + error.message
            ? error.message
            : error,
      },
    };
  }
}
