const jwt = require("jsonwebtoken");
const { error } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const handleAuthError = (res) => {
  res
    .status(error.INCORRECT_LOGIN_ERROR)
    .send({ message: "Authorization Error" });
};

const extractBearerToken = (header) => header.replace("Bearer ", "");

const handleAuth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
    console.log(payload);
  } catch (err) {
    handleAuthError(res);
  }

  req.user = payload; // adding the payload to the Request object

  return next(); // passing the request further along
};

module.exports = { handleAuth };
