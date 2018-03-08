const SolrProduct = require('../dal/SolrProduct');
const SolrHistory = require('../dal/SolrHistory');
const crypto = require('crypto');

module.exports = (request, response) => {
  const controller = new ProductInfoApiController();
  Promise.resolve(request).then(controller.run.bind(controller)).then(data => {
    response.send(data);
  }).catch(error => {
    console.log(error);
    response.send({ status: false, message: error.message });
  });
};

class ProductInfoApiController {
  parseParameters(request) {
    return {
      url: request.params.url
    };
  }

  async getProductInfo(url) {
    const urlHash = crypto.createHash('md5').update(url).digest('hex');
    try {
      const [product, history] = await Promise.all([SolrProduct.DAO.get(urlHash), SolrHistory.DAO.getListByHash(urlHash)]);
      return [product, history];
    } catch (e) {
      throw { message: `ProductInfoApiController.getProductInfo: ${e.message}` };
    }
  }

  buildModel(product, history) {
    return {
      product: !product ? null : {
        title: product.title,
        url: product.url,
        image: product.image,
        price: product.price,
        priceChangePercentage: product.price_change_percent
      },

      history: !history ? [] : history.map(h => {
        return {
          price: h.price,
          date: h.date
        };
      })
    };
  }

  async run(request) {
    try {
      const url = this.parseParameters(request).url;
      const [product, history] = await this.getProductInfo(url);
      return this.buildModel(product, history);
    } catch (e) {
      console.log(e);
      return { status: false, message: e.message };
    }
  }
}