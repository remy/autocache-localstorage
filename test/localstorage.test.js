function LC() {
  this.data = {};
}

LC.prototype = {
  getItem: function (key) {
    return this.data[key];
  },
  setItem: function (key, value) {
    this.data[key] = value;
    this.length = Object.keys(this.data).length;
  },
  removeItem: function (key) {
    delete this.data[key];
    this.length = Object.keys(this.data).length;
  },
  key: function (index) {
    return Object.keys(this.data)[index];
  },
  length: 0,
};


if (typeof global.localStorage === 'undefined') {
  global.localStorage = new LC();
}

var Store = require('../');
var cache = require('autocache')({ store: new Store() });
cache.debug = true;

require('autocache/test/core')(cache);