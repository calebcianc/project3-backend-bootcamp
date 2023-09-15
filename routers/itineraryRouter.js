const express = require("express");
const router = express.Router();

class ItineraryRouter {
  constructor(controller, jwtCheck) {
    this.controller = controller;
    this.jwtCheck = jwtCheck;
  }
  routes() {
    router.get("/", this.controller.getAll.bind(this.controller));

    // explore page
    router.get(
      "/explore",
      this.controller.getAllItineraryActivitiesPublic.bind(this.controller)
    );
    router.get(
      "/explore/:userId",
      this.controller.getAllItineraryActivitiesPublicUser.bind(this.controller)
    );

    // userId
    router.get(
      "/:userId",
      this.controller.getAllItinerary.bind(this.controller)
    );
    router.post(
      "/:userId/:itineraryId",
      this.controller.addUserToItinerary.bind(this.controller)
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
