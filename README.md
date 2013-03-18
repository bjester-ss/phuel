###  Note: Phuel is a work in progress

# Phuel
Phuel is designed with straightforward implementation in mind. It aims to
make it easy develop API's or websites quickly with Node.js, without getting
in the way of your code.  Have fun!

[![Build Status](https://secure.travis-ci.org/jesterb/Phuel.png)](http://travis-ci.org/jesterb/Phuel)

## How to use

```js
var Phuel = require('phuel');

var myBundle = new Phuel.Lib.Core.Bundle();
myBundle.setPath('/path/to/files');
myBundle.setDomain('mybundle.com');

Phuel.Core.registerBundle(myBundle);
```

### Or

```js
var Phuel = require('phuel');

var myBundle = new Phuel.Lib.Core.BundleFactory.create({
  path: '/path/to/files',
  domain: 'mybundle.com'
});

Phuel.Core.registerBundle(myBundle);
```
