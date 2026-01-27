// const express = require("express");
// const route = express.Router();

// const controller = require("../controllers/packages");

// route.get("/createPackages", controller.createPackages);
// route.post("/addPackages", controller.addPackages);
// route.get("/get-listPackages", controller.listPackages);
// route.post("/post-listPackages", controller.listPackages);
// route.get("/get-listPackagesEmployees", controller.listPackagesEmployees);
// route.post("/post-listPackagesEmployees", controller.listPackagesEmployees);
// route.post("/packageStatus", controller.packageStatus);
// route.get("/get-listPackagesTransit", controller.listPackagesTransit);
// route.post("/post-listPackagesTransit", controller.listPackagesTransit);
// route.get("/get-listSentPackages", controller.listSentPackages);
// route.post("/post-listSentPackages", controller.listSentPackages);
// route.get("/get-listReceiverPackages", controller.listReceiverPackages);
// route.post("/post-listReceiverPackages", controller.listReceiverPackages);
// route.get("/get-totalMoney", controller.totalMoney);
// route.post("/post-totalMoney", controller.totalMoney);
// route.post("/post-singlePackageMoney", controller.singlePackageMoney);

// module.exports = route;






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







// const express = require("express");
// // const route = express.Router();
// const authMiddleware = require("../middleware/auth");
// const controller = require("../controllers/packages");

// // Create / add package
// route.get(
//   "/createPackages",
//   authMiddleware.isAuthenticated,
//   controller.createPackages
// );

// route.post(
//   "/addPackages",
//   authMiddleware.isAuthenticated,
//   controller.addPackages
// );

// // Client + Employee packages
// route.get(
//   "/get-listPackages",
//   authMiddleware.isAuthenticated,
//   controller.listPackages
// );

// route.post(
//   "/post-listPackages",
//   authMiddleware.isAuthenticated,
//   controller.listPackages
// );

// // Employees
// route.get(
//   "/get-listPackagesEmployees",
//   authMiddleware.isAuthenticated,
//   controller.listPackagesEmployees
// );

// route.post(
//   "/post-listPackagesEmployees",
//   authMiddleware.isAuthenticated,
//   controller.listPackagesEmployees
// );

// // Package status
// route.post(
//   "/packageStatus",
//   authMiddleware.isAuthenticated,
//   controller.packageStatus
// );

// // Transit packages
// route.get(
//   "/get-listPackagesTransit",
//   authMiddleware.isAuthenticated,
//   controller.listPackagesTransit
// );

// route.post(
//   "/post-listPackagesTransit",
//   authMiddleware.isAuthenticated,
//   controller.listPackagesTransit
// );

// // CLIENT – SENT PACKAGES
// route.get(
//   "/get-listSentPackages",
//   authMiddleware.isAuthenticated,
//   controller.listSentPackages
// );

// route.post(
//   "/post-listSentPackages",
//   authMiddleware.isAuthenticated,
//   controller.listSentPackages
// );

// // CLIENT – RECEIVED PACKAGES
// route.get(
//   "/get-listReceiverPackages",
//   authMiddleware.isAuthenticated,
//   controller.listReceiverPackages
// );

// route.post(
//   "/post-listReceiverPackages",
//   authMiddleware.isAuthenticated,
//   controller.listReceiverPackages
// );

// // Money reports
// route.get(
//   "/get-totalMoney",
//   authMiddleware.isAuthenticated,
//   controller.totalMoney
// );

// route.post(
//   "/post-totalMoney",
//   authMiddleware.isAuthenticated,
//   controller.totalMoney
// );

// module.exports = route;

