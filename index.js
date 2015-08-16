var LocalStore = (function () { // jshint ignore:line
  'use strict';

  var noop = function () {};
  var cache = null;

  function LocalStore(c) {
    if (c) {
      cache = c;
      c.configure({ store: new LocalStore() });
      cache.emit('connect');
      return LocalStore;
    }

    this.prefix = 'autocache:';
  }

  LocalStore.prototype.dock = function (c) {
    cache = c;
    cache.emit('connect');
  };

  LocalStore.prototype.toString = function () {
    return 'LocalStore(#' + localStorage.length + ')';
  };

  LocalStore.prototype.get = function (sid, fn) {
    var store = this;
    var psid = store.prefix + sid;
    if (!fn) { fn = noop; }

    var result = localStorage.getItem(psid);

    return fn(null, result === null ? undefined : result);
  };

  LocalStore.prototype.clear = function (fn) {
    if (!fn) { fn = noop; }

    var length = localStorage.length;
    var key;

    for (var i = 0; i < length; i++) {
      key = localStorage.key(i);
      if (key.indexOf(this.prefix) === 0) {
        localStorage.removeItem(key);
        // reverse index back
        i--;
        length--;
      }
    }

    fn(null);
  };

  LocalStore.prototype.set = function (sid, value, fn) {
    var psid = this.prefix + sid;
    if (!fn) { fn = noop; }

    try {
      localStorage.setItem(psid, value);
    } catch (e) {
      return fn(e);
    }

    fn(null, value);
  };

  LocalStore.prototype.destroy = function (sid, fn) {
    sid = this.prefix + sid;
    var stored = true;
    // if we have a callback, then we check if there was a value in the first
    // place
    if (fn) {
      stored = localStorage.getItem(sid);
    }

    var error = null;

    try {
      localStorage.removeItem(sid);
    } catch (e) {
      error = e;
    }

    if (fn) {
      fn(error, !!stored);
    }
  };

  return LocalStore;
})(); // jshint ignore:line

if (typeof exports !== 'undefined') {
  module.exports = LocalStore;
}