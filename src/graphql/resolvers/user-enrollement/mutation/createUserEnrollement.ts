import { randomInt } from "crypto";
import { IDataSources } from "../../../../types/datasource";
import { sendSingleEmail } from "../../../../utils/mailers";

export default async function createUserEnrollement(
  parent: any,
  {
    userEnrollmentInput,
    withBoughtEmail,
  }: { userEnrollmentInput: any; withBoughtEmail?: boolean },
  { dataSources }: { dataSources: IDataSources }
) {
  try {
    const userEnrollment = await dataSources.userEnrollment.create({
      ...userEnrollmentInput,
      bought: withBoughtEmail ?? false,
    });

    if (withBoughtEmail) {
      try {
        if (!userEnrollment?.program)
          return {
            userEnrollment: null,
            response: {
              status: 400,
              message: "User enrollment creation failed",
            },
          };
        const program = await dataSources.course.getById(
          userEnrollment.program
        );
        const date = new Date();
        await sendSingleEmail({
          to: userEnrollment.email,
          subject: ` ${
            program?.name ? program?.name + " | " : ""
          }Refonte International training & Internship program`,
          htmlFile: "paymentSucces.html",
          replacements: {
            name: userEnrollment.name,
            year: date.getFullYear(),
          },
        });
      } catch (error) {
        console.log("Failed sending email!", error);
      }

      const foundUser = await dataSources.user.getByEmail(
        userEnrollment?.email ?? ""
      );

      if (!foundUser) {
        const assignedPassword = randomInt(100000, 999999);

        const user = await dataSources.user.create({
          name: userEnrollment!.name,
          email: userEnrollment!.email,
          password: assignedPassword.toString(),
          contactNumber: userEnrollment!.contactNumber,
        });

        if (user) {
          try {
            const program = await dataSources.course.getById(
              userEnrollment!.program
            );

            const date = new Date();
            await sendSingleEmail({
              to: userEnrollment!.email,
              subject: `Login information`,
              htmlFile: "loginInfos.html",
              replacements: {
                name: userEnrollment!.name,
                course: program?.name
                  ? program.name
                  : "Refonte International training & Internship program",
                email: userEnrollment!.email,
                password: assignedPassword.toString(),
                year: date.getFullYear(),
              },
            });
          } catch (error) {
            console.log(
              "Couldn't sent login information for: " + userEnrollment!.email
            );
            console.log(error);
          }
        }
      }
    }

    return {
      userEnrollment: userEnrollment,
      response: {
        status: 204,
        message: "User enrollment created successfully",
      },
    };
  } catch (error) {
    console.log(error);
    // error handling is still poorly done
    return {
      userEnrollment: null,
      response: {
        status: 400,
        message: "User enrollment creation failed",
      },
    };
  }
}
