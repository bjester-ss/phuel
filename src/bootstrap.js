/**
 * Phuel MVC Framework :: bootstrap.js
 *    by Blaine Jester
 *       3/15/2013
 */

// Require the Phuel environment, and start loading components
require('./env.js');

var logger = Phuel.Core.getLogger();

var standard = util.generateDirectoryTree('./lib', { exclude: [/^\./] });

for (var fileName in standard)
{
  logger.debug(standard[fileName]);
}
