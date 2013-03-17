/**
 * Phuel MVC Framework :: Core.js
 *    by Blaine Jester
 *       6/3/2012
 */
var Logger = Phuel.Lib.Util.Logger,
    loggerInstance = null;
/**
 * The Phuel Core Class
 * 
 * @return {Phuel}
 */
var Core = {};

Core.getLogger = function()
{
  if (loggerInstance !== null)
  {
    return loggerInstance;
  }
  
  return loggerInstance =  new Logger('/var/tmp/node.log');
};

Core.registerBundle = function()
{
  
};

exports.Core = Core;
