const bcrypt = require("bcryptjs");

const comparePassword = (candidatePassword, password) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, password, (err, isMatch) => {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
};

module.exports = {
  comparePassword
};
