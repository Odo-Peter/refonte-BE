import loginAdmin from './login';
import registerAdmin from './register';
import upgradeUser from './upgradeUser';
// import updatePassword from "./updatePassword";

const adminMutation = {
  registerAdmin,
  loginAdmin,
  upgradeUser,
  // updatePassword,
};

export default adminMutation;
