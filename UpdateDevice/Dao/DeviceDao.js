let aws = require('aws-sdk');
let Model_Device = require('../Models/Model_Device');

function DeviceDao() {
    this.TableName = process.env.CUSTOMER_DEVICE;
}

DeviceDao.prototype.GetDeviceByMACAddress = async function(macAddress) {
    try {
        let dynamodb = new aws.DynamoDB.DocumentClient();
        let param = this.FindDeviceByMACAddressParam(macAddress);

        let result = await dynamodb.query(param).promise();

        let model_Device = new Model_Device();

        if ( result.Count!==0 ) {
            model_Device.Populate(result.Items[0]);
        }

        return model_Device;

    } catch(error) {
        console.log('DeviceDao.GetDeviceByMACAddress - MACAddress: ' + macAddress + ' / Error: ' + error);
        throw('Error');
    }
};

// callback should be in the form of func(error, data)
DeviceDao.prototype.GetDevicesByEmail = async function(emailAddress) {
    try {
        let dynamodb = new aws.DynamoDB.DocumentClient();
        let param = this.FindByEmailAddressParam(emailAddress);

        let result = await dynamodb.query(param).promise();

        let devices = [];

        if ( result.Count === 0 ) {
            // this is not necessarily and error here!
            console.log('DeviceDao.GetDevicesByEmail - EmailAddress: ' + emailAddress + ' / Message: Did not find any devices');
            return devices;
        }

        for(let i = 0; i < data.Count; i++) {
            let device = new Model_Device(data.Items[i]);
            devices.push(device);
        }

        return devices;

    } catch(error) {
        console.log('DeviceDao.GetDevicesByEmail - EmailAddress: ' + emailAddress + ' / Error: ' + error);
        throw('Error');
    }
};

DeviceDao.prototype.UpdateDevice = async function(emailAddress, macAddress, ipAddress, timeStamp) {
    try {
        let dynamodb = new aws.DynamoDB.DocumentClient();
        let findParam = this.FindDeviceByMACAddressParam(macAddress);
        let findResult = await dynamodb.query(findParam).promise();

        if (findResult.Count===0) {
            let putParam = this.GetPutParam(macAddress, emailAddress, ipAddress, timeStamp);
            await dynamodb.put(putParam).promise();
        } else {
            let updateParam =  this.GetUpdateParam(macAddress, ipAddress, timeStamp);
            await dynamodb.update(updateParam).promise();
        }
    } catch(error) {
        console.log('DeviceDao.UpdateDevice - EmailAddress: ' + emailAddress
                + ' / macAddress: ' + macAddress
                + ' / ipAddress: ' + ipAddress
                + ' / Error: ' + error);
        throw('Error');
    }
};

/*
* Parameter methods.
* */
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
