"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("users", [
      {
        first_name: "Jane",
        last_name: "Doe",
        email: "jane.doe@gmail.com",
        gender: "Female",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "John",
        last_name: "Doe",
        email: "john.doe@gmail.com",
        gender: "Male",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Jason",
        last_name: "Tan",
        email: "jason.tan@gmail.com",
        gender: "Male",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        first_name: "Barbie",
        last_name: "Pink",
        email: "barbie.pink@gmail.com",
        gender: "Female",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
    await queryInterface.bulkInsert("itineraries", [
      {
        name: "China tour",
        is_public: true,
        max_pax: 4,
        gender_preference: "Any",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Better China tour",

        is_public: false,
        max_pax: 3,
        gender_preference: "Female",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
    await queryInterface.bulkInsert("activities", [
      {
        name: "Visit Forbidden City",
        date: "1 November 2023",
        time_of_day: "afternoon",
        suggested_duration: "2 to 3 hours",
        location: "Forbidden City, Beijing",
        latitude: 39.9165,
        longitude: 116.3972,
        description:
          "The Forbidden City in Beijing, China, is a historic palace complex that served as the imperial residence for 24 emperors during the Ming and Qing Dynasties. Spanning over 180 acres, it is a masterpiece of Chinese architecture and is now a UNESCO World Heritage Site, attracting millions of visitors annually.",
        activity_order: 1,
        photo_url:
          "https://media.istockphoto.com/id/1495251403/photo/the-heavy-snow-in-forbidden-city-beijing-of-china.jpg?s=612x612&w=is&k=20&c=BmotV-P-s6CtwkdyDWpcQWV-BQmFEaYPjo1MRwlEgz4=",
        type: "cultural",
        itinerary_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Great Wall of China Tour",
        date: "2 November 2023",
        time_of_day: "morning",
        suggested_duration: "4 to 5 hours",
        location: "Great Wall of China, Beijing",
        latitude: 40.4319,
        longitude: 116.5704,
        description:
          "Explore one of the most iconic wonders of the world, the Great Wall of China. Spanning over 13,000 miles, the Great Wall offers breathtaking views and is a testament to the ancient engineering skills of the Chinese civilization.",
        activity_order: 2,
        type: "sightseeing",
        itinerary_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Hutong Rickshaw Tour",
        date: "2 November 2023",
        time_of_day: "afternoon",
        suggested_duration: "1 to 2 hours",
        location: "Hutong, Beijing",
        latitude: 39.9366,
        longitude: 116.4039,
        description:
          "Embark on a traditional rickshaw tour through the narrow alleys of Beijing's Hutongs. Explore the historic courtyard houses and experience the local culture and lifestyle.",
        activity_order: 3,
        type: "cultural",
        itinerary_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Terracotta Army Visit",
        date: "3 November 2023",
        time_of_day: "morning",
        suggested_duration: "3 to 4 hours",
        location: "Terracotta Army Museum, Xi'an",
        latitude: 34.384,
        longitude: 109.274,
        description:
          "Discover the ancient Terracotta Army, a collection of life-sized sculptures depicting the army of Qin Shi Huang, the first Emperor of China. Marvel at the intricate details and learn about the history behind this archaeological wonder.",
        activity_order: 4,
        type: "sightseeing",
        itinerary_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Muslim Quarter Food Tour",
        date: "3 November 2023",
        time_of_day: "afternoon",
        suggested_duration: "2 to 3 hours",
        location: "Muslim Quarter, Xi'an",
        latitude: 34.2681,
        longitude: 108.9547,
        description:
          "Indulge in the flavors of Xi'an's Muslim Quarter on a guided food tour. Sample delicious street food and traditional dishes while immersing yourself in the vibrant atmosphere of the bustling markets.",
        activity_order: 5,
        type: "cultural",
        itinerary_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },

      {
        name: "Fly to Chengdu",
        date: "8 November 2023",
        time_of_day: "morning",
        suggested_duration: "2 hours",
        location: "Shanghai to Chengdu",
        latitude: 30.5728,
        longitude: 104.0668,
        description: "Take a domestic flight from Shanghai to Chengdu.",
        activity_order: 1,
        type: "general",
        itinerary_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Sichuan Opera",
        date: "8 November 2023",
        time_of_day: "evening",
        suggested_duration: "2 hours",
        location: "Shufeng Yayun Teahouse, Chengdu",
        latitude: 30.6494,
        longitude: 104.0774,
        description:
          "Watch a performance of the Sichuan Opera, a type of Chinese opera originating from China's Sichuan province.",
        activity_order: 2,
        type: "cultural",
        itinerary_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Panda Sanctuary Visit",
        date: "9 November 2023",
        time_of_day: "morning",
        suggested_duration: "2 to 3 hours",
        location: "Panda Sanctuary, Chengdu",
        latitude: 30.7338,
        longitude: 104.146,
        description:
          "Visit the Chengdu Research Base of Giant Panda Breeding and spend some time observing these adorable creatures.",
        activity_order: 3,
        type: "nature",
        itinerary_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Departure",
        date: "10 November 2023",
        time_of_day: "morning",
        suggested_duration: "2 to 3 hours",
        location: "Chengdu to Home",
        latitude: 30.5786,
        longitude: 103.9471,
        description: "Take an international flight back home.",
        activity_order: 4,
        type: "general",
        itinerary_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
    await queryInterface.bulkInsert("user_itineraries", [
      {
        user_id: 1,
        is_creator: true,
        itinerary_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 3,
        is_creator: false,
        itinerary_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 2,
        is_creator: true,
        itinerary_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: 1,
        is_creator: false,
        itinerary_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
    await queryInterface.bulkDelete("itineraries", null, {});
    await queryInterface.bulkDelete("activities", null, {});
  },
};
