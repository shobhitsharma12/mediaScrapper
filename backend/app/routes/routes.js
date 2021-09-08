module.exports = app => {
  const mediaScrapper = require("../controllers/mediaScrapper.controller.js");

  // Create a new Media Scrapper Data
  app.post("/addMediaScrapperData", mediaScrapper.addMediaScrapperData);

  // Retrieve Media Scrapper Data
  app.get("/showMediaScrapperData/:limitStart/:numberOfData/:searchText", mediaScrapper.showMediaScrapperData);

};
