'use strict';

var request = require('request');

var endpoint = 'https://api.booleans.io';

class Booleans {
  constructor(bool, force) {
    this._flush(bool, force);
  }

  static get(id) {
    return new Booleans().get(id);
  }

  static create() {
    return new Promise((resolve, reject) => {
      request({
        url: `${endpoint}`,
        method: 'POST',
        json: true,
      }, function(err, res, body) {
        if (err) {
          return reject(err);
        }

        resolve(new Booleans(body));
      });
    });
  }

  _flush(bool, force) {
    bool = bool || {};
    var hasId = typeof bool.id !== 'undefined';
    var hasVal = typeof bool.val !== 'undefined';
    if (force || (hasId && hasVal)) {
      this.id = bool.id;
      this.val = bool.val;
    }
  }

  get(id) {
    var self = this;
    var returnNew = typeof id !== 'undefined';
    return new Promise((resolve, reject) => {
      id = id || this.id;
      if (!id) {
        return reject(new Error('invalid boolean id'));
      }
      request({
        url: `${endpoint}/${id}`,
        json: true,
      }, function(err, res, body) {
        if (err) {
          return reject(err);
        }
        if (res.statusCode === 404) {
          return reject(new Error('not found'));
        }
        if (res.statusCode !== 200) {
          return reject(new Error('server error'));
        }
        if (!returnNew) {
          self._flush(body);
          return resolve(self);
        }
        resolve(new Booleans(res.body));
      });
    });
  }

  destroy(id) {
    var self = this;
    var returnNew = typeof id !== 'undefined';
    return new Promise((resolve, reject) => {
      id = id || this.id;
      if (!id) {
        return reject(new Error('invalid boolean id'));
      }

      request({
        url: `${endpoint}/${id}`,
        method: 'DELETE',
      }, function(err, res) {
        if (err) {
          return reject(err);
        }
        if (res.body !== 'OK') {
          return reject(new Error(res.body));
        }
        if (!returnNew) {
          self._flush({ id: undefined, val: undefined}, true);
          return resolve(self);
        }
        resolve(new Booleans({}, true));
      });
    });
  }

  update(id, bool) {
    var self = this;
    var returnNew = typeof id !== 'boolean';
    return new Promise((resolve, reject) => {
      if (typeof id === 'boolean') {
        bool = id;
        id = null;
      }

      id = id || this.id;
      if (!id) {
        return reject(new Error('invalid boolean id'));
      }
      if (typeof bool === 'undefined') {
        return reject(new Error('invalid boolean val'));
      }

      request({
        url: `${endpoint}/${id}`,
        method: 'PUT',
        json: true,
        form: {
          val: bool
        }
      }, function(err, res, body) {
        if (err) {
          return reject(err);
        }
        if (res.statusCode !== 200) {
          return reject(new Error('updated failed'));
        }
        self._flush(body);
        if (!returnNew) {
          return resolve(self);
        }
        resolve(new Booleans(body));
      });
    });
  }
}

module.exports = Booleans;
