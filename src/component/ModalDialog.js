const React = require('react');
require('./ModalDialog.less');

class ModalDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  renderContent() {
    return null;
  }

  render() {
    if (!this.props.show) return null;

    return (
      <div className='modal' onClick={() => this.props.hideModal()}>
          <div className='modal-content' onClick={(e) => {e.stopPropagation()}}>
            {this.renderContent()}
        </div>
      </div>
    );
  }
}

module.exports = ModalDialog;
