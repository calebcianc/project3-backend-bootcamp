const BaseController = require("./baseController");

class ItineraryController extends BaseController {
  constructor(model) {
    super(model);
  }

  //findByPk is used to search for a single instance by its primary key.
  // Retrieve specific sighting
  // async getOne(req, res) {
  //   const { itineraryId } = req.params;
  //   try {
  //     const sighting = await this.model.findByPk(itineraryId); // models are created and exported, they already have the Sequelize methods (such as findByPk()) attached to them
  //     return res.json(sighting);
  //   } catch (err) {
  //     return res.status(400).json({ error: true, msg: err });
  //   }
  // }

  async getCategories(req, res) {
    try {
      const output = await this.model.findAll();
      return res.json(output);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}

module.exports = ItineraryController;
