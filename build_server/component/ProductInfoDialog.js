var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const React = require('react');
const ModalDialog = require('./ModalDialog');
const ProductInfo = require('./ProductInfo');

class ProductInfoDialog extends ModalDialog {
  constructor(props) {
    super(props);
  }

  renderContent() {
    return React.createElement(ProductInfo, _extends({}, this.props.productInfo, { showClose: true, onClose: () => this.props.hideModal() }));
  }
}

module.exports = ProductInfoDialog;