import randomString from "randomstring";

import bcrypt from "bcryptjs";

const randomHashCode = (length: number) => {
  const code = randomString.generate({
    length,
    charset: "numeric",
  });
  const salt = bcrypt.genSaltSync(10);
  const hashCode = bcrypt.hashSync(code, salt);
  return {
    code,
    hashCode,
  };
};

export default randomHashCode;
