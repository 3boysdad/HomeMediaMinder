'use strict';

let aws = require('aws-sdk');
let common = require('./Common/common');
let UpdateNetwork = require('./UpdateNetwork');

////////
//
//  responsible for updating the IP device for a given user
//  bearing the MAC address in the event's querystring
//
///////
module.exports.Update = (event, context, callback) => {

  // query string parameters.
  var macAddress = event.queryStringParameters.macaddress;
  var emailAddress = event.queryStringParameters.emailaddress;

  // the request context should hold these pieces for us.
  var ipAddress = event.requestContext.identity.sourceIp;
  var updateTime = event.requestContext.requestTimeEpoch;

  var updateNetwork = new UpdateNetwork();

  if (macAddress) {
    macAddress = macAddress.toUpperCase();
  }

  if ( !emailAddress ) {
    emailAddress = emailAddress.toLowerCase();
    
    updateNetwork.UpdateDeviceIpByMacAddress(ipAddress, macAddress, updateTime, function(error) {
      if ( error ) {
        console.log(error);
        callback(null, common.getErrorResponse())
      } else {
        callback(null, common.getSuccessResponse())
      }
    });
  } else {
    updateNetwork.UpdateDeviceIpByEmail(ipAddress, emailAddress, macAddress, updateTime, function(error) {
      if ( error ) {
        console.log(error);
        callback(null, common.getErrorResponse())
      } else {
        callback(null, common.getSuccessResponse())
      }
    });
  }
};
