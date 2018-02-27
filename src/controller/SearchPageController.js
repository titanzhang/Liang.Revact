const SearchPage = require('../page/Search').Page;
const SolrProduct = require('../dal/SolrProduct');
const Utils = require('../common/Utils');

module.exports = (request, response) => {
  // Query format:
	// ?q=keyword&ppl=priceLow&pph=priceHigh&start=rowStart&rows=numRows

  const controller = new SearchPageController();
  Promise.resolve(request)
    .then(controller.run.bind(controller))
    .then((html) => {
      response.send(html)
    })
    .catch( (error) => {
      // TODO: Error page
      response.send('error');
      console.log(error);
    });
};

class SearchPageController {
  normalizeQuery(request) {
    const query = {};
  	query.q = (request.query.q === undefined || request.query.q === "")? "*": request.query.q;
  	query.ppl = (request.query.ppl === undefined || request.query.ppl === "")? "*": request.query.ppl;
  	query.pph = (request.query.pph === undefined || request.query.pph === "")? "*": request.query.pph;
  	query.start = (request.query.start === undefined || request.query.start === "")? '0': request.query.start;
  	query.rows = (request.query.rows === undefined || request.query.rows === "")? '20': request.query.rows;
  	return query;
  }

  parseParameters(request) {
    this.baseUrl = '/search';
  	this.query = this.normalizeQuery(request);

  	this.keyword = this.query.q;
  	this.pricePLow = ((this.query.ppl === '*')?'*':(this.query.ppl/100));
  	this.pricePHigh = ((this.query.pph === '*')?'*':(this.query.pph/100));
  	this.startIndex = Number(this.query.start);
  	this.numRows = Number(this.query.rows);
  }

  buildModel(products) {
    return {
      currentMenu: 'search',
      showText: 'Search page',
      productList: products.map( (product) => this.mapProduct(product) ),
      pagination: this.buildPagination(),
      productInfoApi: Rev.loadConfig('api').productInfoApi,
    };
  }

  mapProduct(product) {
    return {
      thumbnail: product.thumbnail,
      image: product.image,
      url: product.url,
      title: Utils.truncate(product.title, 55, ' ...'),
      price: product.price,
      price_change_percent: product.price_change_percent
    };
  }

  buildPagination() {
  	const constrains = '?q=' + this.query.q + '&ppl=' + this.query.ppl + '&pph=' + this.query.pph,
  	 prevIndex = this.startIndex - this.numRows,
  	 nextIndex = this.startIndex + this.numRows,
  	 prev = (prevIndex >= 0)? '&start=' + prevIndex: '',
  	 next = (this.numRows == this.numRowsReturn)? '&start=' + nextIndex: '';

  	return {
      first: `${this.baseUrl}${constrains}&start=0&rows=${this.query.rows}`,
      previous: prev !== ''? `${this.baseUrl}${constrains}${prev}&rows=${this.query.rows}`: null,
      next: next !== ''? `${this.baseUrl}${constrains}${next}&rows=${this.query.rows}`: null
    };
  };

  async search() {
    const products = await SolrProduct.DAO.getListByKeywordPriceP(
  		this.keyword,
  		this.pricePLow,
  		this.pricePHigh,
  		this.startIndex,
  		this.numRows);
    this.numRowsReturn = products.length;
		return products;
  }

  async run(request) {
    this.parseParameters(request);
    const products = await this.search();
    const model = this.buildModel(products);

    return SearchPage.buildHTML(model);
  }
}
