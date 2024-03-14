import dotenv from "dotenv";
import { IDataSources } from "../../../../types/datasource";
import Stripe from "stripe";
dotenv.config();

/**
 * 
   enrollmentData: {
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
 */

export default async function confirmStripePaymentEnrollment(
  parent: any,
  {
    customerIds,
  }: {
    customerIds: {
      stripeFRCustomerId: string;
      stripeUKCustomerId: string;
    };
  },
  { dataSources }: { dataSources: IDataSources }
) {
  try {
    const stripeFR = new Stripe(process.env.STRIPE_FR_KEY ?? "");
    const stripeUK = new Stripe(process.env.STRIPE_UK_KEY ?? "");

    const sessionsFR = await stripeFR.checkout.sessions.list({
      customer: customerIds.stripeFRCustomerId,
    });
    const sessionsUK = await stripeUK.checkout.sessions.list({
      customer: customerIds.stripeUKCustomerId,
    });

    /* THIS IS SMELLING :/ should change it! */
    for (const session of [...sessionsFR.data, ...sessionsUK.data].filter(
      (session: any) => session.payment_status == "paid"
    )) {

      const retrievedTrx = await dataSources.deposit.getByTransactionId(
        session.id
      );
      if (!retrievedTrx) {
        await dataSources.deposit.create({
          trxId: session.id,
          amount: session.amount_total
            ? (session.amount_total / 100).toString()
            : "",
          address: session?.customer_details?.email || "",
          createdAt: new Date(session.created),
          method: "stripe",
        });
      }
    }

    return {
      response: {
        status: 204,
        message: "Payment confirmation successful",
      },
    };
  } catch (error) {
    console.log(error);
    return {
      response: {
        status: 400,
        message: "Payment confirmation failed!",
      },
    };
  }
}
