var expect = require('chai').expect;
var user = require('../../server/models/user');
var wandoo = require('../../server/models/wandoo');
var room = require('../../server/models/room');
var util = require('../../server/util/util');
var testUtil = require('../testUtil');
var _ = require('underscore');

/*
Testing Strategy
1. Do unit tests for all model and controller functions
2. Use model and controller functions in testing when doing 
   integration tests
*/

// we can store all of these values in a common file or data structure

// when running the spec, why is time only listed for the 1st create test?

var userData = [
  'Pete Zurish',
  '134515aa',
  'pete.z@gmail.com',
  28,
  'M',
  'http://url-to-the-pic.png',
  'Google',
  'Software Engineer',
  37.7836675,
  -122.4091699,
  'IPyQqWYM0x'
];

var userDataDupFBID = [
  'George West',
  '134515aa',
  'G.W@gmail.com',
  29,
  'M',
  'http://url-to-a-pic.png',
  'Facebook',
  'Software Engineer',
  37.78366235,
  -122.4091249,
  'asdgasdg89'
];

var userDataDupObjectID = [
  'Sam East',
  '345sfag',
  'S.E@gmail.com',
  25,
  'M',
  'http://url-to-a-pic.png',
  'Microsoft',
  'Software Engineer',
  37.783663455,
  -122.443591249,
  'IPyQqWYM0x'
];

var userData2 = [
  'Herold Bard',
  '2345adsf',
  'hb@gmail.com',
  70,
  'M',
  'http://url-to-the-pic-2.png',
  'Apple',
  'Software Engineer',
  37.7836698,
  -122.4094349,
  'kljGLKSGj8'
];


var userReturnedValues = {
  name : 'Pete Zurish',
  facebookID  : '134515aa',
  email : 'pete.z@gmail.com',
  age : 28,
  sex : 'M',
  profile_picture : 'http://url-to-the-pic.png',
  employer : 'Google',
  job_title : 'Software Engineer',
  latitude : 37.7836675,
  longitude : -122.4091699,
  objectID : 'IPyQqWYM0x',
  institution_name : 'University of Toronto'
};

var eduData = ['University of Toronto'];

var eduData2 = ['Stanford'];

var wandooData = [
  undefined, // userID
  'I want to go out to lunch',
  util.isoDateToMySQL('2015-12-12T01:30:00.040Z'),
  util.isoDateToMySQL('2015-12-12T02:30:00.040Z'), // is this endTime necessary?
  util.isoDateToMySQL('2015-12-12T01:00:00.040Z'),
  37.7836675,
  -122.4091699,
  4
];

var roomData = [
  util.isoDateToMySQL('2015-12-12T01:30:00.040Z'),
  undefined, //wandooID
  'asdgkjadfgadfg'
];

var locationData = [24.23535, -120.23535];

before(function (done) {
  testUtil.dropDatabase(done);
});

