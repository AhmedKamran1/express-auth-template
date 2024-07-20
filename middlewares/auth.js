const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token =
    req.query.token || req.header("authorization").substring("Bearer ".length);

  if (!token) return res.status(401).send("Access denied. No token found.");

  try {
    const decoded = jwt.verify(token, process.env.jwtPrivateKey);
    req.user = decoded;

    next();
  } catch (e) {
    return res.status(400).send("Invalid Token.");
  }
};

module.exports = authenticate;
