const BaseController = require("./baseController");

class ItineraryController extends BaseController {
  constructor(model, activitiesModel, usersModel, user_itinerariesModel) {
    super(model);
    this.activitiesModel = activitiesModel;
    this.usersModel = usersModel;
    this.user_itinerariesModel = user_itinerariesModel;
  }

  // get all itineraries with activities by users
  async getAllItinerary(req, res) {
    const { userId } = req.params;
    try {
      const itinerary = await this.model.findAll({
        include: [
          {
            model: this.activitiesModel,
          },
          {
            model: this.usersModel,
            where: { id: userId }, // Filter by userId
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

  // get specific itinerary with activities by users
  async getOneItineraryActivityByUser(req, res) {
    const { itineraryId, userId } = req.params;
    try {
      const itinerary = await this.model.findByPk(itineraryId, {
        include: [
          {
            model: this.activitiesModel,
          },
          {
            model: this.usersModel,
            where: { id: userId }, // Filter by userId
            attributes: ["id", "first_name", "last_name"],
          },
        ],
      });
      if (!itinerary) {
        return res.status(404).json({
          error: true,
          msg: "Itinerary not found/ itinerary not tag to user",
        });
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
      // either put startdate, enddate and country in req or place whole prompt in request.country, date etc to fit into prompt from front end
      // prompts,
      isPublic,
      maxPax,
      genderPreference,
      userId,
      activities,
    } = req.body;
    // call chatgpt api with the above prompt. output to include activites.
    try {
      const itinerary = await this.model.create(
        {
          name: name,
          // prompts: prompts,
          is_public: isPublic,
          max_pax: maxPax,
          gender_preference: genderPreference,
          user_id: userId,
          is_creator: true, //default for creation
          activities: activities,
        },
        { include: [this.activitiesModel] } //this tells Sequelize to also create Activity entries
      );

      // Associate the user with the itinerary and set is_creator to true
      await itinerary.addUser(userId, { through: { is_creator: true } });

      return res.json(itinerary);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err.message });
    }
  }

  // edit itinerary
  async editItinerary(req, res) {
    try {
      let itineraryToAdd = req.body;
      const { userId, itineraryId } = req.params;
      let itineraryToEdit = await this.model.findByPk(itineraryId);
      await itineraryToEdit.update(itineraryToAdd);
      //show remaining itineraries after deletion
      let allItinerary = await this.model.findAll({
        include: [
          {
            model: this.activitiesModel,
          },
          {
            model: this.usersModel,
            where: { id: userId },
          },
        ],
      });

      return res.json(allItinerary);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // delete itinerary (only for is_creator=true)
  async deleteItinerary(req, res) {
    try {
      const { userId, itineraryId } = req.params;
      // First, find the relevant record in the users_itineraries junction table
      const userItineraryRecord = await this.user_itinerariesModel.findOne({
        where: {
          user_id: userId,
          itinerary_id: itineraryId,
        },
        include: [
          {
            model: this.model,
            where: { id: itineraryId }, // Filter by userId
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
      if (!userItineraryRecord.is_creator) {
        throw new Error("Only the creator can delete this itinerary");
      }

      // Delete associated activities and users (with CASCADE). only owner can delete
      await this.model.destroy({ where: { id: itineraryId } });

      //show remaining itineraries after deletion
      let allItinerary = await this.model.findAll({
        include: [
          {
            model: this.activitiesModel,
          },
          {
            model: this.usersModel,
            where: { id: userId },
          },
        ],
      });

      // return res.json({
      //   message: `${userItineraryRecord.itinerary.name} itinerary is Successfully deleted`,
      // });
      return res.json({ allItinerary });
    } catch (err) {
      return res.status(400).json({ error: true, msg: err.message });
    }
  }

  // create activity for specific itinerary by user

  // edit actitvity

  // delete activity
}

module.exports = ItineraryController;
