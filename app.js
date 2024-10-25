const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");
const cors = require("cors");
const { createUser, loginUser } = require("./controllers/users");
const { handleInvalidEndpoint } = require("./utils/errors");

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(cors());
app.use(express.json());
app.use("/", mainRouter);
app.post("/signin", loginUser);
app.post("/signup", createUser);

app.use((req, res) => {
  handleInvalidEndpoint(res);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
