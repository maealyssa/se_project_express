const ClothingItem = require("../models/clothingItems");
const {
  INVALID_DATA,
  INVALID_ENDPOINT,
  SERVER_ERROR,
} = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const userId = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner: userId })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(INVALID_DATA).send({ message: "Invalid data" });
      } else {
        res
          .status(SERVER_ERROR)
          .send({ message: "An error has occured on the server" });
      }
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      res
        .status(SERVER_ERROR)
        .send({ message: "An error has occured on the server" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res.status(INVALID_ENDPOINT).send({ message: "Invalid endpoint" });
      } else if (err.name === "CastError") {
        res.status(INVALID_DATA).send({ message: "Invalid data" });
      } else {
        res
          .status(SERVER_ERROR)
          .send({ message: "An error has occured on the server" });
      }
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res.status(INVALID_ENDPOINT).send({ message: "Invalid endpoint" });
      } else if (err.name === "CastError") {
        res.status(INVALID_DATA).send({ message: "Invalid data" });
      } else {
        res
          .status(SERVER_ERROR)
          .send({ message: "An error has occured on the server" });
      }
    });
};

const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // remove _id from the array
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res.status(INVALID_ENDPOINT).send({ message: "Invalid endpoint" });
      } else if (err.name === "CastError") {
        res.status(INVALID_DATA).send({ message: "Invalid data" });
      } else {
        res
          .status(SERVER_ERROR)
          .send({ message: "An error has occured on the server" });
      }
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
