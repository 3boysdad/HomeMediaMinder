'use strict';
let common = require('./Common/common');
let DomainCategoryDao = require('./Dao/DomainCategoryDao');

module.exports.CategoryLookUp = async (event, context) => {

    if (!event.queryStringParameters
        || !event.queryStringParameters.checkAddress
        || event.queryStringParameters.checkAddress === undefined) {
        return common.getErrorResponse();
    }

    let domainCategoryDao = new DomainCategoryDao();

    try {
        let categories = await domainCategoryDao.GetCategories(event.queryStringParameters.checkAddress);
        return common.getResponse(200, categories);

    } catch(error) {
        return common.getErrorResponse();
    }
};

module.exports.CheckAccess = (event, context, callback) => {
    if (event.httpMethod !== 'GET') {
        callback(null, common.getErrorResponse());
    }

    if (!event.queryStringParameters
        || !event.queryStringParameters.ipAddress
        || event.queryStringParameters.ipAddress === undefined
        || !event.queryStringParameters.domain
        || event.queryStringParameters.domain === undefined) {
        callback(null, common.getErrorResponse());
    }

    /*
    * ipAddress - the IP address of the user-agent making the DNS request.
    * domain - the domain being required by the user-agent.
    * */

    let ipAddress = event.queryStringParameters.ipAddress;
    let domain = event.queryStringParameters.domain;

    let domainCategoryDao = new DomainCategoryDao();

    var getCategories = domainCategoryDao.GetCategories(domain);
    // TODO need to gather what to block from the Customer

    Promise.all([getCategories])
        .then(values => {

            /**
             * Values is an array of responses from the promises.
             * Value[0] => Model_SiteData object.
             * **/

            console.log(values[0]);

            callback(null, common.getSuccessResponse());
        })
        .catch(error => {
            callback(null, common.getErrorResponse());
        });
};

