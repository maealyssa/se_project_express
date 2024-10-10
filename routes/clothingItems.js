const router = require("express").Router();

router.get("/", () => console.log("GET users"));
router.post("/", () => console.log("GET users"));
router.delete("/:itemId", () => console.log("GET users"));

module.exports = router;
