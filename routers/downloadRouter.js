const express = require("express");
const router = express.Router();

class DownloadRouter {
  constructor(controller, jwtCheck) {
    this.controller = controller;
    this.jwtCheck = jwtCheck;
  }
  routes() {
    router.get(
      "/excel/:itineraryId",
      this.jwtCheck,
      this.controller.getActivitiesForExcelItinerary.bind(this.controller)
    );

    router.get(
      "/googleSheet/:itineraryId",
      this.jwtCheck,
      this.controller.getActivitiesForGoogleSheetItinerary.bind(this.controller)
    );

    return router;
  }
}
module.exports = DownloadRouter;
