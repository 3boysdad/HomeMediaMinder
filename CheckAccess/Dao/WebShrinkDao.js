let Base64 = require('js-base64').Base64;
let md5 = require('md5');
let axios = require('axios');
let Model_SiteData = require('../Models/Model_SiteData');

function WebShrinkDao() {
}

/**
 * WebShrink Methods
 * **/
WebShrinkDao.prototype.GetCategories = async function(domain) {

    try {
        let requestConfig = this.GetRequestConfig();
        let url = this.GetUrl(domain);
        let result = await axios.get(url, requestConfig);

        if ( result.status===200) {
            if ( result.data.data.length === 1) {
                return new Model_SiteData(result.data.data[0]);
            }

            throw('Incomplete/Inaccurate response - ' + result.data);

        } else {
            throw(`STATUS: ${result.status} \\ HEADERS: ${JSON.stringify(result.headers)}`);
        }

    } catch(error) {
        console.log('WebShrinkDao.GetCategories - Domain: ' + domain + ' / Error: ' + error);
        throw('Error');
    }
};

WebShrinkDao.prototype.GetAllCategories = async function() {
    try {
        let requestConfig = this.GetRequestConfig();

        let result = await axios.get(url, requestConfig);

        if ( result.status===200) {
            if ( result.data.data.length === 1) {
                return result.data;
            }

            throw('Incomplete/Inaccurate response - ' + result.data);

        } else {
            throw(`STATUS: ${result.status} \\ HEADERS: ${JSON.stringify(result.headers)}`);
        }

    } catch(error) {
        console.log('WebShrinkDao.GetAllCategories - Error: ' + error);
        throw('Error');
    }
};

WebShrinkDao.prototype.GetRequestConfig = function() {
    let axiosRequest = {
        baseURL: process.env.CATEGORY_URL,
    };

    return axiosRequest;
};

WebShrinkDao.prototype.GetUrl = function(domain) {
    let encodedUrlParam = Base64.encode(domain);
    let request = process.env.CATEGORY_REQUEST + encodedUrlParam + '?key=' + process.env.WEBSHRINK_KEY;
    let hash = md5(process.env.SECRET + ":"+ request);
    return '/' + request + '&hash=' + hash;
};

module.exports = WebShrinkDao;
