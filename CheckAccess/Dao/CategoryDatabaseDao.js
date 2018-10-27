let aws = require('aws-sdk');

function CategoryDatabaseDao() {
    this.UrlCategoryTable = process.env.CATEGORY_TABLE;
    this.CategoryListTable = process.env.CATEGORYLIST_TABLE;
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
* This method hasn't been tested like this -
* is has been known to work.  There remains
* a few other items which should be completed
* - don't do an insert of a MasterCategoryKey w/o checking to see
*   if it already exists.
* - some checking for delta's which would affect the outcome of
*   user's stored category information.
*
* */

CategoryDatabaseDao.prototype.SaveCategoryItems = async function(categoryListItems) {
    let dynamodb = new aws.DynamoDB.DocumentClient();

    for(const [key, value] of Object.entries(categoryListItems)) {
        let masterCategoryKey = key;
        let subCategories = value;

        for(const [key, value] of Object.entries(subCategories)) {
            let categoryListItem = new Model_CategoryList();
            categoryListItem.MasterCategoryKey = masterCategoryKey;
            categoryListItem.Description = value;
            categoryListItem.CategoryKey = key;

            try {
                let param = this.GetPutCategoryListParam(categoryListItem);
                await dynamodb.put(param).promise();

            } catch(error) {
                console.log('CategoryDatabaseDao.SaveCategoryItems - CategoryKey: ' + masterCategoryKey + ' / Error: ' + error);
                throw('Error');
            }
        }
    }
};


/*
* Param functions.
*
* */
CategoryDatabaseDao.prototype.GetFindDomainParam = function(domain) {
    let params = {
        TableName : this.UrlCategoryTable,
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
    let param = {
        TableName: this.UrlCategoryTable,
        Item : siteData
    };

    return param;
};

CategoryDatabaseDao.prototype.GetPutCategoryListParam = function(categoryListItem) {
    let param = {
        TableName: this.CategoryListTable,
        Item : categoryListItem
    };

    return param;
};

module.exports = CategoryDatabaseDao;
