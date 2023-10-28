import bcrypt from "bcryptjs";

const hashPassword = (password: string) => {
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);
  return passwordHash;
};

export default hashPassword;
