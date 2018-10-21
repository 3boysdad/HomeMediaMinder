let common = require('./Common/common');
let CustomerDao = require('./Dao/CustomerDao');
let DeviceDao = require('./Dao/DeviceDao');

function UpdateNetwork() {

}

UpdateNetwork.prototype.UpdateDeviceIpByEmail = async function(ipAddress,
                                    emailAddress,
                                    macAddress,
                                    updateTime) {

    try {
        let customerDao = new CustomerDao();
        let deviceDao = new DeviceDao();

        let customerModel = await customerDao.GetCustomer(emailAddress);

        let deviceModels = await deviceDao.GetDevicesByEmail(customerModel.GetEmailAddress());

        // the source of total devices always what they have registered.
        let totalRegisteredDevices = deviceModels.length;

        for (let i = 0; i < deviceModels.length; i++) {
            if (deviceModels[i].GetMACAddress() === macAddress) {

                if (deviceModels[i].GetIpAddress() !== ipAddress) {
                    await deviceDao.UpdateDevice(emailAddress, macAddress, ipAddress, updateTime);
                }
                return;
            }
        }

        // this will only fire if the device can't be found.
        if (totalRegisteredDevices === customerModel.GetMaximumDevices()) {
            throw("Maximum device reached for account - " + customerModel.GetEmailAddress() + " / " + macAddress);
        }

        await deviceDao.UpdateDevice(emailAddress, macAddress, ipAddress, updateTime);

        totalRegisteredDevices++;
        if (totalRegisteredDevices === 1) {
            common.sendEmailToCustomer(customerModel.GetEmailAddress(),
                process.env.WELCOME_SUBJECT,
                process.env.WELCOME_BODY + macAddress);

        } else {
            common.sendEmailToCustomer(customerModel.GetEmailAddress(),
                process.env.NEWDEVICE_SUBJECT,
                process.env.NEWDEVICE_BODY + macAddress);
        }

        await customerDao.UpdateDeviceCount(customerModel.GetEmailAddress(), totalRegisteredDevices);

    } catch(error) {
        console.log('UpdateNetwork.UpdateDeviceIpByEmail - ipAddress: ' + ipAddress
            + ' / emailAddress: ' + emailAddress
            + ' / macAddress: ' + macAddress
            + ' / updateTime: ' + updateTime
            + ' / Error: ' + error);
        throw('Error');
    }
};

module.exports = UpdateNetwork;
