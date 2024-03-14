export interface IPaypalAccessToken {
  _id: string;
  accessToken?: string;
}
export interface IPaypalAccessTokenDocument extends Document {
  id: string;
  accessToken?: string;
}

export type TPaypalAccessTokenModel = Model<IPaypalAccessTokenDocument, object>;

export interface IPaypalAccessTokenDataSource {
  create(accessToken: string): Promise<IPaypalAccessToken | null>;
  getOne(): Promise<IPaypalAccessToken | null>;
  update(accessToken: string): Promise<any>;
}
