/**
 * Phuel MVC Framework :: bootstrap.js
 *    by Blaine Jester
 *       3/15/2013
 */

// Require the Phuel environment, and start loading components
console.log('>> Loading environment...');
  require('./env.js');
console.log('>> Done!');

var util = Phuel.Lib.Util,
    logger = Phuel.Core.getLogger();

var library = util.generateDirectoryTree(Phuel.ROOT_DIR + '/lib', { 
  exclude: [/^\./] 
});

logger.info('Generated directory tree, preparing for loading classes');

var load = function(dir)
{
  for (var fileName in dir)
  {
    if (util.isObject(dir[fileName]))
    {
      logger.info('Recursing into directory: ' + fileName);
      load(dir[fileName]);
      continue;
    }
    
    logger.info('Loading from: ' + fileName);
  }
};

load(library);

