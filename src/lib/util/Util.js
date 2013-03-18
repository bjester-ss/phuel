/**
 * Phuel MVC Framework :: Util.js
 *    by Blaine Jester
 *       6/9/2012
 */

var Util = {}, types = {}, nj = {};
nj.util = require('util');
nj.path = require('path');
nj.fs = require('fs');

exports.Util = Util;

/**
  * Initialize the variable type object
  * 
  * @param {Object} types
  */
(function(types)
{
  var standardTypes = [
    'Boolean', 
    'Number', 
    'String', 
    'Function', 
    'Array', 
    'Date', 
    'RegExp', 
    'Object'
  ];

  for (var i = 0; i < standardTypes.length; i++)
  {
    types['[object ' + standardTypes[i] + ']'] = standardTypes[i].toLowerCase();
  }
})(types);

/**
  * Determines the data type of a variable
  * 
  * @param {Mixed} obj
  * @return {String}
  */
Util.type = function(obj)
{
  if (!Util.isSet(obj))
  {
    var type = 'undefined';
  }
  else if (Util.isSet(obj['__CLASS__']))
  {
    type = obj['__CLASS__'];
  }
  else
  {
    type = types[Object.prototype.toString.call(obj)];
  }

  return type;
};

/**
  * isset function checks if variable is unset or null
  * 
  * @param {Mixed} test
  * @return {Bool}
  */
Util.isSet = function(test)
{
  try
  {
    var isSet = (
      typeof test !== "undefined" 
      && test !== undefined 
      && test !== null
    );
  }
  catch (exception)
  {
    isSet = false;
  }

  return isSet;
};

/**
  * Determines if variable is empty
  * 
  * @param {Mixed} test
  * @return {Bool}
  */
Util.isEmpty = function(test)
{
  try
  {
    var isEmpty = (
      !Util.isSet(test)
      || (Util.type(test) === 'string' && test === '')
      || (Util.type(test) === 'array' && test.length === 0)
      || (Util.type(test) === 'boolean' && !test)
      || (Util.type(test) === 'number' && test === 0)
    );
  }
  catch (exception)
  {
    isEmpty = true;
  }

  return isEmpty;
};

/**
 * Determines if variable is an array
 *
 * @param {Mixed} test
 * @return {Bool}
 */
Util.isArray = nj.util.isArray;

/**
 * Determines if variable is a object
 *
 * @param {Mixed} test
 * @return {Bool}
 */
Util.isObject = function(test) { return Util.type(test) === 'object'; };

/**
 * Determines if variable is a function
 *
 * @param {Mixed} test
 * @return {Bool}
 */
Util.isFunction = function(test) { return Util.type(test) === 'function'; };

/**
 * Determines if variable is a string
 *
 * @param {Mixed} test
 * @return {Bool}
 */
Util.isString = function(test) { return Util.type(test) === 'string'; };

/**
  * Coalesces variables until a set variable is reached
  * 
  * @param {Mixed} ...args
  * @return {Mixed|null} Returns null if no set variable is passed
  */
Util.coalesce = function()
{
  for (var i = 0, argLength = arguments.length; i < argLength; i++)
  {
    if (Util.isSet(arguments[i]))
    {
      return arguments[i];
    }
  }

  return null;
};

/**
 * 
 * @param {type} method
 * @param {type} src
 * @param {type} dest
 * @param {type} atomic
 * @returns {undefined}
 */
Util.wrap = function(method, src, dest, atomic)
{
  throw new Error('Not implemented', 'Util.js', 173);
  
  atomic = Util.coalesce(atomic, false);

  if (Util.isFunction(src[method]) || Util.isFunction(dest[method]))
  {
    throw new Exception();
  }

  var srcMethod = src[method];
};

/**
 * Copy's object properties or methods from one object to another
 * 
 * @param {Object} to Object to copy into
 * @param {Object} from Object to copy from
 * @param {Bool} overwrite Whether or not overwrite items in the object
 * @param {Bool} recurse Boolean whether not to deep copy
 * @return {Object} The modified 'to' object
 */
