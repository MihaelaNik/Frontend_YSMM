const express = require("express");
const route = express.Router();

const controller = require("../controllers/employees");

route.get("/getEmployee", controller.getEmployees);
route.post("/addEmployee", controller.addEmployees);
route.post("/updateEmployee", controller.updateEmployees);

module.exports = route;

