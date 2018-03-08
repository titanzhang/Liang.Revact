const React = require('react');


class ProductGrid extends React.Component {
  constructor(props) {
    super(props);
  }

  renderProduct(product) {
    const imageUrl = product.thumbnail && product.thumbnail.trim().length > 0 ? product.thumbnail : product.image;
    return React.createElement(
      'div',
      { className: 'row', key: product.url },
      React.createElement(
        'div',
        { className: 'col col-1 product-img' },
        React.createElement('img', { height: '50', src: imageUrl })
      ),
      React.createElement(
        'div',
        { className: 'col col-11 product-info', onClick: () => this.props.clickProduct(product.url, product) },
        React.createElement(
          'div',
          { className: 'col col-8' },
          product.title
        ),
        React.createElement(
          'div',
          { className: 'col col-2' },
          product.price
        ),
        React.createElement(
          'div',
          { className: 'col col-2' },
          (product.price_change_percent * 100).toFixed(2),
          '%'
        )
      )
    );
  }

  render() {
    return React.createElement(
      'div',
      { className: 'product-grid' },
      React.createElement(
        'div',
        { className: 'row product-title' },
        React.createElement('div', { className: 'col col-1' }),
        React.createElement(
          'div',
          { className: 'col col-11' },
          React.createElement(
            'div',
            { className: 'col col-8' },
            'Product'
          ),
          React.createElement(
            'div',
            { className: 'col col-2' },
            'Price'
          ),
          React.createElement(
            'div',
            { className: 'col col-2' },
            'Price change'
          )
        )
      ),
      this.props.productList.map(product => this.renderProduct(product))
    );
  }
}

module.exports = ProductGrid;