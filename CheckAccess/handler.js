'use strict';
let common = require('./Common/common');
let DomainCategoryDao = require('./Dao/DomainCategoryDao');

module.exports.CategoryLookUp = async (event, context) => {

    try {

        if (!event.queryStringParameters
            || !event.queryStringParameters.checkAddress
            || event.queryStringParameters.checkAddress === undefined) {
            throw('Invalid parameters');
        }

        let domainCategoryDao = new DomainCategoryDao();

        let categories = await domainCategoryDao.GetCategories(event.queryStringParameters.checkAddress);
        return common.getResponse(200, categories);

    } catch(error) {
        return common.getErrorResponse();
    }
};

module.exports.CheckAccess = async (event, context) => {
    try {
        if (!event.queryStringParameters
            || !event.queryStringParameters.ipAddress
            || event.queryStringParameters.ipAddress === undefined
            || !event.queryStringParameters.domain
            || event.queryStringParameters.domain === undefined) {
            throw('Missing parameters ipAddress or domain');
        }
        /*
        * ipAddress - the IP address of the user-agent making the DNS request.
        * domain - the domain being required by the user-agent.
        * */

        let ipAddress = event.queryStringParameters.ipAddress;
        let domain = event.queryStringParameters.domain;
        let domainCategoryDao = new DomainCategoryDao();

        let getCategories = domainCategoryDao.GetCategories(domain);

        Promise.all([getCategories])
            .then(values => {
                /**
                 * Values is an array of responses from the promises.
                 * Value[0] => Model_SiteData object.
                 * **/

            });

    } catch(error) {
        console.log("CheckAccess - Error: " + error);
        return common.getErrorResponse();
    }
};

