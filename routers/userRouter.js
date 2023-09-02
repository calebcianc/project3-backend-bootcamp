const express = require("express");
const router = express.Router();

class UserRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    router.get("/", this.controller.getAllUser.bind(this.controller));
    router.post("/home", this.controller.checkUser.bind(this.controller));
    router.put(
      "/:userId/edit",
      this.controller.updateUser.bind(this.controller)
    );
    return router;
  }
}
module.exports = UserRouter;
