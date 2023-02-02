const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../config/config");

const accessTopken = (userInfo) => {
  return new Promise((resolve, reject) => {
    const user = {
      id: userInfo._id,
      name: userInfo.name,
      email: userInfo.email,
    };

    const secret = TOKEN_SECRET;

    const options = {
      expiresIn: "1d",
    };

    jwt.sign(user, secret, options, (err, payload) => {
        if(err) {
            reject(err)
        }

        resolve(payload)
    })
  });
};

module.exports = {
  accessTopken,
};
