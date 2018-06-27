let aws = require('aws-sdk');
let Model_Device = require('../Models/Model_Device');

function DeviceDao() {
    this.TableName = process.env.CUSTOMER_DEVICE;
}

DeviceDao.prototype.GetDeviceByMACAddress = function(macAddress, callback) {
    var param = this.FindDeviceByMACAddressParam(macAddress);
    var dynamodb = new aws.DynamoDB.DocumentClient();

    dynamodb.query(param, function(error, data) { 
        if ( error ) {
            console.log(error);
            callback("Error in GetDeviceByMACAddress - " + macAddress);
        } else {
            if ( data.Count === 0 ) {
                // this has to be an error as we have no other info about this request.
                var errorMessage = "GetDeviceByMACAddress not found - " + macAddress;
                console.log(errorMessage);
                callback(errorMessage);
            } else {
                var model = new Model_Device(data.Items[0]);
                callback(null, model);
            }
        }
    });
}

// callback should be in the form of func(error, data)
DeviceDao.prototype.GetDevicesByEmail = function(emailAddress, callback) {
    var param = this.FindByEmailAddressParam(emailAddress);
    var dynamodb = new aws.DynamoDB.DocumentClient();

    dynamodb.query(param, function(error, data) { 
        if ( error ) {
            console.log(error);
            callback("Error in GetDevicesByEmail - " + emailAddress);
        } else {
            var devices = [];

            if ( data.Count === 0 ) {
                // this is not necessarily and error here!
                console.log("Did not find any GetDevicesByEmail - " + emailAddress);
                callback(null, devices);
            } else {
                for(var i = 0; i < data.Count; i++) {
                    var device = new Model_Device(data.Items[i]);
                    devices.push(device);
                }

                callback(null, devices);
            }
        }
    });
}

DeviceDao.prototype.UpdateDevice = function(emailAddress, macAddress, ipAddress, timeStamp, callback) {
    var findParam = this.FindDeviceByMACAddressParam(macAddress);
    var dynamodb = new aws.DynamoDB.DocumentClient();

    var putParam = this.GetPutParam(macAddress, emailAddress, ipAddress, timeStamp);
    var updateParam =  this.GetUpdateParam(macAddress, ipAddress, timeStamp);

    dynamodb.query(findParam, function(error, data) {
        if ( error ) {
            console.log(error);
            callback("Error in UpdateDevice - " + macAddress);
        } else {
            if ( data.Count===0 ) {
                // going to do a PUT
                dynamodb.put(putParam, function(error, data) {
                    if(error) {
                        console.log(error);
                        callback("Error in UpdateDevice - PUT");
                    } else {
                        callback();
                    }
                });
            } else {
                // going to do an UPDATE
                dynamodb.update(updateParam, function(error, data) {
                    if(error) {
                        console.log(error);
                        callback("Error in UpdateDevice - UPDATE");
                    } else {
                        callback();
                   }
                });
            }
        }
    });
}

DeviceDao.prototype.GetPutParam = function(macAddress, emailAddress, ipAddress, timeStamp) {
    var item = {
        EmailAddress : emailAddress,
        MACAddress : macAddress,
        IpAddress: ipAddress,
        LastUpdate: timeStamp,
        DeviceName: "unknown",
        Model: "unknown",
        Type: "new"
    }
      
    var param = {
        TableName: this.TableName,
        Item : item
    }
    
    return param;
}

DeviceDao.prototype.GetUpdateParam = function(macAddress, ipAddress, timeStamp) {

    var param = {
        ExpressionAttributeNames: {
            "#ipAddr": "IpAddress", 
            "#update": "LastUpdate"
        }, 
        ExpressionAttributeValues: {
            ":addr": ipAddress, 
            ":time": timeStamp
        }, 
        Key: {
            "MACAddress": macAddress
        }, 
        ReturnValues: "UPDATED_NEW", 
        TableName: this.TableName,
        UpdateExpression: "SET #ipAddr = :addr, #update = :time"
    };

    return param;
}

DeviceDao.prototype.FindDeviceByMACAddressParam = function(macAddress) {
    var param = {
        TableName : this.TableName,
        KeyConditionExpression: "#macAddress = :addr",
        ExpressionAttributeNames:{
            "#macAddress": "MACAddress"
        },
        ExpressionAttributeValues: {
            ":addr":macAddress
        }
      };  

    return param;
}

DeviceDao.prototype.FindByEmailAddressParam = function(emailAddress) {
    var param = {
        TableName : this.TableName,
        IndexName : 'idxEmailAddress',
        KeyConditionExpression: "#email = :addr",
        ExpressionAttributeNames:{
            "#email": "EmailAddress"
        },
        ExpressionAttributeValues: {
            ":addr":emailAddress
        }
      };  

    return param;
}

module.exports = DeviceDao;
