const React = require('react');
require('./NavHeader.less');

const headerItems = {
  homePage: ['Home', '/'],
  search: ['Search', '/search'],
  about: ['About'],
};

class NavHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  buildMenu(name) {
    const [text, link] = headerItems[name];
    if (!text) return null;
    if (name === this.props.currentMenu) {
      return <li className='nav-item col active'><a className='navlink' href={link || 'javascript:void(0);'}>{text}</a></li>;
    }
    else {
      return <li className='nav-item col'><a className='navlink' href={link || 'javascript:void();'}>{text}</a></li>;
    }
  }

  render() {
    return (
      <nav className='navbar'>
        <div className='container row'>
          <div className='navbar-title col'><a className='navlink' href='/'>RevPrice</a></div>
          <ul className='navbar-menu col'>
            {this.buildMenu('homePage')}
            {this.buildMenu('search')}
            {this.buildMenu('about')}
          </ul>
        </div>
      </nav>
    );
  }
}

module.exports = NavHeader;
