const express = require("express");
const router = express.Router();

class ActivityRouter {
  constructor(controller) {
    this.controller = controller;
    this.jwtCheck = jwtCheck;
  }
  routes() {
    router.get("/", this.controller.getAllActivities.bind(this.controller));
    router.get(
      "/:activityId",
      this.controller.getOneActivity.bind(this.controller)
    );
    router.post(
      "/:itineraryId/:userId",
      this.controller.createActivity.bind(this.controller)
    );
    router.put(
      "/:activityId/:userId",
      this.controller.editActivity.bind(this.controller)
    );
    router.delete(
      "/:activityId/:userId",
      this.controller.deleteActivity.bind(this.controller)
    );
    return router;
  }
}
module.exports = ActivityRouter;
