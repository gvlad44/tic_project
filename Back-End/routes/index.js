const express = require("express");
const router = express.Router();
const clientRouter = require("./clientRouter");
const accountRouter = require("./accountRouter");
const userRouter = require("./userRouter");
const helperRouter = require("./helperRouter");

router.use("/client", clientRouter);
router.use("/account", accountRouter);
router.use("/user", userRouter);
router.use("/other", helperRouter);

module.exports = router;
