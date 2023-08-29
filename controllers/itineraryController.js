const BaseController = require("./baseController");

class ItineraryController extends BaseController {
  constructor(model, activitiesModel) {
    super(model);
    this.activitiesModel = activitiesModel;
  }

  // Retrieve itineraries along with their associated activities
  async getItineraryWithActivities(req, res) {
    const { itineraryId } = req.params;
    try {
      const itinerary = await this.model.findByPk(itineraryId, {
        include: [{ model: this.activitiesModel }],
        // Assuming you have an Activity model and it's associated with Itinerary
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

  // Create itinerary
  async createItinerary(req, res) {
    const {
      name,
      prompts, // country, date etc to fit into prompt from front end
      isPublic,
      maxPax,
      genderPreference,
      userId, // to extract from front end
      isCreator,
    } = req.body;
    // call chatgpt
    try {
      const itinerary = await this.model.create({
        name: name,
        prompts: prompts,
        is_public: isPublic,
        max_pax: maxPax,
        gender_preference: genderPreference,
        user_id: userId,
        is_creator: isCreator,
      });
      // Associate the itinerary with the provided guestIds
      if (userId && userId.length) {
        await itinerary.setUsers(userId);
      }
      return res.json(itinerary);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}

module.exports = ItineraryController;
