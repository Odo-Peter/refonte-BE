import loginAdmin from './login';
import registerAdmin from './register';
import upgradeUser from './upgradeUser';
import deleteAdmin from './deleteAdmin';
// import updatePassword from "./updatePassword";

const adminMutation = {
  registerAdmin,
  loginAdmin,
  upgradeUser,
  deleteAdmin,
  // updatePassword,
};

export default adminMutation;
