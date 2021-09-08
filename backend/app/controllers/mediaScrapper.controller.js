// Imports 
const mediaScrapper = require("../models/mediaScrapper.model.js");
const url = require("url");
const path = require("path");
const cherio = require('cherio');
const request = require('request');

// Create and Save a new Media Scrapper Data
exports.addMediaScrapperData = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  if (!(req.body.webUrls &&
    Array.isArray(req.body.webUrls) &&
    req.body.webUrls.length)) {
    res.status(400).send({
      message: "webUrls can not be empty!"
    });
  }

  let finalDataObj = []
  for (let i = 0; i < req.body.webUrls.length; i++) {
    const webUrl = req.body.webUrls[i]

    request(webUrl, (err, resp, html) => {

      if (!err && resp.statusCode == 200) {
        // Define Cherio or $ Object 
        let $ = cherio.load(html);

        $("img").each((index, image) => {
          let img = $(image).attr('src');
          if (img && !(img.charAt(0) == '/')) {
            webUrl += '/'
          }
          
          let Links = webUrl + img;
          let parsed = url.parse(Links);

          // Create a Media Scrapper Data
          let mediaScrapperModel = new mediaScrapper({
            ImageUrl: Links || 'NOT_AVAILABLE',
            ImageName: path.basename(parsed.pathname) || 'NOT_AVAILABLE',
            WebURL: webUrl || 'NOT_AVAILABLE',
            CreatedAt: new Date()
          });
          finalDataObj.push(mediaScrapperModel)
        });
        finalDataObj.forEach((data, index) => {
          mediaScrapper.addMediaScrapperData(data, (err, result) => {
            if (err) {
              console.log('Error : ', err)
            }
          });
        })
        res.status(200).send({
          message: "Data stored in Database."
        });
      } else {
        console.log("Request Failed ", err);
        res.status(400).send({
          message: "Somme error occured" + err
        });
      }
    });
  }
};

// Retrieve all Media Scrapper Data from the database.
exports.showMediaScrapperData = (req, res) => {
  mediaScrapper.showMediaScrapperData(req.params, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Data."
      });
    else res.send(data);
  });
};
