const express = require("express");
const router = express.Router();
const otherController = require("../controllers/helpers");
const userController = require("../controllers/userController");

router.post(
  "/popDb/accounts/clients",
  userController.checkAuth,
  otherController.populateDatabase
);

module.exports = router;
