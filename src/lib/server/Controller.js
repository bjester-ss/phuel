/**
 * Phuel MVC Framework :: Controller.js
 *    by Blaine Jester
 *       6/9/2012
 *       
 * @requires ClassFactory
 */
var ClassFactory = Phuel.Lib.Class.ClassFactory,
    http = require('http'),
    url = require('url');

var STATUS =
{
  100: 'Continue',
  200: 'OK',
  204: 'Not Content',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  307: 'Temporary Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  408: 'Request Timeout',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout'
};

var REQUEST_METHOD =
{
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

/* Create constants from codes */
(function(status)
{
  for (var code in status)
  {
    status[status[code].trim().toUpperCase().replace(/\s+/g, '_')] = code;
  }
})(STATUS);

/**
 * The BaseException Class
 * 
 * @param {String} name
 * @param {String} message
 * @return BaseException
 */
var Controller = exports.Controller = ClassFactory.create({
  __CLASS__: 'Controller',
  extend: http.Server,
  defaultPort: 80,
  defaultHost: 'localhost'
});

Controller.prototype.__construct = function()
{
  this.setPort(this.defaultPort);
  this.setHost(this.defaultHost);
};

Controller.prototype.listen = function()
{
  this.on('request', this.handleRequest.bind(this));
  this.parent.listen(this.getPort(), this.getHost());
};

Controller.prototype.handleRequest = function(request, response)
{
  
};

/**
 * Sets the value of port
 * 
 * @param {Int} port
 */
Controller.prototype.setPort = function(port)
{
  this.port = port;
};

/**
 * Gets the value of port
 * 
 * @return {Int}
 */
Controller.prototype.getPort = function()
{
  return this.port;
};

/**
 * Sets the value of host
 * 
 * @param {String} host
 */
Controller.prototype.setHost = function(host)
{
  this.host = host;
};

/**
 * Gets the value of host
 * 
 * @return {String}
 */
Controller.prototype.getHost = function()
{
  return this.host;
};
