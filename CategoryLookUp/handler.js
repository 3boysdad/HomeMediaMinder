'use strict';
let aws = require('aws-sdk');
let common = require('./Common/common');
let CategoryDao = require('./Common/Dao/CategoryDao');
let WebShrinkDao = require('./Common/Dao/WebShrinkDao');

module.exports.GetCategories = (event, context, callback) => {

  if ( event.httpMethod !== 'GET') {
    callback(null, common.getErrorResponse());
  }

  if (!event.queryStringParameters 
      || !event.queryStringParameters.checkAddress 
      || event.queryStringParameters.checkAddress===undefined) {
    callback(null, common.getErrorResponse());
  }

  var categoryDao = new CategoryDao();

  categoryDao.GetCategories(event.queryStringParameters.checkAddress)
    .then(data => { 
       callback(null, common.getResponse(200, data));
    })
    .catch(error => {
      // this is a probably a non-ciritical error.
      // and simply means that there's no records
      // for the given domain.
      console.log(error);

      var webShrinkDao = new WebShrinkDao(event.queryStringParameters.checkAddress);

      webShrinkDao.GetCategories()
        .then(data => {
          console.log(data);
          categoryDao.SaveDomain(data)
            .then( results => {
              callback(null, common.getResponse(200, data));
            })
            .catch(error => {
              console.log(error);
              // awaiting the eventual finally method to appear...
              // don't prevent the data from coming back to the caller!
              callback(null, common.getResponse(200, data));
            })
        })
        .catch(error => {
          // TODO this could a potentially fatal error imparing the functionality of the solution!
          console.log(error)
          callback(null, common.getErrorResponse());
        });
    });
};