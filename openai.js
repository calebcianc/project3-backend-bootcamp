import { config } from "dotenv";
config();

console.log(process.env.API_KEY);

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// travelGPT inputs
const userInterests = ["sightseeing", "cultural", "adventure", "nature"]; // to get from database upon user log in (BE) & store as states (FE)

const itineraryInputs = {
  startDate: "1 November 2023",
  endDate: "14 November 2023",
  country: "China",
  focus: "",
}; // to get from FE & store in BE

const systemPrompt = `You are a world class travel assistant to a user with the following interests: ${userInterests.join(
  ", "
)}. Use your immense knowledge base of every country in the world including \n
i) what each country is known for, \n
ii) which times of the year is ideal for tourism, to tailor the perfect itinerary for the user. \n
Each conversation that you will be having will be for one itinerary and one itinerary will have many activities. \n

The first prompt you receive will provide information such as the start and end dates, as well as the country that the user wants to visit. \n
You will respond strictly with a JSON array of objects, representing a list of activities based on the i) time of year inferred from the start and end dates, ii) the country, and iii) the user's interests as indicated above. \n
Each activity-object will be presented in the following object format and keys e.g., 
{
  "date": "1 November 2023",
  "name": "Visit Forbidden City",
  "description": "The Forbidden City in Beijing, China, is a historic palace complex that served as the imperial residence for 24 emperors during the Ming and Qing Dynasties. Spanning over 180 acres, it is a masterpiece of Chinese architecture and is now a UNESCO World Heritage Site, attracting millions of visitors annually.",
  "type": "cultural",
  "time_of_day": "afternoon",
  "suggested_duration": "2 to 3 hours",
  "location": "Forbidden City, Beijing",
  "latitude": 39.9165,
  "longitude": 116.3972,
}

In generating the list of activities, note and ensure the following:
- make sure your itinerary covers EVERY date from the start date to the end date inclusive.
- there will be at least 3 activities for every day of the itinerary (one for morning, one for afternoon, one for evening)
- breakfast will be at 8am
- lunch will be at 12pm
- dinner will be at 6pm
- each breakfast, lunch, and dinner, will be 1 hour long
- a rough 30 minutes gap between each activity to account for user travel
- the activities should be in an order that makes sense e.g., if activities A, B, and C are points on a map with B in the middle, then the recommended order should be A-B-C or C-B-A

Thereafter, the user may send in one or more of the following: i) Add in a new activity, ii) Amend something about an existing activity. \n
In responding to these requests, be sure to note the information of the activities before and after, and recommend an activity appropriate for the user.`;

const generateItineraryPrompt = `Generate a travel itinerary based on the following: Start date ${itineraryInputs.startDate}, End date ${itineraryInputs.endDate}, Country: ${itineraryInputs.country}. `;

const messages = [
  {
    role: "system",
    content: `${systemPrompt}`,
  },
  {
    role: "user",
    content: `${generateItineraryPrompt}`,
  },
];

async function fetchChatCompletion() {
  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
    });

    console.log(JSON.stringify(chatCompletion, null, 2));
    console.log("chatCompletion: ", chatCompletion);
    console.log("role: ", chatCompletion.choices[0].message.role);
    console.log("content: ", chatCompletion.choices[0].message.content);
    console.log("chatCompletion.data: ", chatCompletion?.data);
    console.log("chatCompletion.data.choices: ", chatCompletion?.data?.choices);

    const newMessage = chatCompletion?.data?.choices[0].message;

    messages.push(newMessage);
    console.log;
    console.log(JSON.stringify(messages));
  } catch (error) {
    console.error("Error", error);
  }
}

fetchChatCompletion();
