const express = require("express");
const app = express();

const kirimDataRoute = require("./kirimdata");

app.use(express.json());

app.use("/", kirimDataRoute);

module.exports = app;
