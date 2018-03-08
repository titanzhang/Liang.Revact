const React = require('react');


class ProductInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  renderHistory(h) {
    const hDate = new Date(h.date);
    return React.createElement(
      'div',
      { className: 'row', key: h.date },
      React.createElement(
        'div',
        { className: 'col col3' },
        '$',
        h.price
      ),
      React.createElement(
        'div',
        { className: 'col col3' },
        hDate.getFullYear(),
        '-',
        hDate.getMonth() + 1,
        '-',
        hDate.getDate()
      )
    );
  }

  renderCloseButton() {
    if (!this.props.showClose) return null;
    return React.createElement(
      'span',
      { className: 'close', onClick: () => this.props.onClose() },
      '\xD7'
    );
  }

  render() {
    const product = this.props.product;
    const history = this.props.history;
    if (!product) return null;

    return React.createElement(
      'div',
      null,
      React.createElement(
        'div',
        { className: 'productinfo-header' },
        this.renderCloseButton(),
        React.createElement(
          'h4',
          null,
          React.createElement(
            'a',
            { className: 'link', href: product.url },
            product.title
          )
        )
      ),
      React.createElement(
        'div',
        { className: 'productinfo-body' },
        React.createElement('img', { src: product.image, width: '300' }),
        React.createElement(
          'p',
          { className: 'productinfo-price' },
          '$',
          product.price,
          '(',
          (product.priceChangePercentage * 100).toFixed(2),
          '%)'
        ),
        React.createElement(
          'div',
          null,
          history.map(h => this.renderHistory(h))
        )
      )
    );
  }
}

module.exports = ProductInfo;