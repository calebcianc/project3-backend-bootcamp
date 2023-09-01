const cors = require("cors");
const express = require("express");
require("dotenv").config();
const ItineraryRouter = require("./routers/itineraryRouter");
const ItineraryController = require("./controllers/itineraryController");
const db = require("./db/models/index");
const { users, itineraries, activities, user_itineraries } = db;

// initializing Controllers -> note the lowercase for the first word
const itineraryController = new ItineraryController(
  itineraries,
  activities,
  users,
  user_itineraries
);
// initializing Routers
const itineraryRouter = new ItineraryRouter(itineraryController).routes();

const PORT = process.env.PORT;
const app = express();
// Enable CORS access to this server
app.use(cors());
app.use(express.json()); // to parse incoming JSON data in the request body.

// using the routers
app.use("/itinerary", itineraryRouter);

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
