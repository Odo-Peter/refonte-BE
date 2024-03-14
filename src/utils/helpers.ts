import fs from "fs";
import nodemailer from "nodemailer";
import "dotenv/config";

const testAccount = {
  user: process.env.MAIL_USER,
  pass: process.env.MAIL_PASS,
};

export const returnError = (statusCode: number, errorMessage: string) => {
  const error: any = new Error(errorMessage);
  error.statusCode = statusCode || 400;
  return error;
};

export function readHtmlFile(path: string, callback: Function) {
  fs.readFile(
    path,
    {
      encoding: "utf-8",
    },
    (err, html) => {
      if (err) {
        callback(err);
        throw err;
      } else {
        callback(null, html);
      }
    }
  );
}

export const isEmail = (text?: string) => {
  if (!text) return false;
  return text.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

export const transporter = nodemailer.createTransport({
  host: "smtp.refonteinfini.com", //"ssl0.ovh.net", // Or use this host "smtp.refonteinfini.com"
  port: 465,
  secure: true, // use TLS
  auth: {
    user: testAccount.user,
    pass: testAccount.pass,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
});

/**
 * Flattens a nested object into a new object with keys using path and values from nested data.
 *
 * @param {object} data - The nested object to be flattened.
 * @param {string} parentKey [""] - (Optional) Starting key for path, defaults to an empty string.
 * @returns {object} A new object with flattened keys and values from the nested data.
 */
export function flattenObject(data: object, parentKey: string = ""): object {
  const flattened: any = {};
  for (const [key, value] of Object.entries(data)) {
    const newKey = parentKey ? `${parentKey}.${key}` : key;
    if (typeof value === "object" && value !== null) {
      Object.assign(flattened, flattenObject(value, newKey));
    } else {
      flattened[newKey] = value;
    }
  }
  return flattened;
}
