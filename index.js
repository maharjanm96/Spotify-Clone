require("dotenv").config();
require('express-async-errors')
const express = require('express');
const cors= require('cors');

const connection = require("./db")
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

const app = express();

connection();
app.use(cors());
app.use(express.json());

app.use("/api/users",userRoutes);
app.use("/api/login",authRoutes);


const port = process.env.PORT||8000;
app.listen(port,console.log(`Server Started At PORT ${port}... `))
