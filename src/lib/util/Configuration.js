/**
 * Phuel MVC Framework :: Configuration.js
 *    by Blaine Jester
 *       6/9/2012
 */

var fs = require('fs'),
    path = require('path'),
    events = requrire('events');

var config = {};

/**
 * The Configuration Class
 * 
 * @param {String} name
 * @param {String} message
 * @return BaseException
 */
var Configuration = pf.ClassFactory.create({
  __CLASS__: 'Configuration',
  extend: events.EventEmitter
});

Configuration.prototype.__construct = function(path, immutable)
{
  this.config = {};
};

/**
 * Sets the value of config
 * 
 * @param {String} config
 * @param {Mixed} newVal
 */
Configuration.prototype.set = function(config, newVal)
{
  var oldVal = this.config[config];
  this.config[config] = newVal;
  this.emit('change', config, oldVal, newVal);
  return this;
};

/**
 * Gets the value of config
 * 
 * @return {Mixed}
 */
Configuration.prototype.get = function(config, defaultVal)
{
  defaultVal = defaultVal || null;
  
  return (pf.Util.isSet(this.config[config]))
    ? this.config[config]
    : defaultVal
  ;
};

Configuration.prototype.isPersistent = function()
{
  
};
