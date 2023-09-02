const cors = require("cors");
const express = require("express");
require("dotenv").config();
const ItineraryRouter = require("./routers/itineraryRouter");
const ItineraryController = require("./controllers/itineraryController");
const UserController = require("./controllers/userController");
const UserRouter = require("./routers/userRouter");
const ActivityController = require("./controllers/activityController");
const ActivityRouter = require("./routers/activityRouter");

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

const activtyController = new ActivityController(
  itineraries,
  activities,
  users,
  user_itineraries
);
const activityRouter = new ActivityRouter(activtyController).routes();

const PORT = process.env.PORT;
const app = express();
// Enable CORS access to this server
app.use(cors());
app.use(express.json());

// using the routers
app.use("/itinerary", itineraryRouter);
app.use("/user", userRouter);
app.use("/activity", activityRouter);

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
