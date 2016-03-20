var Promise = require('bluebird');
var db = require('../server/db/db');
var dbUtils = Promise.promisifyAll(require('../server/db/dbUtils'));


module.exports = {
  dropDatabase : function (callback) {
    var qs1 = 'delete from wandoo_interest';
    var qs2 = 'delete from room_user';
    var qs3 = 'delete from room';
    var qs4 = 'delete from wandoo';
    var qs5 = 'delete from user_education';
    var qs6 = 'delete from user';

    dbUtils.queryBuilderAsync(qs1, null)
      .then(function (result) {
        return dbUtils.queryBuilderAsync(qs2, null);
      })
      .then(function (result) {
        return dbUtils.queryBuilderAsync(qs3, null);
      })
      .then(function (result) {
        return dbUtils.queryBuilderAsync(qs4, null);
      })
      .then(function (result) {
        return dbUtils.queryBuilderAsync(qs5, null);
      })
      .then(function (result) {
        return dbUtils.queryBuilderAsync(qs6, null);
      })
      .then(function (result) {
        callback(null);
      })
      .catch(function (err) {
        callback(err);
      });
  }
};







