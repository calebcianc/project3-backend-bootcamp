const BaseController = require("./baseController");
class UserController extends BaseController {
  constructor(model, activitiesModel, usersModel, user_itinerariesModel) {
    super(model);
    this.activitiesModel = activitiesModel;
    this.usersModel = usersModel;
    this.user_itinerariesModel = user_itinerariesModel;
  }
  async getAllUser(req, res) {
    try {
      const allUsers = await this.usersModel.findAll({});
      return res.json(allUsers);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err.messages });
    }
  }
  async checkUser(req, res) {
    const { email } = req.body;
    try {
      const [currUser] = await this.usersModel.findOrCreate({
        where: { email: email },
      });
      return res.json(currUser);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err.messages });
    }
  }
  async editUser(req, res) {
    try {
      let userToAdd = req.body;
      let userToReplace = req.params.userId;
      console.log(userToReplace);
      let userToEdit = await this.usersModel.findByPk(userToReplace);
      console.log(userToEdit);
      await userToEdit.update(userToAdd);
      return res.json(userToEdit);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err.messages });
    }
  }
  async getAllUserByItinerary(req, res) {
    const { itineraryId } = req.params;
    try {
      const allUsers = await this.user_itinerariesModel.findAll({
        where: { itineraryId: itineraryId },
        include: [
          {
            model: this.usersModel,
          },
        ],
      });
      return res.json(allUsers);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err.message });
    }
  }
}
module.exports = UserController;
