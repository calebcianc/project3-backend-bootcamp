async function InitializeUnsplash() {
  const fetchModule = await import("node-fetch");
  global.fetch = fetchModule.default || fetchModule;

  const { createApi } = require("unsplash-js");
  const dotenv = require("dotenv");
  dotenv.config();

  const unsplash = new createApi({
    accessKey: process.env.UNSPLASH_ACCESS_KEY,
  });

  async function SearchPhotos(query) {
    try {
      const res = await unsplash.search.getPhotos({
        query: query,
        page: 1,
        perPage: 1,
      });

      if (
        res.response &&
        res.response.results &&
        res.response.results.length > 0
      ) {
        // console.log("alt_description", res.response.results[0].alt_description);
        // console.log("url", res.response.results[0].urls.full);
        console.log(res.response.results[0].urls.full);
        return res.response.results[0].urls.full;
      } else {
        console.log(`No results found for query: ${query}`);
      }
    } catch (error) {
      console.error(`An error occurred: ${error}`);
    }
  }

  return SearchPhotos;
}
// SearchPhotos("Hutongs, Beijing");

module.exports = InitializeUnsplash;
