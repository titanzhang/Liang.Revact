require('./global.js');
const Express = require('express');
const app = Express();

const hostname = require('os').hostname();
app.set('x-powered-by', false)
app.use( (request, response, next) => {
	response.header('ahh', hostname);
	response.header('Access-Control-Allow-Origin', request.headers.origin);
	response.header('Access-Control-Allow-Credentials', 'true');
	next();
});

// Routing rules
app.get('/search', require('./controller/SearchPageController'));
app.get('/product/extract/:url', require('./controller/ProductExtractApiController'));
app.get('/product/info/:url', require('./controller/ProductInfoApiController'));

// Start server
const serverConfig = Rev.loadConfig('server');
app.listen(serverConfig.port, () => {
  console.log(`Server is running on http://localhost:${serverConfig.port}`);
});
