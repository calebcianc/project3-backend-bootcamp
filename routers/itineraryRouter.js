const express = require("express");
const router = express.Router();

class ItineraryRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.get("/", this.controller.getAll.bind(this.controller));

    router.get(
      "/:itineraryId",
      this.controller.getItineraryWithActivities.bind(this.controller)
    );
    // router.post("/", this.controller.createItinerary.bind(this.controller));

    return router;
  }
}
module.exports = ItineraryRouter;
