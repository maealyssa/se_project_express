const jwt = require("jsonwebtoken");
const { INCORRECT_LOGIN_ERROR } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const handleAuthError = (res) => {
  res.status(INCORRECT_LOGIN_ERROR).send({ message: "Authorization Error" });
};

const extractBearerToken = (header) => {
  return header.replace("Bearer ", "");
};

const handleAuth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload; // adding the payload to the Request object

  next(); // passing the request further along
};

module.exports = { handleAuth };