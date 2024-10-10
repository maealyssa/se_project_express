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
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        res.status(INVALID_DATA).send({ message: err.message });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
      }
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res.status(INVALID_ENDPOINT).send({ message: err.message });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
      }
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(200).send({}))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res.status(INVALID_ENDPOINT).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(INVALID_DATA).send({ message: err.message });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
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
    .then((item) => res.status(200).send({ item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res.status(INVALID_ENDPOINT).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(INVALID_DATA).send({ message: err.message });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
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
    .then((item) => res.status(200).send({ item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        res.status(INVALID_ENDPOINT).send({ message: err.message });
      } else if (err.name === "CastError") {
        res.status(INVALID_DATA).send({ message: err.message });
      } else {
        res.status(SERVER_ERROR).send({ message: err.message });
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
