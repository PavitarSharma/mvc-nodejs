const jwt = require("jsonwebtoken");
const { TOKEN_SECRET } = require("../config/config");

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(403).json("Forbidden");
  }

  const token = authHeader.split(" ")[1];
  const secret = TOKEN_SECRET;

  jwt.verify(token, secret, (err, payload) => {
    if (err) {
      return res.status(401).json("Unauthorized");
    }
    req.user = payload;
    next();
  });
};

module.exports = auth
