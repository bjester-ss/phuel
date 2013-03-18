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

/**
 * Creates the logger
 * 
 * @returns {Logger}
 */
Core.getLogger = function()
{
  if (loggerInstance !== null)
  {
    return loggerInstance;
  }
  
  return loggerInstance =  new Logger('/var/tmp/node.log');
};

/**
 * 
 * @param {Bundle} bundle
 * @returns {undefined}
 */
Core.registerBundle = function(bundle)
{
  
};

exports.Core = Core;
