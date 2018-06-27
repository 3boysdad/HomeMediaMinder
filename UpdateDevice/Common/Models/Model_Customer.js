function Model_Customer(data) {

    this.Model = {
        "EmailAddress": data.EmailAddress,
        "Name": data.Name,
        "CurrentDevices" : data.CurrentDevices,
        "MaximumDevices" : data.MaximumDevices,
        "Plan" : data.Plan
    };
}

Model_Customer.prototype.GetEmailAddress =function() {   
    return this.Model["EmailAddress"];
}

Model_Customer.prototype.GetName =function() {   
    return this.Model["Name"];
}

Model_Customer.prototype.GetCurrentDevices =function() {   
    return this.Model["CurrentDevices"];
}

Model_Customer.prototype.GetMaximumDevices =function() {   
    return this.Model["MaximumDevices"];
}

Model_Customer.prototype.GetPlan=function() {   
    return this.Model["Plan"];
}

module.exports = Model_Customer;
