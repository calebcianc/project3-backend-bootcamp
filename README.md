# TRAVELGPT

A backend application for TravelGPT to create, join and manage travel itineraries.
Project 3 for Rocket Academy Bootcamp.

## Features

- Add new users or check for existing users in the database
- Add, edit and delete itinerary/ activities
- Join/ Leave itinerary that are tagged as public
- Separate the itinerary available to user via public
- itineraries, upcoming user itineraries and historical user itineraries
- view the tracjectory taken by the itinerary on the map which shows all the location of interest covered by the itinerary

## Tech Used

- Backend: [Node.js](https://nodejs.org/en), [Express.js](https://expressjs.com/), [Sequelize](https://sequelize.org/)
- Database: [PostgreSQL](https://www.postgresql.org/)
- API: [OpenAI](https://openai.com/product) , [Unsplash](https://unsplash.com/)

## Setup

Before starting, it is required to run the following steps for the application to work.

1. Clone repo to local

2. Configure `.env` file, make sure to get your own API keys stated below and insert it into your `.env` file

```
PORT = <PORT eg.3000>
DB_USERNAME = <DB_USERNAME>
DB_PASSWORD = <DB_PASSWORD if exist>
DB_NAME = <DB_NAME>
DB_HOST = <DB_HOST>
DB_DIALECT = postgres

OPENAI_API_KEY= <API Key>
UNSPLASH_ACCESS_KEY= <API Key>
```

3. Install all dependencies required in this repo

```
npm i
```

4. Next run database migration, and seeders before starting.

```
npx sequelize db:create
npx sequelize db:migrate
npx sequelize db:seed:all
```

5. Enter 'npm start' into Terminal to render the app. Open http://localhost:3000 to view it in your browser. Or you can run either one of the command below to run

```
node index.js
nodemon index.js
```

## Contributors

- [Caleb Castro](https://github.com/calebcianc)
- [Chloe Li](https://github.com/khloeli)
