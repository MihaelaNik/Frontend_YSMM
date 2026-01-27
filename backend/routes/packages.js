const express = require("express");
const route = express.Router();
const authMiddleware = require("../middleware/auth");
const controller = require("../controllers/packages");

// Create / add package
route.get(
  "/createPackages",
  authMiddleware.isAuthenticated,
  controller.createPackages
);

route.post(
  "/addPackages",
  authMiddleware.isAuthenticated,
  controller.addPackages
);

// Client + Employee packages
route.get(
  "/get-listPackages",
  authMiddleware.isAuthenticated,
  controller.listPackages
);

route.post(
  "/post-listPackages",
  authMiddleware.isAuthenticated,
  controller.listPackages
);

// Employees
route.get(
  "/get-listPackagesEmployees",
  authMiddleware.isAuthenticated,
  controller.listPackagesEmployees
);

route.post(
  "/post-listPackagesEmployees",
  authMiddleware.isAuthenticated,
  controller.listPackagesEmployees
);

// Package status
route.post(
  "/packageStatus",
  authMiddleware.isAuthenticated,
  controller.packageStatus
);

// Transit packages
route.get(
  "/get-listPackagesTransit",
  authMiddleware.isAuthenticated,
  controller.listPackagesTransit
);

route.post(
  "/post-listPackagesTransit",
  authMiddleware.isAuthenticated,
  controller.listPackagesTransit
);

// CLIENT – SENT PACKAGES
route.get(
  "/get-listSentPackages",
  authMiddleware.isAuthenticated,
  controller.listSentPackages
);

route.post(
  "/post-listSentPackages",
  authMiddleware.isAuthenticated,
  controller.listSentPackages
);

// CLIENT – RECEIVED PACKAGES
route.get(
  "/get-listReceiverPackages",
  authMiddleware.isAuthenticated,
  controller.listReceiverPackages
);

route.post(
  "/post-listReceiverPackages",
  authMiddleware.isAuthenticated,
  controller.listReceiverPackages
);

// Money reports
route.get(
  "/get-totalMoney",
  authMiddleware.isAuthenticated,
  controller.totalMoney
);

route.post(
  "/post-totalMoney",
  authMiddleware.isAuthenticated,
  controller.totalMoney
);

module.exports = route;

