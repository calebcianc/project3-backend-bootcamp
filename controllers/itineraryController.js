const fetchChatCompletion = require("../openai.js");
const BaseController = require("./baseController");
const SearchPhotos = require("../unsplash.js");
const { Op } = require("sequelize");

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

  // get all itineraries with activities that are public (for explore page) by user
  async getAllItineraryActivitiesPublicUser(req, res) {
    try {
      // Get userId from the request query params
      const { userId } = req.params;

      const notInitineraryId = await this.model.findAll({
        attributes: ["id"],
        include: [
          {
            model: this.usersModel,
            where: {
              id: userId,
            },
            attributes: [],
          },
        ],
      });

      const ids = notInitineraryId.map((item) => item.id);
      console.log("ids", ids);

      const itinerary = await this.model.findAll({
        where: { isPublic: true, id: { [Op.notIn]: ids } },
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
      return res.status(500).json({ error: true, msg: error.message });
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
      prompts, // stores startDate, endDate, country, category
      isPublic,
      maxPax,
      genderPreference,
      userId,
    } = req.body;

    try {
      // call chatgpt api and assign the array of activities to the activities variable
      const activities = await fetchChatCompletion({ prompts });
      if (!activities) {
        return res
          .status(400)
          .json({ error: true, msg: "Could not fetch activities" });
      }

      const transaction = await this.model.sequelize.transaction();

      try {
        // having the array of activities from chatGPT, we can create a new itinerary in the itineraries model in our db
        const newItinerary = await this.model.create({
          name: name,
          prompts: prompts,
          isPublic: isPublic,
          maxPax: maxPax,
          genderPreference: genderPreference,
          userId: userId,
          activities: activities, // array of objects from ChatGPT
        });

        // Associate the user with the itinerary and set isCreator to true
        await newItinerary.addUser(userId, {
          through: { isCreator: true },
          transaction,
        });

        const jsArrayActivities = JSON.parse(activities);

        // use unsplash to get photoUrl and insert into itinerary
        // const photoUrl = await SearchPhotos(jsArrayActivities[0].location);
        // console.log("photoUrl", photoUrl);
        // if (!photoUrl) {
        //   return res
        //     .status(400)
        //     .json({ error: true, msg: "Could not fetch activities" });
        // }
        // await newItinerary.update({ photoUrl: photoUrl });

        const bulkActivities = jsArrayActivities.map((activity) => ({
          date: activity.date.split("T")[0],
          name: activity.name,
          description: activity.description,
          type: activity.type,
          activityOrder: activity.activity_order,
          timeOfDay: activity.time_of_day,
          suggestedDuration: activity.suggested_duration,
          location: activity.location,
          latitude: activity.latitude,
          longitude: activity.longitude,
          itineraryId: newItinerary.id,
        }));
        await this.activitiesModel.bulkCreate(bulkActivities, {
          transaction,
        });
        await transaction.commit();

        //show remaining itineraries after creation
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
        console.log("allItinerary", allItinerary);
        return res.json(allItinerary);
      } catch (dbErr) {
        await transaction.rollback();
        return res.status(400).json({ error: true, msg: dbErr.message });
      }
    } catch (err) {
      return res.status(400).json({ error: true, msg: err.message });
    }
  }

  // edit itinerary
  async editItinerary(req, res) {
    try {
      let itineraryToAdd = req.body;
      const { userId, itineraryId } = req.params;
      // Find the existing itinerary
      let itineraryToEdit = await this.model.findByPk(itineraryId);
      if (!itineraryToEdit) {
        return res
          .status(404)
          .json({ error: true, msg: "Itinerary not found" });
      }
      console.log("itineraryToEdit", itineraryToEdit);
      const userItineraryRecord = await this.user_itinerariesModel.findOne({
        where: {
          userId: userId,
          itineraryId: itineraryId,
        },
      });
      console.log("userItineraryRecord", userItineraryRecord);

      // Check if the user is the creator
      if (!userItineraryRecord.isCreator) {
        throw new Error(
          "Only the creator can edit new activity in this itinerary"
        );
      }
      await itineraryToEdit.update(itineraryToAdd);

      return res.json(itineraryToEdit);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err.message });
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

      return res.json({
        message: `${userItineraryRecord.itinerary.name} itinerary is Successfully deleted`,
      });
    } catch (err) {
      return res.status(400).json({ error: true, msg: err.message });
    }
  }
}

module.exports = ItineraryController;
