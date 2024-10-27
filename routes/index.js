const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { createUser, loginUser } = require("../controllers/users");
const { handleAuth } = require("../middlewares/auth");

router.use("/users", handleAuth, userRouter);
router.use("/items", clothingItemRouter);
router.post("/signin", loginUser);
router.post("/signup", createUser);

module.exports = router;
