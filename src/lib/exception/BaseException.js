/**
 * Phuel MVC Framework :: BaseException.js
 *    by Blaine Jester
 *       6/9/2012
 * 
 * @requires ClassFactory
 */
var ClassFactory = Phuel.Lib.Class.ClassFactory;

/**
 * The BaseException Class
 * 
 * @exports BaseException as Phuel.Lib.Exception.BaseException
 * @param {String} name
 * @param {String} message
 * @return BaseException
 */
var BaseException = exports.BaseException = ClassFactory.create({
  __CLASS__: 'BaseException',
  extend: Exception
});

/**
 * The BaseException contstrutor
 * 
 * @param {String} name
 * @param {String} message
 */
BaseException.prototype.__construct = function(name, message) 
{
  this.setName(name);
  this.setMessage(message);
};

/**
 * Sets the Exception name
 *
 * @param {String} name
 * @return {Object} self
 */
BaseException.prototype.setName = function(name)
{
  this.name = name; return this;
};

/**
 * Gets the Exception name
 *
 * @return {String} name
 */
BaseException.prototype.getName = function()
{
  return this.name;
};

/**
 * Sets the Exception message
 *
 * @param {String} message
 * @return {Object} self
 */
BaseException.prototype.setMessage = function(message)
{
  this.message = message; return this;
};

/**
 * Gets the Exception message
 *
 * @return {String} message
 */
BaseException.prototype.getMessage = function()
{
  return this.message;
};
