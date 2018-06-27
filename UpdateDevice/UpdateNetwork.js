let aws = require('aws-sdk');
let common = require('./Common/common');
let CustomerDao = require('./Common/Dao/CustomerDao');
let DeviceDao = require('./Common/Dao/DeviceDao');
let Model_Customer = require('./Common/Models/Model_Customer');
let Model_Device = require('./Common/Models/Model_Device');

function UpdateNetwork() { }

/////
//
// 
// 
//
/////
UpdateNetwork.prototype.UpdateDeviceIpByEmail = function(ipAddress,
                                    emailAddress,
                                    macAddress,
                                    updateTime,
                                    callback) {

    var customerDao = new CustomerDao();
    customerDao.GetCustomer(emailAddress, function(error, customerModel) {
        if (error) {
            callback("Error in GetCustomer - " + emailAddress);
        } else {

            var deviceDao = new DeviceDao();
            var totalRegisteredDevices = 0;

            deviceDao.GetDevicesByEmail(customerModel.GetEmailAddress(), function(error, deviceModels) {
                if ( error ) {
                    callback(error);
                } else {
                    var requiresUpdate = false;
                    var found = false;
                    // the source of total devices always what they have registered.
                    totalRegisteredDevices = deviceModels.length;

                    for (var i = 0; i < deviceModels.length; i++) {
                        if ( !found && deviceModels[i].GetMACAddress() === macAddress) {
                            found = true;

                            if ( deviceModels[i].GetIpAddress() !== ipAddress ) {
                                requiresUpdate = true;
                            }
                            break;
                        }
                    }

                    if ( found ) {
                        if ( requiresUpdate ) {
                            // found the device and IP is different, great - just go update it.
                            deviceDao.UpdateDevice(emailAddress, macAddress, ipAddress, updateTime, function(error) {
                                if ( error ) {
                                    callback("Error in UpdateDeviceIpByEmail - " + macAddress + "/" + ipAddress);
                                } else {
                                    callback();
                                }
                            });
                        }
                    } else {
                        // if not found, -- if reach max, skip it. -if not max, increment, and update.
                        if (totalRegisteredDevices === customerModel.GetMaximumDevices()) {
                            // reached maximum devices
                            callback("Maximum device reached for account - " + customerModel.GetEmailAddress() + " / " + macAddress)
                        } else {
                            // increment the number of devices on a account. then do the upsert.
                            deviceDao.UpdateDevice(emailAddress, macAddress, ipAddress, updateTime, function(error) {
                                if ( error ) {
                                    callback("Error in UpdateDeviceIpByEmail - " + macAddress + "/" + ipAddress);
                                } else {
                                    totalRegisteredDevices++;

                                    if (totalRegisteredDevices===1) {
                                        common.sendEmailToCustomer(customerModel.GetEmailAddress(), 
                                                process.env.WELCOME_SUBJECT, 
                                                process.env.WELCOME_BODY + macAddress);

                                    } else {
                                        common.sendEmailToCustomer(customerModel.GetEmailAddress(), 
                                                process.env.NEWDEVICE_SUBJECT, 
                                                process.env.NEWDEVICE_BODY + macAddress);
                                    }

                                    customerDao.UpdateDeviceCount(customerModel.GetEmailAddress(), totalRegisteredDevices, function(error) {
                                        if ( error ) {
                                            callback(error);
                                        } else {
                                            callback();
                                        }
                                    });
                                }
                            });
                        }
                    }
                }
            });
        }
    });
}

// TODO requires depreciation...
UpdateNetwork.prototype.UpdateDeviceIpByMacAddress = function(ipAddress, 
                                            macAddress,
                                            updateTime,
                                            callback) {

    var deviceDao = new DeviceDao();

    deviceDao.GetDeviceByMACAddress(macAddress, function(error, device) {
        if ( error ) {
            callback("Error in UpdateDeviceIpByMac - " + macAddress);
        } else {
            if ( device.GetIpAddress() !== ipAddress ) {
                deviceDao.UpdateDevice(device.GetEmailAddress(), device.GetMACAddress(), ipAddress, updateTime, function(error) {
                    if ( error ) {
                        callback("Error in UpdateDeviceIpByMac - " + macAddress + "/" + ipAddress);
                    } else {
                        callback();
                    }
                });
            }
        }
    });
}

module.exports = UpdateNetwork;
