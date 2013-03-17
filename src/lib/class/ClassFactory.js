/**
 * Phuel MVC Framework :: ClassFactory.js
 *    by Blaine Jester
 *       6/9/2012
 */
var ClassFactory = {}, 
    nj = {},
    util = Phuel.Lib.Util, 
    define = util.define(ClassFactory);

exports.ClassFactory = ClassFactory;

/**
 * Constant for defining the class a class with extend (inherit)
 */
define('EXTEND', 'extend');
define('SINGLETON', 'singleton');

/**
 * The default prototype inherited by all class built by 
 */
ClassFactory.basePrototype = 
{
  __CLASS__: null,
  __parent: function(parent){ this.parent = parent; },
  parent: null
};

/**
 * The construct and destruct functions will be inherited separately 
 */
ClassFactory.structPrototype = 
{
  __construct: function(){},
  __destruct: function(){}
};

/**
 * The singleton prototype
 */
ClassFactory.singletonPrototype =
{
  INSTANCE: '__instance',
  getInstance: function() 
  {
    if (util.isSet(this[this.INSTANCE]))
    {
      return this[this.INSTANCE];
    }

    return this[this.INSTANCE] = new this();
  }
};

ClassFactory.singletonPrototype[ClassFactory.singletonPrototype.INSTANCE] = null;

/**
 * Creates a class from a prototype object literal
 * 
 * @param {Object} proto The object literal that will be used for the prototype
 */
ClassFactory.create = function(proto)
{
  proto = (proto || {});
  
  var newClass = function()
  {
    this.__parent.call(this, this.__proto__.__proto__);
    
    if (util.isFunction(this['__construct']))
    {
      this.__construct.apply(this, arguments);
    }
  };
  
  newClass.prototype = util.copy(ClassFactory.basePrototype, proto, false, true);
  
  if (util.isSet(proto[ClassFactory.EXTEND]))
  {
    newClass.prototype.__proto__ = proto[ClassFactory.EXTEND].prototype;
    delete proto[ClassFactory.EXTEND];
  }
  else
  {
    util.extend(newClass.prototype, ClassFactory.structPrototype);
  }
  
  if (ClassFactory.SINGLETON in newClass.prototype)
  {
    util.extend(newClass, ClassFactory.singletonPrototype);
  }
  
  return newClass;
};
