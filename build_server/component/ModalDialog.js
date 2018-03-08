const React = require('react');


class ModalDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  renderContent() {
    return null;
  }

  render() {
    if (!this.props.show) return null;

    return React.createElement(
      'div',
      { className: 'modal', onClick: () => this.props.hideModal() },
      React.createElement(
        'div',
        { className: 'modal-content', onClick: e => {
            e.stopPropagation();
          } },
        this.renderContent()
      )
    );
  }
}

module.exports = ModalDialog;