const router = require("express").Router();
const { handleAuth } = require("../middlewares/auth");
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

module.exports = router;
