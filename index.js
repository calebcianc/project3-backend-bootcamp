const cors = require("cors");
const express = require("express");
require("dotenv").config();
const ItineraryRouter = require("./routers/itineraryRouter");
const ItineraryController = require("./controllers/itineraryController");
const UserController = require("./controllers/userController");
require("dotenv").config();
const UserRouter = require("./routers/userRouter");

const db = require("./db/models/index");
const { users, itineraries, activities, user_itineraries } = db;

const itineraryController = new ItineraryController(
  itineraries,
  activities,
  users,
  user_itineraries
);
const itineraryRouter = new ItineraryRouter(itineraryController).routes();

const userController = new UserController(
  itineraries,
  activities,
  users,
  user_itineraries
);
const userRouter = new UserRouter(userController).routes();

const PORT = process.env.PORT;
const app = express();
// Enable CORS access to this server
app.use(cors());
app.use(express.json()); // to parse incoming JSON data in the request body.

// using the routers
app.use("/itinerary", itineraryRouter);
app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