Util.extend = function(to, from, overwrite, recurse, callback) 
{
  if (Util.isEmpty(from)) {return to;}

  recurse = (recurse || false);
  overwrite = (overwrite || false);
  callback = (callback || Util._extend);

  for (var k in from)
  {
    var set = from[k];
    
    if (recurse && Util.isObject(to[k]) && Util.isObject(from[k]))
    {
      set = Util.extend(to[k], from[k], overwrite, true);
    }
    
    if (overwrite || !(k in to)) {to[k] = callback(to, k, set);}
  }
  
  return to;
};

/**
 * The default Util.extend callback
 *
 * @param {Object} dest The destination object
 * @param {String|Int} key The key of the destination
 * @param {Mixed} val The value that will be set
 */
Util._extend = function(dest, key, val) {return val};

Util.unset = function(obj, key) 
{ 
  var val = obj[key]; 
  return (delete obj[key], val);
};

/**
 * Copies an object or objects.  Allows dynamic list of arguments to copy
 * 
 * @param {Object} objects Dynamic list of objects to extend
 * @param {Bool} overwrite Whether or not overwrite items in the object
 * @param {Bool} recurse Boolean whether not to deep copy
 * @return {Object} The copied obj
 */
Util.copy = function()
{
  var copy = {}, l = arguments.length, a = arguments,
    overwrite = Util.coalesce(Util.unset(a, l-1), true),
    recurse = Util.coalesce(Util.unset(a, l-1), true);
  
  for (var i = 0; i < l; i++)
  {
    if (!Util.isSet(a[i])) { continue; }
    copy = Util.extend(copy, a[i], overwrite, recurse);
  }
  
  return copy;
};

/**
 * Pulls the associated modules or files into the specified namespace
 * 
 * @param {Object} namespace
 * @param {String} file // File or module
 */
Util.include = function(namespace, file)
{
  var exports = require(Phuel.ROOT_DIR + '/' + file);
  return Util.extend(namespace, exports, true, true);
};

/**
 * Generates an object structure mimicing the directory structure
 * 
 * @param {String} dir
 * @param {Object} options
 * @param {Bool} __recurse Do not use
 * @return {Object}
 */
Util.generateDirectoryTree = function(dir, options, __recurse)
{
  dir = nj.path.resolve(dir);
  __recurse = Util.coalesce(__recurse, false);
  var stat = nj.fs.statSync(dir), s;
  
  if (!Util.isSet(stat) || !stat.isDirectory())
  {
    return (__recurse) ? dir : (s = {}, s[nj.path.basename(dir)] = dir, s);
  }
  
  var tree = {};
  var files = nj.fs.readdirSync(dir);
  
  for (var key in files)
  {
    var exclude = false;
    
    for (var ex in options.exclude)
    {
      if (options.exclude[ex].test(files[key]))
      {
        exclude = true;
        break;
      }
    }
    
    if (exclude) { continue; }
    
    tree[files[key]] = Util.generateDirectoryTree(dir + '/' + files[key], 
      options, true);
  }
  
  return tree;
};

/**
 * Converts an arguments object to array
 * 
 * @param {Object} args
 * @return {Mixed[]}
 */
Util.argsToArray = function(args)
{
  return Array.prototype.slice.call(args);
};

/**
 * Internal define function
 *
 * @param {String} name
 * @param {mixed} value
 */
var define = function(name, value)
{
  Object.defineProperty(this, name, {
    value: value,
    enumerable: true,
    writable: false,
    configurable: false
  });
};

/**
 * 
 * @param {String|Object} namespace
 * @param {mixed} value
 */
Util.define = function(namespace, value)
{
  // Define constant in particlar namespace returns func
  if (!Util.isString(namespace))
  {
    return define.bind(namespace);
  }
  
  // Normal define constant
  return define.call(global, namespace, value);
};
