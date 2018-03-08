const SolrManager = require('./Solr').manager;

const ProductDAO = {
	serverName: 'product'
};

ProductDAO.delete = async function (urlHash) {
	try {
		const server = SolrManager.getServer(this.serverName);
		await server.deleteByIDs([urlHash]);
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};

ProductDAO.add = function (product) {
	try {
		const server = SolrManager.getServer(this.serverName);

		let taskChain = server.update([product]);
		taskChain = taskChain.then(solrReturn => {
			return product;
		});

		taskChain = taskChain.catch(error => {
			return Promise.reject({ message: 'ProductDAO.add: ' + error.message });
		});

		return taskChain;
	} catch (e) {
		return Promise.reject({ message: 'ProductDAO.add(exception): ' + error.message });
	}
};

ProductDAO.get = function (hash) {
	try {
		let taskChain = this.getListByHash([hash]);
		taskChain = taskChain.then(products => {
			return products[0];
		});
		taskChain = taskChain.catch(error => {
			return Promise.reject({ message: 'ProductDAO.get: ' + error.message });
		});

		return taskChain;
	} catch (e) {
		return Promise.reject({ message: 'ProductDAO.get(exception): ' + e.message });
	}
};

ProductDAO.getListByHash = function (hashList) {
	try {
		const server = SolrManager.getServer(this.serverName);

		let searchTerm = 'hash:(';
		let prefix = '';
		for (let i in hashList) {
			searchTerm += prefix + hashList[i];
			prefix = '%20OR%20';
		}
		searchTerm += ')';

		let taskChain = server.query({ q: searchTerm });
		taskChain = taskChain.then(solrReturn => {
			return solrReturn.data.response.docs;
		});

		taskChain = taskChain.catch(error => {
			return Promise.reject({ message: 'ProductDAO.getListByHash: ' + error.message });
		});

		return taskChain;
	} catch (e) {
		console.log(e);
		return Promise.reject({ message: 'ProductDAO.getListByHash(exception): ' + e.message });
	}
};

ProductDAO.getListByKeywordPriceP = function (keyword, pricePLow, pricePHigh, start, numRows) {
	try {
		const searchTerm = 'title:' + encodeURIComponent(keyword);
		const filterTerm = ['price_change_percent:[' + pricePLow + '%20TO%20' + pricePHigh + ']'];
		const queryObj = {
			q: searchTerm,
			fq: filterTerm,
			sort: 'price_change_percent%20asc',
			start: start,
			rows: numRows
		};

		const server = SolrManager.getServer(this.serverName);
		return server.query(queryObj).then(solrReturn => {
			return solrReturn.data.response.docs;
		}).catch(error => {
			return Promise.reject(error);
		});
	} catch (e) {
		console.log(e);
		return Promise.reject({ message: 'ProductDAO.getListByKeywordPriceP(exception): ' + e.message });
	}
};

ProductDAO.getList = function (start, numRows) {
	try {
		const server = SolrManager.getServer(this.serverName);
		const queryObj = {
			q: 'hash:*',
			fl: 'hash,url,price',
			rows: numRows,
			start: start
		};

		return server.query(queryObj).then(solrReturn => {
			return solrReturn.data.response.docs;
		}).catch(error => {
			return Promise.reject({ message: 'ProductDAO.getList: ' + error.message });
		});
	} catch (e) {
		console.log(e);
		return Promise.reject({ message: 'ProductDAO.getList(exception): ' + e.message });
	}
};

function ProductDO() {
	this.hash = 0;
	this.title = '';
	this.content = '';
	this.url = '';
	this.price = 0.0;
	this.msrp = 0.0;
	this.price_change = 0.0;
	this.price_change_percent = 0.0;
	this.image = '';
	this.thumbnail = '';
}

ProductDO.prototype.setHash = function (hash) {
	this.hash = hash;
	return this;
};

ProductDO.prototype.setTitle = function (title) {
	this.title = title;
	return this;
};

ProductDO.prototype.setContent = function (content) {
	this.content = content;
	return this;
};

ProductDO.prototype.setUrl = function (url) {
	this.url = url;
	return this;
};

ProductDO.prototype.setPrice = function (price) {
	this.price = price;
	return this;
};

ProductDO.prototype.setMsrp = function (msrp) {
	this.msrp = msrp;
	return this;
};

ProductDO.prototype.setPriceChange = function (priceChange) {
	this.price_change = priceChange;
	return this;
};

ProductDO.prototype.setPriceChangePercent = function (priceChangePercent) {
	this.price_change_percent = priceChangePercent;
	return this;
};

ProductDO.prototype.setImage = function (image) {
	this.image = image;
	return this;
};

ProductDO.prototype.setThumbnail = function (thumbnail) {
	this.thumbnail = thumbnail;
	return this;
};

module.exports = {
	DAO: ProductDAO,
	DO: ProductDO
};