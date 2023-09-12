const BaseController = require("./baseController");
const XLSX = require("xlsx");
const { google } = require("googleapis");
const sheets = google.sheets("v4");

class DownloadController extends BaseController {
  constructor(model, activitiesModel, usersModel, user_itinerariesModel) {
    super(model);
    this.activitiesModel = activitiesModel;
    this.usersModel = usersModel;
    this.user_itinerariesModel = user_itinerariesModel;
  }

  async getActivitiesForExcelItinerary(req, res) {
    try {
      const itineraryId = req.params.itineraryId;
      console.log("itineraryId: ", JSON.stringify(itineraryId));

      // Fetch activities related to the specified itinerary
      const activities = await this.activitiesModel.findAll({
        where: { itineraryId: itineraryId },
        order: [
          ["date", "ASC"],
          ["activityOrder", "ASC"],
        ],
      });
      console.log("activities: ", JSON.stringify(activities));

      // Fetch the Itinerary record itself
      const itinerary = await this.model.findOne({
        where: { id: itineraryId },
      });

      console.log("itinerary: ", JSON.stringify(itinerary));

      // Combine both into a single object
      const itineraryData = {
        itinerary: itinerary,
        activities: activities,
      };
      console.log("itineraryData: ", JSON.stringify(itineraryData));

      return res.json(itineraryData);

      // const workbook = XLSX.utils.book_new();
      // const worksheet = XLSX.utils.json_to_sheet(activities);
      // XLSX.utils.book_append_sheet(workbook, worksheet, "Itinerary");
      // res.setHeader(
      //   "Content-Disposition",
      //   "attachment; filename=Itinerary.xlsx"
      // );
      // XLSX.write(workbook, { bookType: "xlsx", type: "buffer" }).pipe(res);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err.message });
    }
  }

  async getActivitiesForGoogleSheetItinerary(req, res) {
    try {
      const itineraryId = req.params.itineraryId;
      // console.log("itineraryId: ", JSON.stringify(itineraryId));

      // Fetch activities related to the specified itinerary
      const activities = await this.activitiesModel.findAll({
        where: { itineraryId: itineraryId },
        order: [
          ["date", "ASC"],
          ["activityOrder", "ASC"],
        ],
      });
      // console.log("activities: ", JSON.stringify(activities));

      // Fetch the Itinerary record itself
      const itinerary = await this.model.findOne({
        where: { id: itineraryId },
      });
      // console.log("itinerary: ", JSON.stringify(itinerary));

      // Combine both into a single object
      const itineraryData = {
        itinerary: itinerary,
        activities: activities,
      };
      console.log("itineraryData: ", JSON.stringify(itineraryData));

      // return res.json(itineraryData);

      // Create a new Google Sheet
      const sheet = await sheets.spreadsheets.create({
        // Configuration options for the spreadsheet can be specified here
        properties: {
          title: "Itinerary",
        },
      });
      const sheetId = sheet.data.spreadsheetId;
      console.log("sheetId: ", sheetId);
      // Populate Google Sheet with itinerary data here
      // Define the headers
      const headers = ["Date", "Activity Order", "Activity Name", "Location"];
      const headerRange = "Sheet1!A1:D1";

      // Update the header
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: headerRange,
        valueInputOption: "RAW",
        resource: {
          values: [headers],
        },
      });

      // Loop over the activities to populate the sheet
      itineraryData.activities.forEach(async (activity, index) => {
        const { date, activityOrder, name, location } = activity;
        const values = [date, activityOrder, name, location];
        const range = `Sheet1!A${index + 2}:D${index + 2}`; // Start from row 2 to allow for headers

        // Append the data
        await sheets.spreadsheets.values.append({
          spreadsheetId: sheetId,
          range: range,
          valueInputOption: "RAW",
          resource: {
            values: [values],
          },
        });
      });
      // Send back the URL to the newly created Google Sheet
      console.log(
        "url: ",
        `https://docs.google.com/spreadsheets/d/${sheetId}/edit`
      );
      res.json({ url: sheet.data.spreadsheetUrl });
    } catch (err) {
      return res.status(400).json({ error: true, msg: err.messages });
    }
  }
}

module.exports = DownloadController;
