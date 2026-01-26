const express = require("express");
const route = express.Router();
const authMiddleware = require("../middleware/auth");
const controller = require("../controllers/packages");

route.get("/createPackages", authMiddleware.isAuthenticated, controller.createPackages);
route.post("/addPackages", controller.addPackages);
route.get("/get-listPackages", controller.listPackages);
route.post("/post-listPackages", controller.listPackages);
route.get("/get-listPackagesEmployees", controller.listPackagesEmployees);
route.post("/post-listPackagesEmployees", controller.listPackagesEmployees);
route.post("/packageStatus", controller.packageStatus);
route.get("/get-listPackagesTransit", controller.listPackagesTransit);
route.post("/post-listPackagesTransit", controller.listPackagesTransit);
route.get("/get-listSentPackages", controller.listSentPackages);
route.post("/post-listSentPackages", controller.listSentPackages);
route.get("/get-listReceiverPackages", controller.listReceiverPackages);
route.post("/post-listReceiverPackages", controller.listReceiverPackages);
route.get("/get-totalMoney", controller.totalMoney);
route.post("/post-totalMoney", controller.totalMoney);

module.exports = route;
