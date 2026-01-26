const express = require("express");
const router = express.Router();
const officesController = require("../controllers/offices");

router.get("/", (req, res) => {
  res.status(200).json({ message: "Offices endpoint" });
});

router.get("/listOffices", officesController.listOffices);
router.get("/searchByCity", officesController.searchOfficesByCity);
router.post("/createOffices", officesController.createOffices);
router.put("/updateOffices/:id", officesController.updateOffices);
router.delete("/deleteOffices/:id", officesController.deleteOffices);


module.exports = router;
