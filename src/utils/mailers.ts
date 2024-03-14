import { readHtmlFile, transporter } from "./helpers";
import Handlebars from "handlebars";
import { MailOptions } from "nodemailer/lib/json-transport";
import logger from "./logger";

export const sendLoginInfosMail = async (
  name: string,
  email: string,
  password: string
) => {
  readHtmlFile("./src/views/mails/loginInfos.html", (err: any, html: any) => {
    const template = Handlebars.compile(html);
    const date = new Date();
    const year = date.getFullYear();
    const replacements = {
      name,
      email,
      password,
      year,
    };
    const htmlToSend = template(replacements);

    const mailOptions: MailOptions = {
      from: '"Refonte Learning" <official@refontelearning.com>',
      to: email,
      subject: "Login Infos",
      html: htmlToSend,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.error(error, "Error sending mail");
        return error;
      }
      return {
        name: info.response,
      };
    });
  });
};
export const sendBoughtMail = async (name: string, email: string) => {
  readHtmlFile(
    "./src/views/mails/paymentSucces.html",
    (err: any, html: any) => {
      const template = Handlebars.compile(html);
      const date = new Date();
      const year = date.getFullYear();
      const replacements = {
        name,
        year,
      };
      const htmlToSend = template(replacements);

      const mailOptions: MailOptions = {
        from: '"Refonte Learning" <official@refontelearning.com>',
        to: email,
        subject: "Login Infos",
        html: htmlToSend,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          logger.error(error, "Error sending mail");
          return error;
        }
        return {
          name: info.response,
        };
      });
    }
  );
};

export interface IAttachment {
  filename: string;
  path: string;
}

/**
 *
 * html or htmlFile is required, if both are given it will send the htmlFile
 * htmlFile are in `./src/views/mails/` you just have to give the file name or with its subfolder
 *
 * **PLEASE MAKE SURE THE HTMLFILE EXIST cause it can cause the server to be down**
 *
 * replacements is only if you are sending htmlFile
 */
export async function sendSingleEmail({
  from,
  to,
  subject,
  html,
  htmlFile,
  attachments,
  replacements,
}: {
  from?: string;
  to: string | string[];
  subject: string;
  html?: string;
  htmlFile?: string;
  attachments?: IAttachment[];
  replacements?: object;
}) {
  // input error
  if (!html && !htmlFile)
    throw new Error("Sending single email should have html string or htmlFile");

  if (html && !htmlFile) {
    const mailOptions = {
      from: from || '"Refonte Learning" <official@refontelearning.com',
      to,
      subject,
      html,
      attachments,
    };

    transporter
      .sendMail(mailOptions)
      .then((res) => {
        console.log("Email sent!");
      })
      .catch((err) => {
        // most of the time this error is due to the attachment path is not an url nor a valid path
        console.log("transporter error:", err);
      });
    return;
  }
  readHtmlFile("./src/views/mails/" + htmlFile, (err: any, html: any) => {
    if (!html) return;
    let template: any;

    try {
      template = Handlebars.compile(html);
    } catch (error) {
      console.log("[sendSingleEmail function] Can't parse given file", error);
      return;
    }

    const htmlToSend = template(replacements || {});

    if (attachments && attachments.length > 0) {
      attachments = attachments.map((attachment) => {
        return {
          filename: attachment.filename,
          path: attachment.path,
        };
      });
    }

    const mailOptions = {
      from: from || '"Refonte Learning" <official@refontelearning.com',
      to,
      subject,
      html: htmlToSend,
      attachments,
    };

    transporter
      .sendMail(mailOptions)
      .then((res) => {
        console.log("Email sent!");
      })
      .catch((err) => {
        // most of the time this error is due to the attachment path is not an url nor a valid path
        console.log("transporter error:", err);
      });
  });
}
