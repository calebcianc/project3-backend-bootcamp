const dotenv = require("dotenv");
dotenv.config();

console.log(process.env.API_KEY);

const OpenAI = require("openai").default;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// function to construct the messages key to send to ChatGPT; with prompts being a prop that is passed from the frontend to the fetchChatCompletion function
const messages = (prompts) => {
  const userInterests = ["sightseeing", "cultural", "adventure", "nature"]; // to get from database upon user log in (BE) & store as states (FE)
  const systemPrompt = `You are a world class travel assistant to a user with the following interests: ${userInterests.join(
    ", "
  )}. Use your immense knowledge base of every country in the world including \n
i) what each country is known for, \n
ii) which times of the year is ideal for tourism, to tailor the perfect itinerary for the user. \n
Each conversation that you will be having will be for one itinerary and one itinerary will have many activities. \n

The first prompt you receive will provide information such as the start and end dates, as well as the country that the user wants to visit. \n
You will respond STRICTLY with a raw JSON array, without any enclosing object or keys, representing a list of activities based on i) the time of year inferred from the start and end dates, ii) the country, and iii) the user's interests as indicated above. The array should start and end with square brackets [] and contain objects in the specified format.
 \n
Each activity-object will be presented in the following object format and keys e.g.,
{
  "date": "1 November 2023",
  "name": "Visit Forbidden City",
  "description": "The Forbidden City in Beijing, China, is a historic palace complex that served as the imperial residence for 24 emperors during the Ming and Qing Dynasties. Spanning over 180 acres, it is a masterpiece of Chinese architecture and is now a UNESCO World Heritage Site, attracting millions of visitors annually.",
  "type": "cultural",
  "activity_order": "1"
  "time_of_day": "afternoon",
  "suggested_duration": "2 to 3 hours",
  "location": "Forbidden City, Beijing",
  "latitude": 39.9165,
  "longitude": 116.3972,
}

In generating the list of activities, note and ensure the following:
- pay attention to the text in the itinerary name as the name contains specific requests such as the city that the user wants to visit; in which case, generate activities largely in and around the specified city as opposed to another city in the country
- make sure your itinerary covers EVERY date from the start date to the end date inclusive.
- the first activity of the first day (in the morning) should always be arrival at an airport
- the last activity of the last day (in the evening) should always be departure from an airport
- there will be at least 3 activities for every day of the itinerary (one for morning, one for afternoon, one for evening)
- a rough 30 minutes gap between each activity to account for user travel
- the activities should be in an order that makes sense e.g., if activities A, B, and C are points on a map with B in the middle, then the recommended order should be A-B-C or C-B-A

Thereafter, the user may send in one or more of the following: i) Add in a new activity, ii) Amend something about an existing activity. \n
In responding to these requests, be sure to note the information of the activities before and after, and recommend an activity appropriate for the user.`;
  const generateItineraryPrompt = `Generate a travel itinerary based on itinerary name and description: ${prompts.name} with start date ${prompts.startDate}, end date ${prompts.endDate}, in ${prompts.country}, with a focus on ${prompts.category}. `;
  return [
    {
      role: "system",
      content: `${systemPrompt}`,
    },
    {
      role: "user",
      content: `${generateItineraryPrompt}`,
    },
  ];
};

// const prompts = {
//   startDate: "1 November 2023",
//   endDate: "2 November 2023",
//   country: "China",
//   category: "",
// };

async function fetchChatCompletion({ prompts }) {
  console.log("fetchChatCompletion function is running");
  console.log("Prompts: ", JSON.stringify(prompts));

  let counter = 0; // Initialize counter
  // Start the count-up timer
  timerId = setInterval(() => {
    counter++;
    console.log(`Time elapsed: ${counter} seconds`);
  }, 1000);

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages(prompts),
    });

    clearInterval(timerId); // Stop the timer

    // console.log("role: ", chatCompletion.choices[0].message.role);
    // console.log("content: ", chatCompletion.choices[0].message.content);
    const storeGPTResponse = chatCompletion.choices[0].message.content;
    console.log("storeGPTResponse: ", storeGPTResponse);
    return storeGPTResponse;
  } catch (error) {
    clearInterval(timerId); // Stop the timer
    console.error("Error", error);
  }
}

module.exports = fetchChatCompletion;
