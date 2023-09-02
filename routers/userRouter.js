const express = require("express");
const router = express.Router();
class UserRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.get("/", this.controller.getAllUser.bind(this.controller));
    router.post("/", this.controller.checkUser.bind(this.controller));
    router.put("/:userId/edit", this.controller.editUser.bind(this.controller));

    router.get(
      "/:itineraryId",
      this.controller.getAllUserByItinerary.bind(this.controller)
    );
    return router;
  }
}
module.exports = UserRouter;
