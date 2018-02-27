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
    return (
      <html>
        <head>
          <title>{this.getTitle()}</title>
          <PageCSS />
        </head>
        <body>
          <InitStates />
          <div id='content'><Content /></div>
          <PageJS />
        </body>
      </html>
    );
  }
}

module.exports = BasePage;
