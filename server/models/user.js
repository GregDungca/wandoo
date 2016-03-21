var db = require('../db/db');
var _ = require('underscore');
var dbUtils = require('../db/dbUtils');

module.exports = {
  getByUserID : function (userID, callback) {
    var qs = "select user.*, institution_name from user left join \
    user_education on (user.userID = user_education.userID) where user.userID = ?;";
    dbUtils.queryBuilder(qs, userID, callback);
  },

  getByFBID : function (facebookID, callback) {
    var qs = "select user.*, institution_name from user left join \
    user_education on (user.userID = user_education.userID) where user.facebookID = ?;";
    dbUtils.queryBuilder(qs, facebookID, callback);
  },

  getObjIDs : function (userIDs, callback) {
    var qs = "select userID, objectID from user where userID in (?)";
    if (!userIDs.length) {
      callback(null, 'No userIDs were provided');
    } else {
      dbUtils.queryBuilder(qs, [userIDs], callback);
    }
  },
  
  create : function (userData, eduData, callback) {
    var qs1 = "INSERT INTO `user` (`userID`,`name`,`facebookID`,`email`,\
      `age`,`sex`,`profile_picture`,`employer`,`job_title`,`latitude`,`longitude`,`objectID`) \
      VALUES (0,?,?,?,?,?,?,?,?,?,?,?);";

    var qs2 = "INSERT INTO `user_education` \
      (`userID`,`institution_name`) VALUES (?,?);";

    db.getConnection(function (err, con) {
      if (err) {
        con.release();
        callback(err);
      } else {
        db.query(qs1, userData, function (err, result1) {
          if (err) {
            con.release();
            callback(err);
          } else {
            var userID = result1.insertId;
            var eduValues = [userID].concat(eduData);
            db.query(qs2, eduValues, function (err,result2) {
              con.release();
              if (err) {
                callback(err);
              } else {
                callback(null, result1, result2);
              }
            });
          }  
        });
      }
    });


  },

  delete : function (userID, callback) {
    var qs1 = "delete from room_user where userID = ?;";
    var qs2 = "delete from wandoo where userID = ?;";
    var qs3 = "delete from user_education where userID = ?;";
    var qs4 = "delete from user where userID = ?;";
    
    dbUtils.queryBuilder(qs1, [userID], function (err, result1) {
      if (err) {
        callback(err);
      } else {
        dbUtils.queryBuilder(qs2, [userID], function (err, result2) {
          if (err) {
            callback(err);
          } else {
            dbUtils.queryBuilder(qs3, [userID], function (err, result3) {
              if (err) {
                callback(err);
              } else {
                dbUtils.queryBuilder(qs4, [userID], function (err, result4) {
                  if (err) {
                    callback(err);
                  } else {
                    callback(null, result1, result2, result3, result4);
                  }
                });
              }
            });
          }
        });
      }
    });
  },

  update : function (locationData, callback) {
    var qs = "update user set latitude = ?, longitude = ? where userID = ?;";

    dbUtils.queryBuilder(qs, locationData, callback);

  }

}
