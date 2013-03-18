/**
 * Phuel MVC Framework :: env.js
 *    by Blaine Jester
 *       3/15/2013
 */

var UTIL = './lib/util/Util.js';
var CLASS_FACTORY = 'lib/class/ClassFactory.js';
var LOGGER = 'lib/util/Logger.js';
var CORE = 'lib/Core.js';

// Phuel namespace
var Phuel = global.Phuel = {
  Lib: {
    Class: {}
  },
  Vendor: {},
  Helper: {}
};

var util = Phuel.Lib.Util = require(UTIL).Util;

// Setup define function for constants
Phuel.define = util.define(Phuel);
Phuel.define('ROOT_DIR', __dirname);

// Continue including files
util.include(Phuel.Lib.Class, CLASS_FACTORY);
util.include(Phuel.Lib.Util, LOGGER);
util.include(Phuel, CORE);
