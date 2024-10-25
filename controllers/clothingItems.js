const ClothingItem = require("../models/clothingItems");
const { handleError, handleForbiddenErr } = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const userId = req.user._id;
  console.log(req.user._id);
  ClothingItem.create({ name, weather, imageUrl, owner: userId })
    .then((item) => {
      res.send({ data: item });
    })
    .catch((err) => {
      console.error(err);
      handleError(err, res);
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      handleError(err, res);
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.equals(req.user._id)) {
        return item.remove(() => res.send({ clothingItem: item }));
      }
      return handleForbiddenErr(res);
    })
    .catch((err) => {
      console.log(err);
      handleError(err, res);
    });
};

const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // add _id to the array if it's not there yet
    { new: true }
  )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      console.error(err);
      handleError(err, res);
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
      handleError(err, res);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
