/**
 * Phuel MVC Framework :: TypeException.js
 *    by Blaine Jester
 *       6/9/2012
 */

pf.ClassLoader
  .getInstance()
  .include(pf.ClassLib.BaseException);

/**
 * The TypeException Class
 * 
 * @param {String} message Exception Message
 * @return TypeException
 */
var TypeException = pf.ClassFactory.create(
{
  __CLASS__: 'TypeException',
  extend: pf.BaseException
});

/**
 * The TypeException contstrutor
 * 
 * @param {String} message Exception message
 */
TypeException.prototype.__construct = function(message) 
{
  this.parent.__construct('Type Error', message);
};

pf.TypeException = exports.TypeException = TypeException;

