function Model_Device(data) {

    this.Model = {
        "DeviceName" : data.DeviceName,
        "EmailAddress": data.EmailAddress,
        "IpAddress" : data.IpAddress,
        "LastUpdate" : data.LastUpdate,
        "MACAddress": data.MACAddress,
        "Model" : data.Model,
        "Type" : data.Type
    };
}

Model_Device.prototype.GetDeviceName = function() {   
    return this.Model["DeviceName"];
}

Model_Device.prototype.GetEmailAddress = function() {   
    return this.Model["EmailAddress"];
}

Model_Device.prototype.GetIpAddress = function() {   
    return this.Model["IpAddress"];
}

Model_Device.prototype.GetMACAddress = function() {   
    return this.Model["MACAddress"];
}

Model_Device.prototype.GetLastUpdate = function() {   
    return this.Model["LastUpdate"];
}

Model_Device.prototype.GetModel = function() {   
    return this.Model["Model"];
}

Model_Device.prototype.GetType = function() {   
    return this.Model["Type"];
}

module.exports = Model_Device;
