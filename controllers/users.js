const User = require("../models/user");
const {
  INVALID_DATA,
  INVALID_ENDPOINT,
  SERVER_ERROR,
} = require("../utils/errors");

// GET /users

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(INVALID_ENDPOINT).send({ message: err.message });
      }
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(INVALID_DATA).send({ message: err.message });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
      }
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        res.status(INVALID_DATA).send({ message: err.message });
      } else if (err.name === "DocumentNotFoundError") {
        res.status(INVALID_ENDPOINT).send({ message: err.message });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
      }
    });
};

module.exports = { getUsers, createUser, getUser };
