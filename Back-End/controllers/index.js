const clientController = require("./clientController");
const accountController = require("./accountController");
const userController = require("./userController");
const otherController = require("./helpers");

const controller = {
  clientController,
  accountController,
  userController,
  otherController,
};

module.exports = controller;
