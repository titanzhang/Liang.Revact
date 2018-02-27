const React = require('react');
const ModalDialog = require('./ModalDialog');
const ProductInfo = require('./ProductInfo');

class ProductInfoDialog extends ModalDialog {
  constructor(props) {
    super(props);
  }

  renderContent() {
    return <ProductInfo {...this.props.productInfo} showClose={true} onClose={()=>this.props.hideModal()}/>;
  }
}

module.exports = ProductInfoDialog;
