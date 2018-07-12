'use strict';
let Base64 = require('js-base64').Base64;
let md5 = require('md5');
let https = require('https');
let Model_Category = require('../../Models/Model_Category');
let Model_SiteData = require('../../Models/Model_SiteData');

function WebShrinkDao(domain) {
    this.Domain = domain;
}

WebShrinkDao.prototype.GetCategories = async function() {
    var encodedUrlParam = Base64.encode(this.Domain);
    var request = process.env.CATEGORY_REQUEST + encodedUrlParam + '?key=' + process.env.KEY;
    var hash = md5(process.env.SECRET + ":"+ request);
    var finalPath = '/' + request + '&hash=' + hash;
    var restOptions = {
        host: process.env.CATEGORY_URL,
        port: 443,
        path: finalPath,
        method: 'GET'
    }

    return new Promise(function(resolve, reject) {
        https.request(restOptions, function(response) {
            if ( response.statusCode===200) {
                response.setEncoding('utf8');
                response.on('data', (chunk) => {
                    var responseObject = JSON.parse(chunk);
                    var siteData = new Model_SiteData(responseObject.data[0]);
                    resolve(siteData);
                });
            } else {
                var errorMessage = `STATUS: ${response.statusCode} \\ HEADERS: ${JSON.stringify(response.headers)}`;
                reject(errorMessage);
            }
        }).end();
    });
}

module.exports = WebShrinkDao;