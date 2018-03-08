const React = require('react');


const headerItems = {
  homePage: ['Home', '/'],
  search: ['Search', '/search'],
  about: ['About']
};

class NavHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  buildMenu(name) {
    const [text, link] = headerItems[name];
    if (!text) return null;
    if (name === this.props.currentMenu) {
      return React.createElement(
        'li',
        { className: 'nav-item col active' },
        React.createElement(
          'a',
          { className: 'navlink', href: link || 'javascript:void(0);' },
          text
        )
      );
    } else {
      return React.createElement(
        'li',
        { className: 'nav-item col' },
        React.createElement(
          'a',
          { className: 'navlink', href: link || 'javascript:void();' },
          text
        )
      );
    }
  }

  render() {
    return React.createElement(
      'nav',
      { className: 'navbar' },
      React.createElement(
        'div',
        { className: 'container row' },
        React.createElement(
          'div',
          { className: 'navbar-title col' },
          React.createElement(
            'a',
            { className: 'navlink', href: '/' },
            'RevPrice'
          )
        ),
        React.createElement(
          'ul',
          { className: 'navbar-menu col' },
          this.buildMenu('homePage'),
          this.buildMenu('search'),
          this.buildMenu('about')
        )
      )
    );
  }
}

module.exports = NavHeader;