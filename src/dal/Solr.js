
const CURL = require('../common/Curl');
const UTIL = require('util');

const SolrManager = {};

SolrManager.servers = SolrManager.servers || {};

SolrManager.getServer = function(logicalName) {
	if (this.servers[logicalName] === undefined) {
		this.servers[logicalName] = new Solr(logicalName);
	}
	return this.servers[logicalName];
}


function Solr(logicalName) {
	const config = Rev.loadConfig('solr');

	this.CMD_UPDATE = "update";
	this.CMD_QUERY = "select";
	this.TIMEOUT_QUERY = 10000; // 10 seconds
	this.TIMEOUT_UPDATE = 30000; // 30 sencods

	this.masterConfig = config[logicalName].master;
	this.slaveConfig = config[logicalName].slave;
}

Solr.prototype.getMaster = function() {
	return this.masterConfig;
}

Solr.prototype.getSlave = function() {
	const index = Math.floor(Math.random() * this.slaveConfig.length);
	return this.slaveConfig[index];
}

Solr.prototype.deleteByIDs = async function(idList) {
	// { delete: [idList] }
	try {
		const updateUrl = this.getMaster() + this.CMD_UPDATE;
		const sendData = JSON.stringify({delete:idList});

		const httpReturn = await CURL.post(updateUrl, sendData, this.TIMEOUT_UPDATE, 'application/json');
		const jsonReturn = JSON.parse(httpReturn.data);
		if (jsonReturn.error === undefined) {
			return {
				headers: httpReturn.headers,
				data: jsonReturn
			};
		} else {
			throw {message: 'Solr.deleteByIDs: ' + jsonReturn.error.msg};
		}
	} catch(e) {
		throw {message: 'Solr.deleteByIDs: ' + e.message};
	}
};

Solr.prototype.deleteByQuery = async function(searchTerm) {
	// { delete: { query: "serchTerm" } }
	try {
		const updateUrl = this.getMaster() + this.CMD_UPDATE;
		const sendData = JSON.stringify({delete:{query:searchTerm}});

		const httpReturn = await CURL.post(updateUrl, sendData, this.TIMEOUT_UPDATE, 'application/json');
		const jsonReturn = JSON.parse(httpReturn.data);
		if (jsonReturn.error === undefined) {
			return {
				headers: httpReturn.headers,
				data: jsonReturn
			};
		} else {
			throw {message: 'Solr.deleteByQuery: ' + jsonReturn.error.msg};
		}
	} catch(e) {
		throw {message: 'Solr.deleteByQuery: ' + e.message};
	}
};

Solr.prototype.update = function(docList) {
	return new Promise( (resolve, reject) => {
		const updateUrl = this.getMaster() + this.CMD_UPDATE;
		const sendData = JSON.stringify(docList);

		CURL.post(updateUrl, sendData, this.TIMEOUT_UPDATE, 'application/json')
			.then( (httpReturn) => {
				let jsonReturn = JSON.parse(httpReturn.data);
				if (jsonReturn.error !== undefined) {
					reject({message: 'Solr.update: ' + jsonReturn.error.msg});
				} else {
					resolve({
						headers: httpReturn.headers,
						data: jsonReturn
					});
				}
			})
			.catch( (error) => {
				reject( {message: 'Solr.update: ' + error.message} );
			});
	});
}

Solr.prototype.query = function(searchTermObject) {
	// Default return format is JSON
	if (searchTermObject.wt === undefined) {
		searchTermObject.wt = 'json';
	}

	// Construct the complete solr request URL
	const solrUrl = this.getMaster() + this.CMD_QUERY + '?' + this.formatTerm(searchTermObject);

	// Send request to solr server
	let taskChain = CURL.get(solrUrl, this.TIMEOUT_QUERY);
	taskChain = taskChain.then( (httpReturn) => {
		let jsonReturn = JSON.parse(httpReturn.data);
		if (jsonReturn.error !== undefined) {
			return Promise.reject({message: 'Solr.query.solr: ' + jsonReturn.error.msg});
		} else {
			return {
				headers: httpReturn.headers,
				data: jsonReturn
			};
		}
	});
	taskChain = taskChain.catch( (error) => {
		return Promise.reject( {message: 'Solr.query: ' + error.message} );
	});

	return taskChain;
}

Solr.prototype.formatTerm = function(searchTermObject) {
	let termString = '';
	let prefix = '';
	for (let key in searchTermObject) {
		const value = searchTermObject[key];
		if (Array.isArray(value)) {
			if (value.length > 0) {
				for (let i in value) {
					termString += UTIL.format('%s%s=%s', prefix, key, value[i]);
					prefix = '&';
				}
			}
		} else {
			termString += UTIL.format('%s%s=%s', prefix, key, value);
			prefix = '&';
		}
	}
	return termString;
}

module.exports.manager = SolrManager;
