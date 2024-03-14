import { returnError } from "./helpers";
import jwt from "jsonwebtoken";

export const generateJWT = (
  data: any,
  expiration: any = "7d"
): Promise<string> => {
  const options = {
    expiresIn: expiration,
    issuer: "refonte",
    subject: data.id,
  };
  return new Promise((resolve, reject) => {
    jwt.sign(
      data,
      process.env.JWT_SECRET_KEY as string,
      options,
      function (err: any, token: any) {
        if (err) return reject(returnError(500, err.message));
        resolve(token);
      }
    );
  });
};

export const verifyJWT = (token: string) => {
  if (token.includes("Bearer")) {
    token = token.replace("Bearer ", "");
  }
  return new Promise((resolve, reject) => {
    const options = {
      issuer: "refonte",
    };
    jwt.verify(
      token,
      process.env.JWT_SECRET_KEY as string,
      options,
      (err: any, decode: any) => {
        if (err) {
          if (err.name == "TokenExpiredError")
            return reject(returnError(403, "Token Expired"));
          if (err.name == "JsonWebTokenError")
            return reject(returnError(401, "Token Malformed"));
          if (err.name == "NotBeforeError")
            return reject(returnError(401, "Token Inactive"));
        }
        resolve(decode);
      }
    );
  });
};
