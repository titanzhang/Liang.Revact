const React = require('react');
require('./Pagination.css');

class Pagination extends React.Component {
  constructor(props) {
    super(props);
  }

  buildButton(text, link) {
    if (link) {
      return (
        <li><a href={link}>{text}</a></li>
      );
    } else {
      return (
        <li className='disabled'><a href='javascript:void(0)'>{text}</a></li>
      );
    }
  }

  render() {
    return (
      <ul className='pager'>
        {this.buildButton('Begin', this.props.first)}
        {this.buildButton('Previous', this.props.previous)}
        {this.buildButton('Next', this.props.next)}
      </ul>
    );
  }
}

module.exports = Pagination;
