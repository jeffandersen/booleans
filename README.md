Booleans
========

Access booleans as a service through [booleans.io](https://booleans.io)

### Installation

`npm install booleans`

### Usage

```js
var Booleans = require('booleans');

Booleans.create().then(function(bool) {
  // { id: '8a56ff37-1adf-4fd4-a5e0-7643af5d343e', val: false}
  return bool.update(true);
}).then(function(bool) {
  // { id: '8a56ff37-1adf-4fd4-a5e0-7643af5d343e', val: true}
  return bool.delete();
}).then(function(bool) {
  // { id: undefined, val: undefined }
});

var id = '670046ff-49e3-48f9-b3c6-715639e68a47';
Booleans.get(id).then(function(bool) {
  // { id: '670046ff-49e3-48f9-b3c6-715639e68a47', val: false}
});
```

### License

Don't ever use this.
