import { IDataSources } from "../../../../types/datasource";
import { verifyJWT } from "../../../../utils/auth";
import bcrypt from "bcrypt";

export default async function updatePassword(
  parents: any,
  {
    currentPassword,
    newPassword,
  }: { currentPassword: string; newPassword: string },
  { dataSources, token }: { dataSources: IDataSources; token: string }
) {
  try {
    if (
      !currentPassword ||
      !currentPassword.trim() ||
      !newPassword ||
      !newPassword.trim()
    ) {
      return {
        response: {
          status: 400,
          message: "Password missing",
        },
      };
    }

    const decodedToken: any = await verifyJWT(token);
    if (!token || !decodedToken.id) {
      return {
        response: {
          status: 401,
          message: "Unauthorized, token invalid",
        },
      };
    }

    const user = await dataSources.user.getByEmail(decodedToken.email);

    const matchPassword = await bcrypt.compare(currentPassword, user.password);

    if (!matchPassword) {
      return {
        response: {
          status: 400,
          message: "Invalid current password!",
        },
      };
    }

    const updated = await dataSources.user.updateUser(
      { email: decodedToken.email },
      { password: newPassword }
    );

    if (!updated) {
      return {
        response: {
          status: 500,
          message: "Failed to update password!",
        },
      };
    }

    return {
      response: {
        status: 200,
        message: "Password update successful!",
      },
    };
  } catch (error: any) {
    return {
      response: {
        status: error?.statusCode ?? 400,
        message: error?.statusCode
          ? "Unauthorized, token invalid"
          : "Failed to update password!",
      },
    };
  }
}
