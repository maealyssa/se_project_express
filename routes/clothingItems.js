const router = require("express").Router();
const { handleAuth } = require("../middlewares/auth");
const { INCORRECT_LOGIN_ERROR } = require("../utils/errors");
const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);

router.use(handleAuth);
router.post("/", createItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);
router.delete("/:itemId", deleteItem);

router.use((req, res) => {
  res.status(INCORRECT_LOGIN_ERROR).send({
    message: "Authorization required",
  });
});

module.exports = router;
