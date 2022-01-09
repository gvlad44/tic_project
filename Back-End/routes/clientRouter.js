const express = require("express");
const router = express.Router();
const clientController = require("../controllers/clientController");
const userController = require("../controllers/userController");

router.post("/", userController.checkAuth, clientController.addClient);
router.get("/", clientController.getAllClients);
router.get("/:id", clientController.getClient);
router.patch("/:id", userController.checkAuth, clientController.updateClient);
router.delete("/:id", userController.checkAuth, clientController.deleteClient);

module.exports = router;
