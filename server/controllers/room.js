var room = require('../models/room');
var user = require('../models/user');
var util = require('../util/util');
var _ = require('underscore');
var layer = require('../util/layer');

var roomExpiry = 1;// number of days after end time when room will be expired

var postQueryCB = function (err, result, res) {
  if (err) {
    console.error(err);
    res.status('400').send('There was an error with insertion');
  } else {
    res.send();
  }  
}

var putQueryCB = function (err, result, res) {
  if (err) {
    console.error(err);
    res.status('400').send('There was an error with update');
  } else {
    res.send();
  }  
}

var getQueryCB = function (err, result, res) {
  if (err) {
    console.error(err);
    res.status('400').send('There was an error with selection');
  } else {
    res.json({data : result});
  }
}

var deleteQueryCB = function (err, result, res) {
  if (err) {
    console.error(err);
    res.status('400').send('There was an error in deletion');
  } else {
    res.send();
  }
}

var insertRoomAndConversation = function (wandooID, userIDs, callback) {
  var expiryTime = new Date();
  expiryTime.setDate(expiryTime.getDate() + roomExpiry);
  util.isoDateToMySQL(expiryTime.toJSON());

  var objectIDs = [];
  var group = false;

  // Need to gracefully handle errors and send appropriate response to client
  
  var insertRoom = function (userIDs) {
    user.getObjIDs(userIDs, function (err, result) { //expects userIDs []
      if (err) {
        console.log('Error in objectID retrieval')
        console.error(err);
        callback(err);
      } else {
        if (group) {
          objectIDs.push(result[0]['objectID']);
        } else {
          objectIDs = _.pluck(result, 'objectID');
        }
        layer.createConversation(objectIDs, function (err, conversationID) {
          if (err) {
            console.log('Error in creating a conversation via Layer API');
            console.error(err);
            callback(err);
          } else {
            room.create([expiryTime, wandooID, conversationID],
            userIDs, function(err, result) {
              if (err) {
                console.log('Error in room creation');
                console.error(err);
                callback(err);
              } else {
                // get count of the number of rooms with the provided wandooID
                room.getCountForWandoo(wandooID, function (err, result) {
                  if (err) {
                    console.log('Error in getting room count for wandoos');
                    console.error(err);
                    callback(err);
                  } else if (result[0].count === 2) {
                    room.getWandooUsers(wandooID, function (err, result) {
                      if (err) {
                        console.log('Error in getting wandoo users');
                        callback(err);
                      } else {
                        group = true;
                        insertRoom(_.difference(_.pluck(result, 'userID'), userIDs));
                      }
                    });
                  } else if (result[0].count > 2) {
                    group = true;
                  } else {
                    callback();
                  }
                })
              }
            });
          }
        });
      }
    });
  }
  insertRoom(userIDs);

}

module.exports = {
  get : function (req, res) {
    var roomMethod;
    var resourceID;
    if ((Object.keys(req.query).length + Object.keys(req.params).length) > 1) {
      res.send('Invalid parameters');
    } else if (req.query.userID) {
      resourceID = req.query.userID;
      roomMethod = room.getByUserID;
    } else if (req.query.wandooID) {
      resourceID = req.query.wandooID;
      roomMethod = room.getByWandooID;
    } else if (req.params.roomID) {
      resourceID = req.params.roomID;
      roomMethod = room.getByRoom;
    } else if (!Object.keys(req.params).length &&  !Object.keys(req.query).length) { // condition for when no params or query exist
      roomMethod = room.getAll;
    } else {
      res.send('Invalid parameters');
    }
    if (roomMethod) {
      roomMethod(resourceID, function (err, result) {
        getQueryCB(err, result, res);
      });
    }
  },

  post : function (req, res) {
    insertRoomAndConversation(req.body.wandooID, req.body.userIDs, function (err, result) {
      postQueryCB(err, result, res);
    });
    
  },

  delete : function (req, res) {
    room.delete(req.body.roomIDs, function (err, result) {
      deleteQueryCB(err, result, res);
    });
  },

  put : function (req, res) {
    room.addRoomUsers(req.params.roomID, req.body.userIDs, function(err, result) {
      putQueryCB(err, result, res);
    });
    
  },

  insertRoomAndConversation : insertRoomAndConversation
}

