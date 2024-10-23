const router = require("express").Router();
const { handleAuth } = require("../middlewares/auth");
const { INCORRECT_LOGIN_ERROR } = require("../utils/errors");
const { createItem, getItems, deleteItem, likeItem, dislikeItem } = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", handleAuth, createItem);
router.put("/:itemId/likes", handleAuth, likeItem);
router.delete("/:itemId/likes", handleAuth, dislikeItem);
router.delete("/:itemId", handleAuth, deleteItem);

router.use((req, res) => {
  res.status(INCORRECT_LOGIN_ERROR).send({
    message: "Authorization required",
  });
});

module.exports = router;
