const React = require('react');


class NavFooter extends React.Component {
  render() {
    return React.createElement(
      'footer',
      { className: 'footer' },
      React.createElement(
        'div',
        { className: 'container' },
        React.createElement(
          'p',
          null,
          '\xA92018 LiangZhang'
        )
      )
    );
  }
}

module.exports = NavFooter;