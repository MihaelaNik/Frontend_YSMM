const express = require("express");
const router = express.Router();
const clientsController = require("../controllers/clients");
const { isAuthenticated } = require("../middleware/auth");

router.get("/", (req, res) => {
  res.status(200).json({ message: "Clients endpoint" });
});

router.get("/listClients", clientsController.listClients);
router.get("/myClient", isAuthenticated, clientsController.getMyClient);
router.put("/updateAddress", isAuthenticated, clientsController.updateAddress);

module.exports = router;
