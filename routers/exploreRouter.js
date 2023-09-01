const express = require("express");
const router = express.Router();

class ExploreRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    // router.get("/", this.controller.getAll.bind(this.controller));
    router.get(
      "/",
      this.controller.getAllItineraryActivitiesPublic.bind(this.controller)
    );
    return router;
  }
}
module.exports = ExploreRouter;
