const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  handleError,
  handleLoginErr,
  handleEmailErr,
  handleIncorrectLoginErr,
} = require("../utils/errors");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  User.findOne({ email }).then((user) => {
    console.log(user);
    if (user) {
      return handleEmailErr(res);
    }
    return bcrypt
      .hash(password, 10)
      .then((hash) => {
        User.create({
          name,
          avatar,
          email,
          password: hash,
        })
          .then(() => res.send({ name, avatar, email }))
          .catch((err) => {
            console.error(err);
            handleLoginErr(res);
          });
      })
      .catch((err) => {
        console.error(err);
        handleError(res);
      });
  });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      handleError(err, res);
    });
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return handleLoginErr(res);
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, `${JWT_SECRET}`, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      handleIncorrectLoginErr(res);
    });
};

const updateUser = (req, res) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => res.send({ user }))
    .catch((err) => handleError(err, res));
};

module.exports = {
  createUser,
  getCurrentUser,
  loginUser,
  updateUser,
};
