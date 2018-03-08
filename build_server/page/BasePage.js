const React = require('react');

class BasePage extends React.Component {
  getTitle() {
    return 'RevPrice';
  }

  getPageCSS() {
    return null;
  }

  getInitStates() {
    return null;
  }

  getPageJS() {
    return null;
  }

  getContent() {
    return null;
  }

  render() {
    const Content = this.getContent(),
          PageCSS = this.getPageCSS(),
          InitStates = this.getInitStates(),
          PageJS = this.getPageJS();
    return React.createElement(
      'html',
      null,
      React.createElement(
        'head',
        null,
        React.createElement(
          'title',
          null,
          this.getTitle()
        ),
        React.createElement(PageCSS, null)
      ),
      React.createElement(
        'body',
        null,
        React.createElement(InitStates, null),
        React.createElement(
          'div',
          { id: 'content' },
          React.createElement(Content, null)
        ),
        React.createElement(PageJS, null)
      )
    );
  }
}

module.exports = BasePage;