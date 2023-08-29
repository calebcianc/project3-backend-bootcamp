import express from "express";
import cors from "cors";
import dotenv from "dotenv"; // Import dotenv directly
import ItineraryRouter from "./routers/itineraryRouter.js";
import ItineraryController from "./controllers/itineraryController.js";
import db from "./db/models/index.js";

dotenv.config(); // Load environment variables
const { users, itineraries, activities } = db;

const itineraryController = new ItineraryController(itineraries);
const itineraryRouter = new ItineraryRouter(itineraryController).routes();

const PORT = process.env.PORT;
const app = express();
// Enable CORS access to this server
app.use(cors());
app.use(express.json()); // to parse incoming JSON data in the request body.

// using the routers
app.use("/", itineraryRouter);

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
  console.log("testing");
});
