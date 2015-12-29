var _ = require('underscore');
var wandoo = require('../models/wandoo');
var interested = require('../models/interested');
var room = require('../models/room');

var expiredWandoos = function (data) {
  return Date.parse(data.start_time) < Date.parse(new Date());
}

var expiredRooms = function(data) {
  return Date.parse(data.expiry) <= Date.parse(new Date());
}

var processWandooData = function (data) {
  var expiredEntries = data.filter(expiredWandoos);
  
  // console.log('Expired entries:', expiredEntries);
  // console.log('Expired entries count:', expiredEntries.length);

  _.each(expiredEntries, function (entry) {
    if (entry.status === 'E') {
      entry.delete = true;
    } else if (entry.status === 'A' && entry.room) {
      // check if there exists a room with a corresponding wandooID
      entry.passive = true;
    } else if (entry.status === 'A' && !entry.room) {
      entry.delete = true;
    }
  });

  var toPassive = _.pluck(_.filter(expiredEntries, function (entry) {
    return ('passive' in entry);
  }),'wandooID');
  var toDelete = _.pluck(_.filter(expiredEntries, function (entry) {
    return ('delete' in entry);
  }), 'wandooID');
  console.log('Wandoos updated to status P:', toPassive);
  console.log('Total wandoos updated to status P:', toPassive.length);
  console.log('Wandoos deleted:', toDelete);
  console.log('Total wandoos deleted:', toDelete.length)

  // console.log('passive', toPassive);
  // console.log('delete', toDelete);

  wandoo.updateToPassive(toPassive, function (err, result1) {
    if (err) {
      console.log(err);
    } else {
      wandoo.delete(toDelete, function (err, result2) {
        if (err) {
          console.log(err);
        } else {
          console.log('Wandoos updated and deleted successfully');
        }
      });
    }
  });
}

var processRoomData = function (data, cb) {
  // filter for rooms which are expired
  var expiredEntries = data.filter(expiredRooms);
  // get the wandooID for each of the rooms that are expired
  var toExpire = _.pluck(data,'wandooID');
  // update the status for all wandooIDs to be 'E'
  console.log('Expired wandoos:',toExpire);
  console.log('Expired wandoos count:', toExpire.length);

  wandoo.updateToExpired(toExpire, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log('Wandoos expired successfully')
      cb();
    }
  });
  
}

var job1 = function () {
  wandoo.getForDW(function (err, result) {
    if (err) {
      console.log('DB entries not retrieved');
      console.log(err);
    } else { 
      processWandooData(result);
    }
  });
}

var job2 = function (cb) {
  // get all rooms
  room.getAll([], function (err, result) {
    if (err) {
      console.log('DB entries not retrieved');
      console.log(err);
    } else {
      processRoomData(result, cb);
    }
  });  
}

job2(job1);
// job2(function() {console.log('complete')});

// module.exports  = {

// }

