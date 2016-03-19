var expect = require('chai').expect;
var user = require('../../server/models/user');
var _ = require('underscore');

// we can store all of these values in a common file or data structure

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


describe('post', function () {
  it('should create a new user in the database', function (done) {
    user.post(userData, eduData, function (err, results1, results2) {
      if (err) {
        console.error(err);
      } else {
        var userID = results1.insertId;
        user.getByUserID(userID, function (err, result) {
          if (err) {
            console.error(err);
          } else {
            expect(result[0]).to.deep.equal(_.extend(userReturnedValues, 
              {'userID' : userID}));
            done();
          }
        });
      }
    });
  })
});

xdescribe('getByFBID', function () {
  it('should return the correct result', function (done) {
    var testFBID = 5494877;
    user.getByFBID(testFBID, function (err, result) {
      if (err) {
        console.error(err);
      } else {

        // need to add an expect here
      }
      done();
    });
  });

  // should return an array with 1 element, which is the user 
  // with the provided facebooKID

  // should return all of the required attributes for a user

  // EDGE CASES
  // - weird characters
  // - malicious code is properly escaped
});


// Testing Strategy
// 1. Do unit tests for all model and controller functions
// 2. Use model and controller functions in testing when doing 
//    integration tests
