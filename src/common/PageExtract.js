const parser = require('cheerio');
const crypto = require('crypto');
const Utils = require('./Utils');
const SolrProduct = require('../dal/SolrProduct');
const SolrHistory = require('../dal/SolrHistory');

const updateProduct = async function(productDO, historyDO) {
  try {
    const taskList = [SolrProduct.DAO.add(productDO)];
    if (historyDO) taskList.push(SolrHistory.DAO.add(historyDO));

    const [productUpdated, historyReturn] = await Promise.all(taskList);
    return productUpdated;
  } catch(error) {
    throw { message: 'PageExtract.updateProduct: ' + error.message };
  }
};

module.exports = {
  updateIndex: async function(product, existProduct) {
    try {
      const url = product.url;

      const ProductDO = SolrProduct.DO;
      const HistoryDO = SolrHistory.DO;

      // Initialize the solr product object
      const productDO = new ProductDO();
      productDO.setHash(product.urlHash).
        setTitle(product.title).
        setContent(product.description).
        setUrl(url).
        setPrice(product.price).
        setMsrp(product.msrp).
        setPriceChange(product.priceChange).
        setPriceChangePercent(product.priceChangePercent).
        setImage(product.image).
        setThumbnail(product.thumbnail);

      // Create solr history object
      const historyDO = new HistoryDO();
      historyDO.setHash(product.urlHash)
        .setPrice(product.price);

      // Get original price
      existProduct = existProduct || (await SolrProduct.DAO.get(product.urlHash));
      if (!existProduct) { // New product
        return updateProduct(productDO, historyDO);
      } else { // Existing product
        if (product.price != existProduct.price) { // Price changed
          return updateProduct(productDO, historyDO);
        }
      }
    } catch(e) {
      throw { message: 'PageExtract.updateIndex: ' + e.message};
    }
  },

  extract: function(url, pageContent) {
    try {
      const product = {};
      const selector = parser.load(pageContent);

      // Digest of url as ID
      product.urlHash = crypto.createHash('md5').update(url).digest('hex');
      product.url = url;

      // Get title
      let title = selector("meta[property='og:title']").attr('content');
      if (title === undefined) {
        title = selector("meta[name='twitter:title']").attr('content');
      }
      if (title === undefined) {
        throw { message: 'Title not found in page'};
      }
      product.title = title;

      // Get price
      let price = selector('div[data-js="StylizedMoney.money SkuSelector.priceRetail"]').text();
      if (price === undefined) {
        throw {message: 'Price not found in page'};
      }
      product.price = parseFloat(price.replace('$', ''));

      // Get MSRP
      let msrp = selector('div[data-js="SkuSelector.priceWas"]').text();
      if (msrp === undefined) {
        product.msrp = price;
      } else {
        product.msrp = parseFloat(msrp.replace('$', ''));
      }

      // Calculate price change
      product.priceChange = product.price - product.msrp;
      product.priceChangePercent = product.priceChange / (product.msrp == 0? 0.1: product.msrp);

      // Get Description
      let description = selector('div[class="product-details__details"]').text();
      if (description === undefined) {
        throw {message: 'Description not found in page'};
      }
      description = Utils.deepReplace(/  /g, " ", description);
      description = Utils.deepReplace(/\n /g, "\n", description);
      description = Utils.deepReplace(/ \n/g, "\n", description);
      description = Utils.deepReplace(/\n\n/g, "\n", description);
      product.description = description;

      // Main image
      let mainImage = selector("meta[property='og:image']").attr('content');
      if (mainImage === undefined) {
        mainImage = '';
      }
      product.image = mainImage;

      // Thumbnail
      // let thum = selector("link[itemprop='thumbnail']").attr('href');
      // if (thum === undefined) {
      //   thum = '';
      // }
      product.thumbnail = mainImage;
      // console.log(product);
      return product;
    } catch(e) {
      console.log(e);
      throw {message: "PageExtract.extract: " + e.message};
    }
  }
};
