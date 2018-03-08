const React = require('react');
require('./ProductGrid.less');

class ProductGrid extends React.Component {
  constructor(props) {
    super(props);
  }

  renderProduct(product) {
    const imageUrl = (product.thumbnail && product.thumbnail.trim().length > 0)? product.thumbnail: product.image;
    return (
      <div className='row' key={product.url}>
        <div className='col col-1 product-img'><img height='50' src={imageUrl} /></div>
        <div className='col col-11 product-info' onClick={() => this.props.clickProduct(product.url, product)}>
          <div className='col col-8'>{product.title}</div>
          <div className='col col-2'>{product.price}</div>
          <div className='col col-2'>{(product.price_change_percent*100).toFixed(2)}%</div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className='product-grid'>
        <div className='row product-title'>
          <div className='col col-1'></div>
          <div className='col col-11'>
            <div className='col col-8'>Product</div>
            <div className='col col-2'>Price</div>
            <div className='col col-2'>Price change</div>
          </div>
        </div>
        {this.props.productList.map((product) => this.renderProduct(product))}
      </div>
    );
  }
}

module.exports = ProductGrid;
