const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const User = require('./models/personalSchema');
const {connectDB} = require('./db.js');

//connect to express app
const app = express();

//connect to MongoDB
connectDB();
//middleware
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
//routes
const authRoutes = require("./routes/auth.routes");
const personalRoutes = require("./routes/personal.routes");

app.use("/api", authRoutes);
app.use("/api", personalRoutes);

module.exports = app;