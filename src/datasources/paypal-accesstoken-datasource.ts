import { Model } from "mongoose";
import { IPaypalAccessToken } from "../types/paypal-access-token";

export class PaypalAccessTokenDataSource {
  constructor(private paypalAccessToken: Model<IPaypalAccessToken>) {}

  async create(accessToken: string): Promise<IPaypalAccessToken | null> {
    const doc = new this.paypalAccessToken({ accessToken });
    return await doc.save();
  }

  async getOne(): Promise<IPaypalAccessToken | null> {
    const paypalAccessToken = await this.paypalAccessToken.find({});

    if (paypalAccessToken.length > 0) {
      return paypalAccessToken[0];
    }
    return null;
  }

  async update(accessToken: string): Promise<any> {
    const updateInfo = await this.paypalAccessToken.updateOne(
      {},
      { accessToken },
      { new: true }
    );

    return updateInfo;
  }
}