describe('users', function () {
  
  describe('create', function () {
    afterEach(function (done) {
      testUtil.dropDatabase(done);
    });
    it('should create a new user in the database', function (done) {
      user.create(userData, eduData, function (err, result, result2) {
        if (err) {
          console.error(err);
        } else {
          var userID = result.insertId;
          user.getByUserID(userID, function (err, result) {
            if (err) {
              console.log(err);
            } else {
              expect(result[0]).to.deep.equal(_.extend(userReturnedValues, 
                {'userID' : userID}));
              done();
            }
          });
        }
      });
    // need to test invalid data types
    });

    it('should prevent users from being created with duplicate facebookIDs ' + 
      'from being created', function (done) {
      user.create(userData, eduData, function (err, result1, result2) {
        if (err) {
          console.error(err);
        } else {
          user.create(userDataDupFBID, eduData, function (err, result1, result2) {
            expect(err.message).to.contain('facebookID');
            done();
          });
        }
      });
      
    });

    it('should prevent users from being created with duplicate objectIDs ' + 
      'from being created', function (done) {
        userDataDupObjectID
      user.create(userData, eduData, function (err, result1, result2) {
        if (err) {
          console.error(err);
        } else {
          user.create(userDataDupObjectID, eduData, function (err, result1, result2) {
            expect(err.message).to.contain('objectID');
            done();
          });
        }
      });
    });


  });

  describe('getByUserID', function() {
    afterEach(function (done) {
      testUtil.dropDatabase(done);
    });
    it('getByUserID should get a user\'s data by userID', function (done) {
      user.create(userData, eduData, function (err, result1, result2) {
        if (err) {
          console.error(err);
        } else {
          var userID = result1.insertId;
          user.getByUserID(userID, function (err, result) {
            if (err) {
              console.error(err);
            } else {
              expect(result).to.be.an('array');
              expect(result.length).to.equal(1);
              expect(result[0]).to.deep.equal(_.extend(userReturnedValues, 
                {'userID' : userID}));
              done();
            }
          });
        }
      });
    });
  });

  describe('getByFBID', function () {
    afterEach(function (done) {
      testUtil.dropDatabase(done);
    });
    it('should get a user\'s data by facebookID', function (done) {
      user.create(userData, eduData, function (err, result1, result2) {
        if (err) {
          console.error(err);
        } else {
          var fbID = userReturnedValues.facebookID;
          var userID = result1.insertId;
          user.getByFBID(fbID, function (err, result) {
            if (err) {
              console.error(err);
            } else {
              expect(result).to.be.an('array');
              expect(result.length).to.equal(1);
              expect(result[0]).to.deep.equal(_.extend(userReturnedValues, 
                {'userID' : userID}));
              // what if fbID is undefined?
              // where should we check for this?
              done();

              // EDGE CASES
              // - weird characters
              // - malicious code is properly escaped
            }
          });
        }
      });
    });
  });

  describe('delete', function () {
    // insert a user
    // insert a wandoo
    // insert a room
    // delete
    // check that the user no longer exists
      // checking for wandoo and room will be handled by the integration tests
    var userIDToDelete;
    afterEach(function (done) {
      testUtil.dropDatabase(done);
    });
    before(function (done) {
      user.create(userData, eduData, function (err, result1) {
        if (err) {
          console.error(err);
        } else {
          userIDToDelete = result1.insertId;
          user.create(userData2, eduData2, function (err, result2) {
            if (err) {
              console.error(err);
            } else {
              var otherUserID = result2.insertId;
              wandooData[0] = userIDToDelete;
              wandoo.create(wandooData, function (err, result3) {
                if (err) {
                  console.error(err);
                } else {
                  var wandooID = result3.insertId;
                  room.create(roomData, [userIDToDelete, otherUserID], function (err, result4) {
                    if (err) {
                      console.error(err);
                    } else {
                      done();
                    }
                  });
                }
              });
            }
          });
        }
      });
    });

    it('should delete a user from all user tables', function (done) {

      user.delete(userIDToDelete, function (err, result1, result2, result3, result4) {
        if (err) {
          console.error(err);
        } else {
          expect(result4.affectedRows).to.equal(1);
          user.getByUserID(userIDToDelete, function (err, result) {
            if (err) {
              console.error(err);
            } else {
              expect(result.length).to.equal(0);
              done();
            }
          });
        }
      });
    });

  });

  describe('update', function () {
    var userID;
    afterEach(function (done) {
      testUtil.dropDatabase(done);
    });
    before(function (done) {
      user.create(userData, eduData, function (err, result) {
        if (err) {
          console.error(err);
        } else {
          userID = result.insertId;
          done();
        }
      });
    });
    it('should update a user\'s location', function (done) {
      user.update(locationData.concat(userID), function (err, result) {
        if (err) {
          console.error(err);
        } else {
          expect(result.affectedRows).to.equal(1);
          user.getByUserID(userID, function (err, result) {
            if (err) {
              console.error(err);
            } else {
              expect(result[0].latitude).to.equal(locationData[0]);
              expect(result[0].longitude).to.equal(locationData[1]);
              done();
            }
          });
        }
      });
    });
  });


});



