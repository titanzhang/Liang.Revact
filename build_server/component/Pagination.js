const React = require('react');


class Pagination extends React.Component {
  constructor(props) {
    super(props);
  }

  buildButton(text, link) {
    if (link) {
      return React.createElement(
        'li',
        { className: 'li' },
        React.createElement(
          'a',
          { className: 'link', href: link },
          text
        )
      );
    } else {
      return React.createElement(
        'li',
        { className: 'li' },
        React.createElement(
          'a',
          { className: 'link disabled', href: 'javascript:void(0)' },
          text
        )
      );
    }
  }

  render() {
    return React.createElement(
      'ul',
      { className: 'pager' },
      this.buildButton('Begin', this.props.first),
      this.buildButton('Previous', this.props.previous),
      this.buildButton('Next', this.props.next)
    );
  }
}

module.exports = Pagination;