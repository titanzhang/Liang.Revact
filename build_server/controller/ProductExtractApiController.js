const Curl = require('../common/Curl');
const PageExtract = require('../common/PageExtract');

module.exports = (request, response) => {
  const controller = new ProductExtractApiController();
  Promise.resolve(request).then(controller.run.bind(controller)).then(data => {
    response.send(data);
  }).catch(error => {
    console.log(error);
    response.send('error');
  });
};

class ProductExtractApiController {
  parseParameters(request) {
    return {
      url: request.params.url
    };
  }

  async download(url) {
    try {
      const httpReturn = await Curl.get(url, 10000);
      return httpReturn.data;
    } catch (e) {
      console.log(e);
      throw { message: `ProductApiController: download failed (${e.message})` };
    }
  }

  buildModel(product, error) {
    if (error) {
      return { status: false, message: error.message };
    } else {
      return { status: true, product: product };
    }
  }

  async run(request) {
    try {
      const url = this.parseParameters(request).url;
      const pageContent = await this.download(url);
      const product = PageExtract.extract(url, pageContent);
      return this.buildModel(product);
    } catch (e) {
      return this.buildModel(null, e);
    }
  }
}