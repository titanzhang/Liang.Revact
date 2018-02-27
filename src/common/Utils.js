const Utils = {};
const XML2JS = require("xml2js");

Utils.parseXML = function(content) {
	const xml = {};

	XML2JS.parseString(content, function(err, result) {
		xml = result;
	});
	return xml;
};

Utils.removeHTMLTags = function(html) {
	const regexp = /<[^>]*>/g;
	return html.replace(regexp, "");
};

Utils.deepReplace = function(pattern, rep, text) {
	let oldLength = text.length;
	let string = text.replace(pattern, rep);
	let newLength = string.length;

	while (oldLength !== newLength) {
		oldLength = string.length;
		string = string.replace(pattern, rep);
		newLength = string.length;
	}
	return string;
};

Utils.truncate = function(str, len, affix) {
	let result = str.substr(0, len);
	if (len < str.length) {
		result += affix;
	}
	return result;
};

Utils.log = function(module, message) {
	const currentTime = new Date();
	console.log('[' + currentTime.toLocaleString('en-US', {hour12:false}) + '] ' + module + ': ' + message);
};

module.exports = {
  parseXML: Utils.parseXML.bind(Utils),
  removeHTMLTags: Utils.removeHTMLTags.bind(Utils),
  deepReplace: Utils.deepReplace.bind(Utils),
  log: Utils.log.bind(Utils),
  truncate: Utils.truncate.bind(Utils)
};
