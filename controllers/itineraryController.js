const BaseController = require("./baseController");

class ItineraryController extends BaseController {
  constructor(model, activitiesModel, usersModel, user_itinerariesModel) {
    super(model);
    this.activitiesModel = activitiesModel;
    this.usersModel = usersModel;
    this.user_itinerariesModel = user_itinerariesModel;
  }

  // get all itineraries with activities that are public (for explore page)
  async getAllItineraryActivitiesPublic(req, res) {
    try {
      const itinerary = await this.model.findAll({
        where: { isPublic: true },
        include: [
          {
            model: this.activitiesModel,
          },
          {
            model: this.usersModel,
            attributes: ["id", "firstName", "lastName"],
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
      prompts,
      isPublic,
      maxPax,
      genderPreference,
      userId,
      activities,
    } = req.body;
    // call chatgpt api with the above prompt. output to include activites.

    try {
      const newItinerary = await this.model.create(
        {
          name: name,
          startDate: startDate,
          endDate: endDate,
          country: country,
          category: category,
          prompts: prompts,
          isPublic: isPublic,
          maxPax: maxPax,
          genderPreference: genderPreference,
          userId: userId,
          isCreator: true, //default for creation
          activities: activities,
        },
        { include: [this.activitiesModel] } //this tells Sequelize to also create Activity entries
      );

      // Associate the user with the itinerary and set is_creator to true
      await newItinerary.addUser(userId, { through: { is_creator: true } });

      return res.json(newItinerary);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err.message });
    }
  }

  // edit itinerary
  async editItinerary(req, res) {
    try {
      let { name, prompts, isPublic, maxPax, genderPreference } = req.body;
      const { userId, itineraryId } = req.params;
      // Find the existing itinerary
      let itineraryToEdit = await this.model.findByPk(itineraryId);

      if (!itineraryToEdit) {
        return res
          .status(404)
          .json({ error: true, msg: "Itinerary not found" });
      }

      // Update the itinerary
      await itineraryToEdit.update({
        name: name,
        prompts: prompts,
        isPublic: isPublic,
        maxPax: maxPax,
        genderPreference: genderPreference,
        // user_id: userId,
      });

      // Fetch and show all itineraries after the update
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
          userId: userId,
          itineraryId: itineraryId,
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
      if (!userItineraryRecord.isCreator) {
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
}

module.exports = ItineraryController;
