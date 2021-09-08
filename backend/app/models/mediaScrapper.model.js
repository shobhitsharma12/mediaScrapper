const sql = require("../config/db.js");

// constructor
const MediaScrapper = function (mediaScrapper) {
  this.Id = mediaScrapper.Id;
  this.ImageUrl = mediaScrapper.ImageUrl;
  this.ImageName = mediaScrapper.ImageName;
  this.WebURL = mediaScrapper.WebURL;
  this.CreatedAt = mediaScrapper.CreatedAt;
};

MediaScrapper.addMediaScrapperData = (newMediaScrapper, result) => {
  sql.query("INSERT INTO MediaScrapper SET ?", newMediaScrapper, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created media scrapper: ", { id: res.insertId, ...newMediaScrapper });
    result(null, { id: res.insertId, ...newMediaScrapper });
  });
};

MediaScrapper.showMediaScrapperData = (requestedData, result) => {
  let limitStart = requestedData.limitStart || 0
  let numberOfData = requestedData.numberOfData || 10
  let searchText = ''
  if (requestedData.searchText && !(requestedData.searchText == 'all')) {
    searchText = ` WHERE ImageName LIKE '%${requestedData.searchText}%' `
  } else {
    searchText = ' '
  }

  sql.query(`SELECT * FROM MediaScrapper${searchText}limit ${limitStart},${numberOfData}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    } else {
      console.log("Media Scrapper Data: ", res);
      sql.query(`SELECT count(*) as count FROM MediaScrapper${searchText}`, (err, count) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        } else {
          console.log("Media Scrapper Count: ", count);
          count = JSON.parse(JSON.stringify(count))
          res = JSON.parse(JSON.stringify(res))
          res['count'] = count[0].count;
          const finalResponse = {
            data: res,
            count: count[0].count
          }
          result(null, finalResponse);
        }
      });
    }
  });
};

module.exports = MediaScrapper;
