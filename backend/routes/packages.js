const express = require("express");
const router = express.Router();
const controller = require("../controllers/packages");

// data for register package page
router.get("/createPackages", controller.createPackages);

// create new package
router.post("/addPackages", controller.addPackages);

// lists (use POST because you pass filters in body)
router.post("/list", controller.listPackages);                 // replaces post-listPackages
router.post("/listByEmployee", controller.listPackagesEmployees); // replaces post-listPackagesEmployees
router.post("/listTransit", controller.listPackagesTransit);  
router.post("/listPackages", controller.listPackages);   // replaces post-listPackagesTransit

// status update
router.post("/packageStatus", controller.packageStatus);

// reports / money
router.post("/totalMoney", controller.totalMoney);
router.post("/singlePackageMoney", controller.singlePackageMoney);

module.exports = router;


