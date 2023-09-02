const express = require("express");
const router = express.Router();

class ItineraryRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.get("/", this.controller.getAll.bind(this.controller));

    router.get(
      "/explore",
      this.controller.getAllItineraryActivitiesPublic.bind(this.controller)
    );

    router.get(
      "/:userId",
      this.controller.getAllItinerary.bind(this.controller)
    );
    router.get(
      "/:userId/:itineraryId",
      this.controller.getOneItineraryActivityByUser.bind(this.controller)
    );
    router.post("/new", this.controller.createItinerary.bind(this.controller));
    router.put(
      "/:userId/:itineraryId",
      this.controller.editItinerary.bind(this.controller)
    );
    router.delete(
      "/:userId/:itineraryId",
      this.controller.deleteItinerary.bind(this.controller)
    );

    return router;
  }
}
module.exports = ItineraryRouter;
