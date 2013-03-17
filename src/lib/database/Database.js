/**
 * Phuel MVC Framework :: Database.js
 *    by Blaine Jester
 *       3/15/2013
 * 
 * @requires ClassFactory
 */
var ClassFactory = Phuel.Lib.Class.ClassFactory;

/**
 * The Databas Class
 * 
 * @exports Database as Phuel.Lib.Database.Database
 * @param {Object} params Connection params
 * @return Database
 */
var Database = exports.Database = ClassFactory.create({
  __CLASS__: 'Database'
});