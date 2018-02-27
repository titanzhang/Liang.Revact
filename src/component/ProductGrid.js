const React = require('react');
require('./ProductGrid.css');

class ProductGrid extends React.Component {
  constructor(props) {
    super(props);
  }

  renderProduct(product) {
    const imageUrl = (product.thumbnail && product.thumbnail.trim().length > 0)? product.thumbnail: product.image;
    return (
      <div className='row' key={product.url}>
        <div className='col col1 product-img'><img height='50' src={imageUrl} /></div>
        <div className='col col9 product-info' onClick={() => this.props.clickProduct(product.url, product)}>
          <div className='col col7'>{product.title}</div>
          <div className='col col1-5'>{product.price}</div>
          <div className='col col1-5'>{(product.price_change_percent*100).toFixed(2)}%</div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className='product-grid'>
        <div className='row product-title'>
          <div className='col col1'></div>
          <div className='col col9'>
            <div className='col col7'>Product</div>
            <div className='col col1-5'>Price</div>
            <div className='col col1-5'>Price change</div>
          </div>
        </div>
        {this.props.productList.map((product) => this.renderProduct(product))}
      </div>
    );
  }
}

module.exports = ProductGrid;
