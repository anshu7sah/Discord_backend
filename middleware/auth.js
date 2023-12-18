const jwt = require("jsonwebtoken");

const config = process.env.JWT_KEY;

const verify = (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers["authorization"];

  if (!token) {
    return res.status(403).send("A token is required ");
  }
  try {
    token = token.replace(/^Bearer\s+/, "");
    const decoded = jwt.verify(token, config);
    req.user = decoded;
  } catch (error) {
    return res.status(401).send("Invalid token");
  }
  return next();
};

module.exports = verify;
