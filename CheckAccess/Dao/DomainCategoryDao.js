let CategoryDatabaseDao = require('./CategoryDatabaseDao');
let WebShrinkDao = require('./WebShrinkDao');

function DomainCategoryDao() {
}

DomainCategoryDao.prototype.GetCategories = async function(domain) {
    let categoryDao = new CategoryDatabaseDao();
    let webShrinkDao = new WebShrinkDao();

    try {

        let siteData = await categoryDao.GetCategories(domain);
        return siteData;

    } catch(error) {

        try {
            let siteData = await webShrinkDao.GetCategories(domain);
            await categoryDao.SaveCategories(siteData);

            return siteData;
        } catch(error) {
            console.log('DomainCategoryDao.GetCategories - Error: ' + error);
            throw('Error');
        }
    }
};

module.exports = DomainCategoryDao;