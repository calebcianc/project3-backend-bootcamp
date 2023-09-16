const env = process.env.NODE_ENV || "production";
const config = require(__dirname + "/config/database.js")[env];
const cors = require("cors");
const express = require("express");
const Sequelize = require("sequelize");

require("dotenv").config();
if (process.env.DATABASE_URL) {
  sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.USERNAME,
    process.env.PASSWORD,
    {
      host: process.env.HOST,
      dialect: process.env.DIALECT,
    }
  );
} else if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, {
    ...config,
    dialect: config.dialect || "postgres", // <-- Explicitly provide dialect
  });
}

const { auth } = require("express-oauth2-jwt-bearer");
const jwtCheck = auth({
  audience: "https://travelgpt/api",
  issuerBaseURL: "https://dev-7gx7dya54svlwfwg.us.auth0.com/",
  tokenSigningAlg: "RS256",
});

const ItineraryRouter = require("./routers/itineraryRouter");
const ItineraryController = require("./controllers/itineraryController");
const UserController = require("./controllers/userController");
const UserRouter = require("./routers/userRouter");
const ActivityController = require("./controllers/activityController");
const ActivityRouter = require("./routers/activityRouter");
const DownloadController = require("./controllers/downloadController");
const DownloadRouter = require("./routers/downloadRouter");

const db = require("./db/models/index");
const { users, itineraries, activities, user_itineraries } = db;

const itineraryController = new ItineraryController(
  itineraries,
  activities,
  users,
  user_itineraries
);
const itineraryRouter = new ItineraryRouter(
  itineraryController,
  jwtCheck
).routes();

const userController = new UserController(
  itineraries,
  activities,
  users,
  user_itineraries
);
const userRouter = new UserRouter(userController, jwtCheck).routes();

const activtyController = new ActivityController(
  itineraries,
  activities,
  users,
  user_itineraries
);
const activityRouter = new ActivityRouter(activtyController, jwtCheck).routes();

const downloadController = new DownloadController(
  itineraries,
  activities,
  users,
  user_itineraries
);

const downloadRouter = new DownloadRouter(
  downloadController,
  jwtCheck
).routes();

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0"; // Listen on all network interfaces
const app = express();
// Enable CORS access to this server
app.use(cors());
app.use(express.json());

// using the routers
app.use("/itinerary", itineraryRouter);
app.use("/user", userRouter);
app.use("/activity", activityRouter);
app.use("/download", downloadRouter);

app.listen(PORT, HOST, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
