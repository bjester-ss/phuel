/**
 * Phuel MVC Framework :: ClassScopeHandler.js
 *    by Blaine Jester
 *       6/9/2012
 * 
 * @requires ClassFactory, Util
 */
var ClassFactory = Phuel.Lib.Class.ClassFactory,
    util = Phuel.Lib.Util;

var scope = new Array();

/**
 * The ClassScopeHandler Class
 * 
 * @param {String} name
 * @param {String} message
 * @return BaseException
 */
var ClassScopeHandler = ClassFactory.create({
  __CLASS__: 'ClassScopeHandler',
  key: '__scopeHandlerIndex'
});

ClassScopeHandler.prototype.__construct = function()
{
};

/**
 * Initializes the scipe handler for the object
 *
 * @param {Object} object
 */
ClassScopeHandler.prototype.init = function(object)
{
  if (!util.isSet(object) || util.isSet(object[this.key]))
  {
    throw 'Cannot init for object';
  }
  
  object[this.key] = scope.push({}) - 1;
};

/**
 * Returns the private scope object for the param object
 * 
 * @param {Object} object
 * @return {Object}
 */
ClassScopeHandler.prototype.scope = function(object)
{
  if (!util.isSet(object) || !util.isSet(object[this.key]))
  {
    throw 'Cannot get for object';
  }
  
  return scope[object[this.key]];
};


