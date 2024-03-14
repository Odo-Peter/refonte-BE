import { Schema, model } from "mongoose";
import {
  IPaypalAccessTokenDocument,
  TPaypalAccessTokenModel,
} from "../types/paypal-access-token";

const paypalAccessToken = new Schema<
  IPaypalAccessTokenDocument,
  IPaypalAccessTokenDocument
>({
  accessToken: String,
});

const PaypalAccessToken = model<
  IPaypalAccessTokenDocument,
  TPaypalAccessTokenModel
>("paypal_access_token", paypalAccessToken);

export default PaypalAccessToken;
