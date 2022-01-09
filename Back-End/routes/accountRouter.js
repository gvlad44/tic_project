const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const userController = require("../controllers/userController");

router.post("/:id", userController.checkAuth, accountController.addAccount);
router.get("/:id", accountController.getClientAccounts);
router.patch("/:id", userController.checkAuth, accountController.updateAccount);
router.delete(
  "/:id",
  userController.checkAuth,
  accountController.deleteAccount
);

module.exports = router;
