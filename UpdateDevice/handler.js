'use strict';
let aws = require('aws-sdk');
let Regex = require('regex');
let common = require('./Common/common');
let UpdateNetwork = require('./UpdateNetwork');

////////
//
//  responsible for updating the IP device for a given user
//  bearing the MAC address in the event's querystring
//
///////
module.exports.Update = async (event, context) => {
    try {
        // query string parameters.
        let macAddress = event.queryStringParameters.macaddress;
        let emailAddress = event.queryStringParameters.emailaddress;

        // the request context should hold these pieces for us.
        let ipAddress = event.requestContext.identity.sourceIp;
        let updateTime = event.requestContext.requestTimeEpoch;

        let macRegEx = new Regex('^[0-9a-f]{1,2}([\\.:-])(?:[0-9a-f]{1,2}\\1){4}[0-9a-f]{1,2}$');

        if ( !macAddress || !macRegEx(macAddress) || !emailAddress ) {
            throw('Invalid MAC or email address');
        }

        macAddress = macAddress.toUpperCase();
        emailAddress = emailAddress.toLowerCase();
        let updateNetwork = new UpdateNetwork();

        await updateNetwork.UpdateDeviceIpByEmail(ipAddress, emailAddress, macAddress, updateTime);

        return common.getSuccessResponse();

    } catch(error) {
        console.log('UpdateDevices.Update - Error: ' + error);
        return common.getErrorResponse();
    }
};
