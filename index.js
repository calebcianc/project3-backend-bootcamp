// import express from "express";
// import cors from "cors";
// import dotenv from "dotenv";
// import ItineraryRouter from "./routers/itineraryRouter";
// import ItineraryController from "./controllers/itineraryController";
// import db from "./db/models/index";
// const { users, itineraries, activities } = db;

const cors = require("cors");
const express = require("express");
require("dotenv").config();
const ItineraryRouter = require("./routers/itineraryRouter");
const ItineraryController = require("./controllers/itineraryController");
const db = require("./db/models/index");
const { users, itineraries, activities } = db;

// initializing Controllers -> note the lowercase for the first word
const itineraryController = new ItineraryController(itineraries);
// initializing Routers
const itineraryRouter = new ItineraryRouter(itineraryController).routes();

const PORT = process.env.PORT;
const app = express();
// Enable CORS access to this server
app.use(cors());
app.use(express.json()); // to parse incoming JSON data in the request body.

// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });

// using the routers
app.use("/", itineraryRouter);

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
  console.log("testing");
});
