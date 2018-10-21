function Model_Device() {
    this.DeviceName = '';
    this.EmailAddress = '';
    this.IpAddress = '';
    this.MACAddress = '';
    this.Model = '';
    this.Type = '';
}

Model_Device.prototype.Populate = function (data) {
    this.DeviceName = data.DeviceName;
    this.EmailAddress = data.EmailAddress;
    this.IpAddress = data.IpAddress;
    this.LastUpdate = data.LastUpdate;
    this.MACAddress = data.MACAddress;
    this.Model = data.Model;
    this.Type = data.Type;
};

Model_Device.prototype.GetDeviceName = function() {   
    return this.DeviceName;
};

Model_Device.prototype.GetEmailAddress = function() {   
    return this.EmailAddress;
};

Model_Device.prototype.GetIpAddress = function() {   
    return this.IpAddress;
};

Model_Device.prototype.GetMACAddress = function() {   
    return this.MACAddress;
};

Model_Device.prototype.GetModel = function() {
    return this.Model;
};

Model_Device.prototype.GetType = function() {   
    return this.Type;
};

module.exports = Model_Device;
