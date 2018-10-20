let aws = require('aws-sdk');

function CategoryDatabaseDao() {
    this.TableName = process.env.CATEGORY_TABLE;
}

/**
 * Database methods
 *
 * **/
CategoryDatabaseDao.prototype.GetCategories = async function(domain) {
    let params = this.GetFindDomainParam(domain);
    let dynamodb = new aws.DynamoDB.DocumentClient();

    try {
        let data = await dynamodb.query(params).promise();

        if ( data.Items.length!==1) {
            throw('None or too many results in the database');
        }

        return data.Items[0];

    } catch(error) {
        console.log('CategoryDatabaseDao.GetCategories - Domain: ' + domain + ' / Error: ' + error);
        throw('Error');
    }
};

CategoryDatabaseDao.prototype.SaveCategories =  async function(siteData) {
    let params = this.GetPutParam(siteData);
    let dynamodb = new aws.DynamoDB.DocumentClient();

    try {
        let result = await dynamodb.put(params).promise();
        return result;

    } catch(error) {
        console.log('CategoryDatabaseDao.SaveDomain - Error: ' + error);
        throw('Error');
    }
};

/*
* Param functions.
*
* */
CategoryDatabaseDao.prototype.GetFindDomainParam = function(domain) {
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
};

CategoryDatabaseDao.prototype.GetPutParam = function(siteData) {
    var param = {
        TableName: this.TableName,
        Item : siteData
    }

    return param;
};

module.exports = CategoryDatabaseDao;
