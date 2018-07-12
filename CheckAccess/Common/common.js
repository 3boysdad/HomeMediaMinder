let aws = require('aws-sdk');
let nodemailer = require('nodemailer');

module.exports = {

    getErrorResponse : function() {
      var response = {
        statusCode: 500,
        headers: {
          "Access-Control-Allow-Origin" : "*",
          "Access-Control-Allow-Credentials" : true
          },
          body: JSON.stringify({
          message: "Internal error"
        }),
      };
    
      return response;
    },

    getSuccessResponse : function() {
        var response = {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : true
            },
            body: JSON.stringify({
            message: "Success"
          }),
        };
      
        return response;
      },

    getResponse: function (statusCode, message) {
        var response = {
          statusCode: statusCode,
          headers: {
            "Access-Control-Allow-Origin" : "*",
            "Access-Control-Allow-Credentials" : true
            },
            body: JSON.stringify({
            message: message
          }),
        };
      
        return response;
      },

    sendEmailToCustomer : function (emailTo, subject, message, callback) {
        let transporter = nodemailer.createTransport({
          SES : new aws.SES({
            apiVersion: '2010-12-01'
          })
        });
      
        transporter.sendMail({
          from: process.env.FROM_EMAIL,
          to: emailTo,
          subject: subject,
          html: message }, callback);
      },

    sendEmail: function (emailTo, emailFrom, subject, message, callback) {
        let transporter = nodemailer.createTransport({
          SES : new aws.SES({
            apiVersion: '2010-12-01'
          })
        });
      
        transporter.sendMail({
          from: emailFrom,
          to: emailTo,
          subject: subject,
          html: message }, callback);
      }
};
