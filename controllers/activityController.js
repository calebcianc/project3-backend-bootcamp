const BaseController = require("./baseController");

class ActivityController extends BaseController {
  constructor(model, activitiesModel, usersModel, user_itinerariesModel) {
    super(model);
    this.activitiesModel = activitiesModel;
    this.usersModel = usersModel;
    this.user_itinerariesModel = user_itinerariesModel;
  }
  async getAllActivities(req, res) {
    try {
      const allActivities = await this.activitiesModel.findAll({});
      return res.json(allActivities);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err.messages });
    }
  }

  async getOneActivity(req, res) {
    try {
      const { activityId } = req.params;
      const activity = await this.activitiesModel.findByPk(activityId, {
        where: { id: activityId },
      });
      return res.json(activity);
    } catch (error) {
      console.error("Error fetching itineraries with activities:", error);
      return res
        .status(500)
        .json({ error: true, msg: "Internal Server Error" });
    }
  }

  async editActivity(req, res) {
    try {
      let activitiesToAdd = req.body;
      const { activityId, userId } = req.params;
      const activityToEdit = await this.activitiesModel.findByPk(activityId);
      const userItineraryRecord = await this.user_itinerariesModel.findOne({
        where: {
          userId: userId,
          itineraryId: activityToEdit.itineraryId,
        },
      });
      // Check if the user is the creator
      if (!userItineraryRecord.isCreator) {
        throw new Error(
          "Only the creator can create new activity in this itinerary"
        );
      }
      await activityToEdit.update(activitiesToAdd);
      return res.json(userItineraryRecord);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err.message });
    }
  }

  async createActivity(req, res) {
    try {
      const newActivity = req.body;
      const { itineraryId, userId } = req.params;
      // First, find the relevant record in the users_itineraries junction table
      const userItineraryRecord = await this.user_itinerariesModel.findOne({
        where: {
          userId: userId,
          itineraryId: itineraryId,
        },
        include: [
          {
            model: this.model,
            where: { id: itineraryId },
            attributes: ["name"],
          },
        ],
      });
      console.log("userItineraryRecord", userItineraryRecord);

      // Check if the record exists
      if (!userItineraryRecord) {
        throw new Error("You do not have access to this itinerary");
      }

      // Check if the user is the creator
      if (!userItineraryRecord.isCreator) {
        throw new Error(
          "Only the creator can create new activity in this itinerary"
        );
      }

      const activity = await this.activitiesModel.create(newActivity);
      return res.json(activity);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err.message });
    }
  }

  // delete activity
}

module.exports = ActivityController;
