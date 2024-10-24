const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { handleAuth } = require("../middlewares/auth");

router.use("/users", handleAuth, userRouter);
router.use("/items", clothingItemRouter);

module.exports = router;
