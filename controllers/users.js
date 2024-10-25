const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  handleError,
  handleLoginErr,
  handleEmailErr,
} = require("../utils/errors");

// GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      handleError(err, res);
    });
};

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

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, `${JWT_SECRET}`, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      handleLoginErr(res);
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
  getUsers,
  createUser,
  getCurrentUser,
  loginUser,
  updateUser,
};
