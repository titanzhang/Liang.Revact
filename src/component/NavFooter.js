const React = require('react');
require('./NavFooter.css');

class NavFooter extends React.Component {
  render() {
    return (
      <footer className='footer'>
        <div className='container'>
            <p>&copy;2018 LiangZhang</p>
        </div>
      </footer>
    );
  }
}

module.exports = NavFooter;
