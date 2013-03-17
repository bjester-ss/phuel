/**
 * Phuel MVC Framework :: Logger.js
 *    by Blaine Jester
 *       6/9/2012
 *
 * @requires ClassFactory, Util
 */
var ClassFactory = Phuel.Lib.Class.ClassFactory,
    pfUtil = Phuel.Lib.Util,
    fs = require('fs'),
    path = require('path'),
    events = require('events'),
    util = require('util');

/**
 * The Logger Class
 * 
 * @exports Logger as Phuel.Lib.Util.Logger
 * @param {String} name
 * @param {String} message
 * @return BaseException
 */
var Logger = exports.Logger = ClassFactory.create({
  __CLASS__: 'Logger',
  extend: events.EventEmitter,
  ready: false,
  handle: null,
  queue: null
});

var define = pfUtil.define(Logger);

// Class constants
define('ENTRY', '[%s] [%s] %s');
define('LEVEL_DEBUG', 'debug');
define('LEVEL_NOTICE', 'notice');
define('LEVEL_WARNING', 'warning');
define('LEVEL_ERROR', 'error');

/**
 * Private write function
 * 
 * @param {String} msg
 * @returns {undefined}
 */
var write = function(msg)
{
  if (!this.ready)
  {
    this.queue.push(msg);
    return;
  }
  
  console.log(msg);
  msg += '\n';
  fs.appendFile(this.getPath(), msg);
//  fs.write(this.fileHandle, msg, 0, msg.length, null);
};

/**
 * 
 * @param {String} path
 */
Logger.prototype.__construct = function(path)
{
  this.queue = new Array();
  this.setPath(path);
  this.on('write', write.bind(this));
  
  var me = this;
  
//  fs.open(path, 'a', function(err, fd)
//  {
    me.ready = true;
//    me.handle = fd;
//    for (var i = 0; i < me.queue.length; i++)
//    {
//      me.emit('write', me.queue[i]);
//    }
//  });
};

/**
 * Writes a message to the log file
 * 
 * @param {String} msg
 * @param {String} level Log level
 */
Logger.prototype.write = function(msg, level)
{
  var date = new Date(),
      dateFormat = new Array(
        date.toDateString(),
        date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
      );
  
  msg = util.format(Logger.ENTRY, dateFormat.join(' '), 
    (level || Logger.LEVEL_NOTICE), msg);
  
  if (!pfUtil.isString(msg))
  {
    msg = JSON.stringify(msg);
  }
  
  this.emit('write', msg);
  return this;
};

/**
 * Logs a message at debug level
 *
 * @param {String} msg
 * @return {Logger}
 */
Logger.prototype.debug = function(msg)
{
  return this.write(msg, Logger.LEVEL_DEBUG);
};

/**
 * Logs a message at notice level
 *
 * @param {String} msg
 * @return {Logger}
 */
Logger.prototype.notice = function(msg)
{
  return this.write(msg, Logger.LEVEL_NOTICE);
};

/**
 * Logs a message at warning level
 *
 * @param {String} msg
 * @return {Logger}
 */
Logger.prototype.warning = function(msg)
{
  return this.write(msg, Logger.LEVEL_WARNING);
};

/**
 * Logs a message at notice level
 *
 * @param {String} msg
 * @return {Logger}
 */
Logger.prototype.error = function(msg)
{
  return this.write(msg, Logger.LEVEL_ERROR);
};

/**
 * Sets the value of path
 * 
 * @param {String} path
 */
Logger.prototype.setPath = function(path)
{
  this.path = path;
  return this;
};

/**
 * Gets the value of path
 * 
 * @return {String}
 */
Logger.prototype.getPath = function()
{
  return this.path;
};
