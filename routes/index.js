const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { INVALID_ENDPOINT } = require("../utils/errors");
const { createUser, loginUser } = require("../controllers/users");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);

router.post("/signin", loginUser)
router.post("/signup", createUser)

router.use((req, res) => {
  res.status(INVALID_ENDPOINT).send({
    message: "Invalid endpoint",
  });
});

module.exports = router;
