var jwt = require("jsonwebtoken");
const JWT_SECRET = "secret_token_user";

const fetchuser = async (req, res, next) => {
  // Get user from jwt token and add id to req object
  const token = req.header("auth-token");
  if (!token) {
    res.status(401).send({ error: "Please authenticate with valid token" });
  }
  try {
    const data = await jwt.verify(token, JWT_SECRET);
    req.user = data.user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate with valid token" });
  }
};

module.exports = fetchuser;
