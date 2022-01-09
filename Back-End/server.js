const express = require("express");
const app = express();
const cors = require("cors");
const port = 8080;
const db = require("./config/db");
const router = require("./routes");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", router);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
