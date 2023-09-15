const express = require("express");
const router = express.Router();

class DownloadRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.get(
      "/excel/:itineraryId",
      this.controller.getActivitiesForExcelItinerary.bind(this.controller)
    );

    router.get(
      "/googleSheet/:itineraryId",
      this.controller.getActivitiesForGoogleSheetItinerary.bind(this.controller)
    );

    return router;
  }
}
module.exports = DownloadRouter;
