'use strict';
let aws = require('aws-sdk');
let Model_Category = require('../../Models/Model_Category');
let Model_SiteData = require('../../Models/Model_SiteData');

function CategoryDao() {
    this.TableName = process.env.CATEGORY_TABLE;
}

CategoryDao.prototype.GetCategories = async function(domain) {

    var params = this.GetFindDomainParam(domain);
    var dynamodb = new aws.DynamoDB.DocumentClient();

    return new Promise(function(resolve, reject) {
        dynamodb.query(params, function(error, data) { 
            if ( error ) {
                reject(error);
            } else {
                if ( data.Count !== 1 ) {
                    var errorMessage = "Unable to find or had too many records - " + domain;
                    reject(errorMessage);
                } else {
                    resolve(data.Items[0]);
                }
            }
        });
    });
}

CategoryDao.prototype.GetFindDomainParam = function(domain) {
    var params = {
        TableName : this.TableName,
        KeyConditionExpression: "#domain = :url",
        ExpressionAttributeNames:{
            "#domain": process.env.CATEGORY_TABLE_KEY
        },
        ExpressionAttributeValues: {
            ":url":domain
        }
      };  

    return params;
}

CategoryDao.prototype.GetPutParam = function(siteData) {
    var param = {
        TableName: this.TableName,
        Item : siteData
    }
    
    return param;
}

CategoryDao.prototype.SaveDomain = async function(siteData) {
    var params = this.GetPutParam(siteData);
    var dynamodb = new aws.DynamoDB.DocumentClient();

    return new Promise(function(resolve, reject) {
        dynamodb.put(params, function(error, data) {
            if(error) {
                reject(error);
            } else {
                resolve('OK');
            }
        });
    });
}

module.exports = CategoryDao;

