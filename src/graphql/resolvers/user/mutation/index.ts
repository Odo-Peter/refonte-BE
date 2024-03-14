import loginUser from "./login";
import registerUser from "./register";
import updatePassword from "./updatePassword";

const userMutation = {
  registerUser,
  loginUser,
  updatePassword,
};

export default userMutation;
