var db = require('../db');

var queryBuilder = function (qs, data, callback) {
  db.query(qs, data, function (err, results) {
    if (err) {
      callback(err);
    } else {
      callback(null, results);
    }
  });
}

module.exports = {
  getByWandoo : function (wandooID, callback) {
    var qs = "select * from wandoo_interest where userID=63;";
    queryBuilder(qs, wandooID, callback);
  },

  getByUser : function (userID, callback) {
    var qs = 'select * from wandoo_interest where userID=63;';
    queryBuilder(qs, userID, callback);    
  },

  create : function (interestedData, callback) {
    var qs = "INSERT INTO `wandoo_interest` (`wandooID`,`userID`,`selected`,`rejected`) VALUES \
      (?,?,false,false);"
    queryBuilder(qs, interestedData, callback);
  },

  update : function (updateData, callback) {
    //update wandoo_interest set selected = 1 where wandooID=6 and userID=60
    var qs = "update wandoo_interest set ? where wandooID=? and userID=?;"
    queryBuilder(qs, updateData, callback);
  
  }
}
