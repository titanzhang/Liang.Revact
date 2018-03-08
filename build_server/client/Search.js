const React = require('react');
const ReactDOM = require('react-dom');
const ContentSearch = require('../page/Search').Content;

const config = JSON.parse(document.getElementById('rev_states').innerHTML);

ReactDOM.hydrate(React.createElement(ContentSearch, config), document.getElementById('content'));