const express =  require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.send("welcome to logist"); //index res.render
});

router.get('/register', (req, res) => {
    res.send("Register Page later..");
});

router.get('/login', (req, res) => {
    res.send("Login Page later..");
});

router.get('/client-dashboard', (req, res) => {
    res.send("Client Dashboard");
});

router.get('/employee-dashboard', (req, res) => {
    res.send("Employee Dashboard ");
});

module.exports = router;