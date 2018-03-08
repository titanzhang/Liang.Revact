const Utils = require('../../common/Utils');
const Curl = require('../../common/Curl');
const PageExtract = require('../../common/PageExtract');
const SolrProduct = require('../../dal/SolrProduct');

module.exports = function () {
    const numRows = 2;
    const startIndex = 0;

    const job = new JobUpdatePrice();
    job.processProducts(startIndex, numRows).then(totalNumber => {
        Utils.log('UpdatePrice', totalNumber + ' products updated');
    }).catch(error => {
        console.log(error);
    });
};

class JobUpdatePrice {
    constructor() {
        this.totalNumber = 0;
    }

    async processProducts(startIndex, numFetch) {
        try {
            const productList = await this.getProducts(startIndex, numFetch);
            const numUpdated = await this.updateProducts(productList);
            this.totalNumber += numUpdated;

            if (numUpdated < 1) return this.totalNumber;
            return await this.processProducts(startIndex + numFetch, numFetch);
        } catch (e) {
            console.log(e);
            throw { message: 'JobUpdatePrice.processProducts(exception): ' + e.message };
        }
    }

    async getProducts(startIndex, numFetch) {
        try {
            const productList = await SolrProduct.DAO.getList(startIndex, numFetch);
            Utils.log('UpdatePrice', 'getProducts (' + startIndex + ', ' + numFetch + ')');
            return productList;
        } catch (e) {
            console.log(e);
            throw { message: 'JobUpdatePrice.getProducts(exception): ' + e.message };
        }
    }

    async updateProducts(productList) {
        try {
            if (productList.length < 1) {
                return 0;
            }

            await Promise.all(productList.map(product => this.updateProduct(product)));
            Utils.log('UpdatePrice', 'updateProducts ' + productList.length);
            return productList.length;
        } catch (e) {
            console.log(e);
            throw { message: 'JobUpdatePrice.updateProducts: ' + e.message };
        }
    }

    async updateProduct(product) {
        try {
            // Download page
            const httpReturn = await Curl.get(product.url, 10000);
            const pageContent = httpReturn.data;

            // Extract product information
            const productInfo = PageExtract.extract(product.url, pageContent);

            // Update Solr
            if (!product.image) console.log('Image ' + product.hash);
            await PageExtract.updateIndex(productInfo, product);

            return true;
        } catch (e) {
            if (e.statusCode === 403) {
                throw { message: 'JobUpdatePrice.updateProduct: blocked by Revzilla' };
            }
            if (e.statusCode === 404) {
                console.log('Delete ' + product.url);
                return SolrProduct.DAO.delete(product.hash);
            } else {
                console.log(e);
                return false;
            }
        }
    }

}