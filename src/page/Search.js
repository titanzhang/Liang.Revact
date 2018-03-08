const ReactDOMServer = require('react-dom/server');
const React = require('react');
const NavHeader = require('../component/NavHeader');
const NavFooter = require('../component/NavFooter');
const ProductGrid = require('../component/ProductGrid');
const ProductInfoDialog = require('../component/ProductInfoDialog');
const Pagination = require('../component/Pagination');
require('../component/base.less');

class ContentSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMenu: props.currentMenu,
      showText: props.showText,
      productList: props.productList,
      pagination: props.pagination,
      productInfo: {
        product: null,
        history: []
      },
      showProductDialog: false,
    };
  }

  clickProduct(url, product) {
    // console.log(this.props.productInfoApi);

    this.setState({
      productInfo: {
        product: {
          title: product.title,
          url: product.url,
          image: product.image,
          price: product.price,
          priceChangePercentage: product.price_change_percent,
        },
        history: []
      },
      showProductDialog: true
    });

    this.fetchProductInfo(url);
  }

  fetchProductInfo(url) {
    url = encodeURIComponent(url);
    fetch(`${this.props.productInfoApi}${url}?${new Date().getTime()}`)
      .then( (response) => response.json())
      .then( (json) => {
        const history = json.history;
        const product = json.product;
        this.setState({
          productInfo: {
            product: product,
            history: history.map((h) => ({date: h.date, price: h.price}))
          },
          showProductDialog: true
        });
      })
      .catch( (e) => {
        console.log(e);
      })
  }

  hideProductDialog() {
    this.setState({showProductDialog: false});
  }

  render() {
    return (
      <div>
        <NavHeader currentMenu={this.state.currentMenu}/>
        <div className='main'>
          <ProductGrid productList={this.state.productList} clickProduct={(url, product)=>this.clickProduct(url, product)} />
          <Pagination {...this.state.pagination} />
          <ProductInfoDialog productInfo={this.state.productInfo} show={this.state.showProductDialog} hideModal={() => this.hideProductDialog()}/>
        </div>
        <NavFooter />
      </div>
    );
  }
}

const PageSearch = {
  resource: {
      js: ['search.js', 'js/search.js'],
      css: ['search.css', 'css/search.css']
  },

  getTitle: function() {
    return 'RevPrice -- Search';
  },

  buildHTML: function(props) {
    const js = Rev.loadResource(this.resource.js[0]) || this.resource.js[1];
    const css = Rev.loadResource(this.resource.css[0]) || this.resource.css[1];
    const siteConfig = Rev.loadConfig('site');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${this.getTitle()}</title>
          <link rel="stylesheet" type="text/css" href="${siteConfig.cssPool}${css}" />
        </head>
        <body>
          <script id="rev_states" type="application/json">${JSON.stringify(props)}</script>
          <div id='content' class='container'>${ReactDOMServer.renderToString(<ContentSearch {...props}/>)}</div>
          <script type="application/javascript" src="${siteConfig.jsPool}${js}"></script>
        </body>
      </html>
    `;
  }
};

module.exports.Page = PageSearch;
module.exports.Content = ContentSearch;
