const BaseController = require("./baseController");

class ItineraryController extends BaseController {
  constructor(model, activitiesModel, usersModel) {
    super(model);
    this.activitiesModel = activitiesModel;
    this.usersModel = usersModel;
  }

  // get all itineraries with activities that are public (for explore page)
  async getAllItineraryActivitiesPublic(req, res) {
    try {
      const itinerary = await this.model.findAll({
        where: { is_public: true },
        include: [
          {
            model: this.activitiesModel,
          },
          {
            model: this.usersModel,
            attributes: ["id", "first_name", "last_name"],
          },
        ],
      });
      if (!itinerary) {
        return res
          .status(404)
          .json({ error: true, msg: "Itinerary not found" });
      }
      return res.json(itinerary);
    } catch (error) {
      console.error("Error fetching itineraries with activities:", error);
      return res
        .status(500)
        .json({ error: true, msg: "Internal Server Error" });
    }
  }
}

module.exports = ItineraryController;
