const React = require('react');
require('./ProductInfo.less');

class ProductInfo extends React.Component {
  constructor(props) {
    super(props);
  }

  renderHistory(h) {
    const hDate = new Date(h.date);
    return (
      <div className='row' key={h.date}>
        <div className='col col3'>${h.price}</div>
        <div className='col col3'>{hDate.getFullYear()}-{hDate.getMonth() + 1}-{hDate.getDate()}</div>
      </div>
    );
  }

  renderCloseButton() {
    if (!this.props.showClose) return null;
    return <span className="close" onClick={()=>this.props.onClose()}>&times;</span>;
  }

  render() {
    const product = this.props.product;
    const history = this.props.history;
    if (!product) return null;

    return (
      <div>
        <div className='productinfo-header'>
          {this.renderCloseButton()}
          <h4><a className='link' href={product.url}>{product.title}</a></h4>
        </div>
        <div className='productinfo-body'>
          <img src={product.image} width='300'/>
          <p className='productinfo-price'>${product.price}({(product.priceChangePercentage*100).toFixed(2)}%)</p>
          <div>{history.map( (h) => this.renderHistory(h) )}</div>
        </div>
      </div>
    );
  }
}

module.exports = ProductInfo;
