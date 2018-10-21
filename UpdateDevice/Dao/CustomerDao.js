let aws = require('aws-sdk');
let Model_Customer = require('../Models/Model_Customer');

function CustomerDao() {
    this.TableName = process.env.CUSTOMER;
}

// callback should be in the form of func(error, data)
CustomerDao.prototype.GetCustomer = async function(emailAddress) {
    try {
        let dynamodb = new aws.DynamoDB.DocumentClient();
        let param = this.FindByEmailAddressParam(emailAddress);

        let result = await dynamodb.query(param).promise();

        if ( result.Count !== 1) {
            throw('Found more none or more than one customer');
        }

        return new Model_Customer(result.Items[0]);

    } catch(error) {
        console.log('CustomerDao.GetCustomer - Email: ' + emailAddress + ' / Error: ' + error);
        throw('Error');
    }
};

CustomerDao.prototype.UpdateDeviceCount = async function(emailaddress, newCount) {
    try {
        let dynamodb = new aws.DynamoDB.DocumentClient();
        let param = this.UpdateCustomerDeviceCntParm(emailaddress, newCount);

        await dynamodb.update(param);

    } catch(error) {
        console.log('CustomerDao.UpdateDeviceCount - Email: ' + emailAddress + ' / NewCount: ' + newCount + ' / Error: ' + error);
        throw('Error');
    }
};

CustomerDao.prototype.FindByEmailAddressParam = function(emailAddress) {
    return {
        TableName : this.TableName,
        KeyConditionExpression: "#email = :addr",
        ExpressionAttributeNames:{
            "#email": "EmailAddress"
        },
        ExpressionAttributeValues: {
            ":addr":emailAddress
        }
      };  
};

CustomerDao.prototype.UpdateCustomerDeviceCntParm = function(emailAddress, deviceCount) {
    return {
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
};

module.exports = CustomerDao;
