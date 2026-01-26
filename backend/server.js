// URL -> http://localhost:5000
//IP -> 127.0.0.1:5000
const express = require("express"); //import express
const cors = require("cors");
const session = require("express-session");
const app = express();

const dotenv = require("dotenv");
dotenv.config({ path: "./.env" });
const jwt = require("jsonwebtoken");

const db = require("./config/db");
const PORT = 5000;

app.use(express.json()); //middleware to parse json data

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Session configuration
app.use(
  session({
    secret:
      process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, //  true if using HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

//Website endpoints `
app.get("/", (req, res) => {
  console.log("Endpoint hit: GET /", req.method);
  res.sendStatus(201); //304 Not Modified //201 Created
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

//API endpoints
// app.use('/', require('./routes/pages') );  //"auth/register" method ="POST"

app.use("/auth", require("./routes/auth"));
app.use("/employees", require("./routes/employees"));
app.use("/packages", require("./routes/packages"));
app.use('/api/packages', require('./routes/packages'));
app.use("/offices", require("./routes/offices"));
app.use("/clients", require("./routes/clients"));
