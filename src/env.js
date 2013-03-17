/**
 * Phuel MVC Framework :: env.js
 *    by Blaine Jester
 *       6/3/2012
 */

const NAMESPACE = 'pf';
const INCLUDE = 'include';

const ROOT_DIR = _dirname;
const PHUEL = './lib/Phuel.js';
const CLASS_LOADER = './lib/class/ClassLoader.js';
const CLASS_FACTORY = './lib/class/ClassFactory.js';
const UTIL = './lib/util/Util.js';
const STANDARD = './standard';

/**
 * Set up the global Phuel Framework (pf) namespace
 */
var PhuelFramework = {};
global.PhuelFramework = global[NAMESPACE] = PhuelFramework;

global.Constants = require('constants');

PhuelFramework.define = Constants(PhuelFramework);
global.define = Constants(global);

define({
  PF_NAMESPACE: NAMESPACE,
  PF_INCLUDE: INCLUDE
});

PhuelFramework.define(
{
  ROOT_DIR: _dirname,
  PHUEL: PHUEL,
  CLASS_LOADER: CLASS_LOADER,
  CLASS_FACTORY: CLASS_FACTORY,
  UTIL: UTIL,
  STANDARD: STANDARD
});

require(UTIL);
require(CLASS_FACTORY);
require(CLASS_LOADER);
require(PHUEL);

/**
 * Include the root path
 */
PhuelFramework.ClassLoader
  .getInstance(PhuelFramework)
  .addPath(ROOT_DIR);


var standard = PhuelFramework.Util.generateDirectoryTree(STANDARD, 
  { exclude: [/^\./] });

for (var fileName in standard)
{
  var path = standard[fileName];
  if (PhuelFramework.Util.isString(path))
  {
    require(path);
  }
}
