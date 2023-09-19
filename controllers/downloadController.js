const BaseController = require("./baseController");
const XLSX = require("xlsx");
const { OAuth2Client } = require("google-auth-library");
const { google } = require("googleapis");
const axios = require("axios");

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
      // extract and verify idToken from request body
      console.log(`request.body: `, JSON.stringify(req.body));
      const { idToken } = req.body;
      console.log(`idToken: `, { idToken });

      const itineraryId = req.params.itineraryId;

      console.log("2. itineraryId found: ", JSON.stringify(itineraryId));

      console.log("3. fetching activities...", JSON.stringify(itineraryId));

      // Fetch activities related to the specified itinerary
      const activities = await this.activitiesModel.findAll({
        where: { itineraryId: itineraryId },
        order: [
          ["date", "ASC"],
          ["activityOrder", "ASC"],
        ],
      });

      console.log("4. activities fetched: ", JSON.stringify(activities));

      console.log("5. fetching itinerary details...");

      // Fetch the Itinerary record itself
      const itinerary = await this.model.findOne({
        where: { id: itineraryId },
      });

      console.log("6. itinerary fetched: ", JSON.stringify(itinerary));

      console.log(
        "7. combining itinerary and activities data: ",
        JSON.stringify(itinerary)
      );

      // Combine both into a single object
      const itineraryData = {
        itinerary: itinerary,
        activities: activities,
      };

      console.log("8. itineraryData: ", JSON.stringify(itineraryData));

      console.log("9. creating google sheet...");

      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      client.setCredentials({
        access_token: idToken.access_token,
        // optionally, you can set a refresh token here
      });

      const service = google.sheets({ version: "v4", auth: client });
      const resource = {
        properties: {
          title: `${itinerary.name}`,
        },
      };

      // Create a new Google Sheet
      const sheet = await service.spreadsheets.create({
        // Configuration options for the spreadsheet can be specified here
        resource,
        fields: `spreadsheetId`,
      });
      const spreadsheetId = sheet.data.spreadsheetId;
      console.log("10. spreadsheetId: ", spreadsheetId);

      // Populate Google Sheet with itinerary data here
      // Define the headers
      const headers = [
        "Date",
        "Time of Day",
        "Location",
        "Activity Name",
        "Description",
        "Activity Order",
      ];
      const headerRange = "Sheet1!A1:E1";

      console.log(`11. headers: `, { headers });

      // Update the header
      await service.spreadsheets.values.update({
        spreadsheetId: spreadsheetId,
        range: headerRange,
        valueInputOption: "RAW",
        resource: {
          values: [
            ["Date", "Time of Day", "Location", "Activity Name", "Description"],
          ],
        },
      });

      // update;
      console.log(`12. looping over activities...`);
      // Loop over the activities to populate the sheet
      itineraryData.activities.forEach(async (activity, index) => {
        const { date, timeOfDay, location, name, description, activityOrder } =
          activity;
        // Convert ISO string to Date object
        const dateObject = new Date(date);

        // Format the date
        const day = dateObject.getUTCDate(); // Gets the day of the month
        const year = dateObject.getUTCFullYear().toString().slice(-2); // Gets the last two digits of the year
        const monthArray = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        const month = monthArray[dateObject.getUTCMonth()]; // Gets the month name

        const formattedDate = `${day} ${month} ${year}`;

        function toTitleCase(str) {
          return str.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
          });
        }

        const capitalizedTimeOfDay = toTitleCase(timeOfDay);

        const values = [
          formattedDate, // Use the formatted date
          capitalizedTimeOfDay,
          location,
          name,
          description,
        ];
        const range = `Sheet1!A${index + 2}:F${index + 2}`; // Start from row 2 to allow for headers

        console.log(`13. appending data...`);
        // Append the data
        await service.spreadsheets.values.append({
          spreadsheetId: spreadsheetId,
          range: range,
          valueInputOption: "RAW",
          resource: {
            values: [values],
          },
        });
      });

      // Bold the headers
      const boldHeadersRequest = {
        updateCells: {
          range: {
            sheetId: 0, // 0 refers to the first sheet
            startRowIndex: 0,
            endRowIndex: 1, // Bold the first row (row index 0)
            startColumnIndex: 0,
            endColumnIndex: headers.length, // End column index should be same as the length of headers array
          },
          fields: "userEnteredFormat.textFormat.bold",
          rows: [
            {
              values: new Array(headers.length).fill({
                userEnteredFormat: {
                  textFormat: {
                    bold: true,
                  },
                },
              }),
            },
          ],
        },
      };

      // Wrap text for Column E (Column index 4)
      const wrapTextRequest = {
        updateCells: {
          range: {
            sheetId: 0,
            startColumnIndex: 4, // 4 corresponds to Column E
            endColumnIndex: 5,
          },
          fields: "userEnteredFormat.wrapStrategy",
          rows: [
            {
              values: [
                {
                  userEnteredFormat: {
                    wrapStrategy: "WRAP",
                  },
                },
              ],
            },
          ],
        },
      };

      // Auto-resize the width of all columns
      const autoResizeRequest = {
        autoResizeDimensions: {
          dimensions: {
            sheetId: 0,
            dimension: "COLUMNS",
            startIndex: 0,
            endIndex: headers.length,
          },
        },
      };

      const requests = [boldHeadersRequest, wrapTextRequest, autoResizeRequest];

      // Execute the batchUpdate to apply all formatting
      await service.spreadsheets.batchUpdate({
        spreadsheetId,
        resource: {
          requests,
        },
      });

      // console.log(
      //   "url: ",
      //   `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`
      // );
      // console.log(`sheet.data: `, sheet.data);
      // console.log(`sheet.data.spreadsheetUrl: `, sheet.data.spreadsheetUrl);
      res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
      res.json({
        url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
      });
    } catch (err) {
      return res.status(400).json({ error: true, msg: err.message });
    }
  }
}

module.exports = DownloadController;
