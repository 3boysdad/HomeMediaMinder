'use strict';
let Model_Category = require('./Model_Category');

function Model_SiteData(data) {
    this.Url = data.url;
    this.Categories = [];

    for(var i = 0; i < data.categories.length; i++) {
        var newCategory = new Model_Category(data.categories[i]);
        this.Categories.push(newCategory);
    }
}

module.exports = Model_SiteData;
