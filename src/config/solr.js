module.exports = {
  product: {
    master: "http://localhost:8983/solr/product/",
  	slave: [
  		"http://localhost:8983/solr/product/"
  	]
  },

  history: {
    master: "http://localhost:8983/solr/history/",
  	slave: [
  		"http://localhost:8983/solr/history/"
  	]
  }
};
