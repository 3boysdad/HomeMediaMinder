let aws = require('aws-sdk');
let Model_Customer = require('../Models/Model_Customer');

function CustomerDao() {
    this.TableName = process.env.CUSTOMER;
    this.dynamodb = new aws.DynamoDB.DocumentClient(); 
}

// callback should be in the form of func(error, data)
CustomerDao.prototype.GetCustomer = function(emailAddress, callback) {
    var param = this.FindByEmailAddressParam(emailAddress);

    this.dynamodb.query(param, (error, data) => { 
        if ( error ) {
            console.log(error);
            callback("Error occurred finding the customer");
        } else {
            if ( data.Count !== 1 ) {
                var errorMessage = "Found more than one account, aborting - " + emailAddress;
                console.log(errorMessage);
                callback(errorMessage);
            } else {
                var customerModel = new Model_Customer(data.Items[0]);
                callback(null, customerModel);
            }
        }
    });
}

CustomerDao.prototype.UpdateDeviceCount = function(emailaddress, newCount, callback) {
    var parm = this.UpdateCustomerDeviceCntParm(emailaddress, newCount);

    this.dynamodb.update(parm, function(error, data){
        if(error) {
            console.log(error);
            callback("Error in UpdateDeviceCount");
        } else {
            callback(null);
       }
    });
}

CustomerDao.prototype.FindByEmailAddressParam = function(emailAddress) {
    var params = {
        TableName : this.TableName,
        KeyConditionExpression: "#email = :addr",
        ExpressionAttributeNames:{
            "#email": "EmailAddress"
        },
        ExpressionAttributeValues: {
            ":addr":emailAddress
        }
      };  

    return params;
}

CustomerDao.prototype.UpdateCustomerDeviceCntParm = function(emailAddress, deviceCount) {
    var params = {
        ExpressionAttributeNames: {
            "#currDeviceCount": "CurrentDevices"
        }, 
        ExpressionAttributeValues: {
            ":currentDeviceCount": deviceCount
        }, 
        Key: {
            "EmailAddress": emailAddress
        }, 
        ReturnValues: "UPDATED_NEW", 
        TableName: this.TableName,
        UpdateExpression: "SET #currDeviceCount = :currentDeviceCount"
    };

    return params;
}

module.exports = CustomerDao;
