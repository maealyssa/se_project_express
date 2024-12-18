const error = {
  INVALID_DATA: 400,
  INCORRECT_LOGIN_ERROR: 401,
  FORBIDDEN: 403,
  INVALID_ENDPOINT: 404,
  DUPLICATE_ERROR: 409,
  SERVER_ERROR: 500,
};

const handleErrRes = (res, errorCode, message) => {
  res.status(errorCode).send({ message: message });
};

const handleError = (err, res) => {
  if (
    err.statusCode === 400 ||
    err.name === "ValidationError" ||
    err.name === "CastError"
  ) {
    handleErrRes(res, error.INVALID_DATA, "Please enter valid data");
  } else if (err.message === "Incorrect email or password") {
    handleErrRes(
      res,
      error.INCORRECT_LOGIN_ERROR,
      "Incorrect email or password"
    );
  } else if (err.name === "DocumentNotFoundError") {
    handleErrRes(res, error.INVALID_ENDPOINT, "Resource not found");
  } else {
    handleErrRes(
      res,
      error.SERVER_ERROR,
      "Uh oh, an error occured on the server"
    );
  }
};

const handleForbiddenErr = (res) => {
  handleErrRes(res, error.FORBIDDEN, "Forbidden");
};

const handleIncorrectLoginErr = (res) => {
  handleErrRes(res, error.INCORRECT_LOGIN_ERROR, "Incorrect email or password");
};

const handleEmailErr = (res) => {
  handleErrRes(res, error.DUPLICATE_ERROR, "This email is already registered");
};

const handleLoginErr = (res) => {
  handleErrRes(res, error.INVALID_DATA, "Please enter valid data");
};

const handleInvalidEndpoint = (res) => {
  handleErrRes(res, error.INVALID_ENDPOINT, "Resource not found");
};

module.exports = {
  error,
  handleError,
  handleEmailErr,
  handleLoginErr,
  handleInvalidEndpoint,
  handleForbiddenErr,
  handleIncorrectLoginErr,
};
