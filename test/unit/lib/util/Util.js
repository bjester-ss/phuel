var assert = require('assert'),
    util = require('../../../../src/lib/util/Util.js').Util;

/**
 * 
 * @test Phuel.Lib.Util.type
 */
describe('Util.type', function()
{
  it('should return object', function()
  {
    assert.equal('object', util.type({}), 'object');
  });
  
  it('should return number', function()
  {
    assert.equal('number', util.type(1), 'number');
  });
  
  it('should return array', function()
  {
    assert.equal('array', util.type([]), 'array');
  });
  
  it('should return function', function()
  {
    assert.equal('function', util.type(function(){}), 'function');
  });
  
  it('should return regexp', function()
  {
    assert.equal('regexp', util.type(/search/), 'regexp');
  });
  
  it('should return date', function()
  {
    assert.equal('date', util.type(new Date()), 'date');
  });
  
  it('should return string', function()
  {
    assert.equal('string', util.type('string'), 'string "string"');
  });
  
  it('should return boolean', function()
  {
    assert.equal('boolean', util.type(false), 'bool false');
  });
  
  // For classes created by ClassFactory, and have __CLASS__ prop
  it('should return class_name', function()
  {
    var f = function(){};
    f.__CLASS__ = 'class_name';
    
    assert.equal('class_name', util.type(f), 'function with __CLASS__ property');
  });
  
  it('should return undefined', function()
  {
    assert.equal('undefined', util.type(), 'no argument');
  });
});

/**
 * 
 * @test Phuel.Lib.Util.isSet
 */
describe('Util.isSet', function()
{
  it('should return true', function()
  {
    var k = 'undefined', a = {test: 'no'};
    
    assert.equal(true, util.isSet(''), 'empty string');
    assert.equal(true, util.isSet([]), 'empty array');
    assert.equal(true, util.isSet({}), 'empty object');
    assert.equal(true, util.isSet(k), 'string set to string of undefined');
    assert.equal(true, util.isSet(0), 'number 0');
    assert.equal(true, util.isSet(false), 'bool false');
    assert.equal(true, util.isSet(a['test']), 'object key set to string no');
  });
  
  it('should return false', function()
  {
    var k = undefined, a = {test: 'no'};
    
    assert.equal(false, util.isSet(), 'no argument');
    assert.equal(false, util.isSet(k), 'var set to undefined');
    assert.equal(false, util.isSet(null), 'null value');
    assert.equal(false, util.isSet(a['not']), 'object key not set');
  });
});

/**
 * 
 * @test Phuel.Lib.Util.isEmpty
 */
describe('Util.isEmpty', function()
{
  it('should return true', function()
  {
    var k = undefined, a = {test: false};
    
    assert.equal(true, util.isEmpty(), 'no argument');
    assert.equal(true, util.isEmpty(''), 'empty string');
    assert.equal(true, util.isEmpty([]), 'empty array');
    assert.equal(true, util.isEmpty(k), 'var set to undefined');
    assert.equal(true, util.isEmpty(0), 'number 0');
    assert.equal(true, util.isEmpty(false), 'bool false');
    assert.equal(true, util.isEmpty(null), 'null value');
    assert.equal(true, util.isEmpty(a['test']), 'object key set to false');
  });
  
  it('should return false', function()
  {
    var k = 'undefined', a = {test: 'no'};
    
    assert.equal(false, util.isEmpty([0]), 'array containing 0');
    assert.equal(false, util.isEmpty(true), 'bool true');
    assert.equal(false, util.isEmpty(1), 'number 1');
    assert.equal(false, util.isEmpty(k), 'string set to string of undefined');
    assert.equal(false, util.isEmpty(a['test']), 'object key set to string no');
  });
});

/**
 * 
 * @test Phuel.Lib.Util.coalesce
 */
describe('Util.coalesce', function()
{
  it('should return set value', function()
  {
    var set = 'set';
    
    assert.equal(set, util.coalesce(set), 'one arg');
    assert.equal(set, util.coalesce(set, 'other'), 'two arg');
    assert.equal(set, util.coalesce(null, set, 'other'), 'three args');
    assert.equal(set, util.coalesce(undefined, null, set, 'other', null), 'four args');
  });
  
  it('should return last value', function()
  {
    var last = 'last';
    
    assert.equal(last, util.coalesce(last), 'one arg');
    assert.equal(last, util.coalesce(null, last), 'two args');
    assert.equal(last, util.coalesce(undefined, null, last), 'three args');
  });
  
  it('should return null', function()
  {
    var x = [];
    assert.strictEqual(null, util.coalesce(), 'no args');
    assert.strictEqual(null, util.coalesce(undefined), 'one arg');
    assert.strictEqual(null, util.coalesce(undefined, x[1]), 'two args');
  });
});

/**
 * 
 * @test Phuel.Lib.Util.coalesce
 */
describe('Util.coalesce', function()
{
  it('should return set value', function()
  {
    var set = 'set';
    
    assert.equal(set, util.coalesce(set), 'one arg');
    assert.equal(set, util.coalesce(set, 'other'), 'two arg');
    assert.equal(set, util.coalesce(null, set, 'other'), 'three args');
    assert.equal(set, util.coalesce(undefined, null, set, 'other', null), 'four args');
  });
  
  it('should return last value', function()
  {
    var last = 'last';
    
    assert.equal(last, util.coalesce(last), 'one arg');
    assert.equal(last, util.coalesce(null, last), 'two args');
    assert.equal(last, util.coalesce(undefined, null, last), 'three args');
  });
  
  it('should return null', function()
  {
    var x = [];
    assert.strictEqual(null, util.coalesce(), 'no args');
    assert.strictEqual(null, util.coalesce(undefined), 'one arg');
    assert.strictEqual(null, util.coalesce(undefined, x[1]), 'two args');
  });
});

/**
 * 
 * @test Phuel.Lib.Util.wrap
 */
describe('Util.wrap', function()
{
  it('should throw exception', function()
  {
    assert.throws(function()
    {
      util.wrap();
    }, Error, 'throws error');
  });
});

/**
 * 
 * @test Phuel.Lib.Util.extend
 */
describe('Util.extend', function()
{
  it('should act simply when given simple things', function()
  {
    var base = {a: 'a'};
    assert.deepEqual(base, util.extend(base, {}), 'extend base with nothing');
    assert.deepEqual(base, util.extend({}, base), 'extend nothing with base');
    
    var extended = util.extend({}, base);
    extended.a = 'b';
    assert.notDeepEqual(base, extended, 'extend from base, but value doesnt change');
    
    var baseCopy = util.extend(base, {b: 'b'});
    assert.deepEqual(base, baseCopy, 'extend to base, and original object changes');
    
  });
  
  it('should overwrite when it is told to', function()
  {
    var base = {a: 'a'};
    var baseCopy = util.extend(base, {a: 'b'}, true);
    assert.deepEqual(base, baseCopy, 'extend to base, and original object changes');
    assert.equal('b', base.a, 'extend to base, and original value changed');
    
    util.extend(base, {a: 'c'});
    assert.equal('b', base.a, 'extend to base, and original value did not change');
  });
  
  it('should deep extend when told to', function()
  {
    var base = {a: {b: 'b'}};
    var from = {a: {b: 'x', c: 'c'}};
    var baseExtend = util.extend(base, from, false, true);
    assert.notDeepEqual(base, from, 'not entirely deeply extended to base');
    assert.equal(base.a['c'], baseExtend.a['c'], 'deeply extend to base');
    assert.equal('b', base.a.b, 'deeply extend to base without overwite');
    
    // Only value keeping deep equality
    base.a.b = from.a.b;
    assert.deepEqual(base, from, 'entirely deeply extended to base');
  });
  
  it('should deep extend and overwrite when told to', function()
  {
    var base = {a: {b: 'b'}};
    var from = {a: {b: 'x', c: 'c'}};
    var baseExtend = util.extend(base, from, true, true);
    assert.deepEqual(base, from, 'entirely deeply extended to base');
    assert.equal(base.a['c'], baseExtend.a['c'], 'deeply extend to base');
    assert.equal('x', base.a.b, 'deeply extend to base without overwite');
    
    // Only value keeping deep equality
    base.a.b = 'b';
    assert.notDeepEqual(base, from, 'not entirely deeply extended to base');
  });
  
  it('should overwrite when the callback returns a different value', function()
  {
    var base = {a: 'a'}, baseCopy = util.extend({}, base);
    var from = {a: 'b'};
    
    assert.deepEqual(base, util.extend(baseCopy, from, true, false, function(to, key)
    { 
      return to[key];
    }), 'override overwrite');
    
    assert.notDeepEqual(base, util.extend(baseCopy, from, true, false, function()
    { 
      return null;
    }), 'overwrite with null');
    
    assert.strictEqual(null, baseCopy.a, 'null value');
  });
});

/**
 * @test Phuel.Lib.Util.unset
 */
describe('Util.unset', function()
{
  it('should modify and return', function()
  {
    var test = {a: 'a', b: 'b', c: 'c'}, testCopy = util.extend({}, test);
    
    assert.deepEqual(test, testCopy, 'demonstrate they are the same');
    assert.equal('c', util.unset(testCopy, 'c'), 'return value at key c');
    assert.equal(undefined, testCopy['c'], 'value no longer exists');
    assert.equal(undefined, util.unset(testCopy, 'x'), 'no value to unset');
    
    util.unset(test, 'c');
    assert.deepEqual(testCopy, test, 'both are modified the same way now');
  });
});

/**
 * @test Phuel.Lib.Util.copy
 */
describe('Util.copy', function()
{
  it('should create a copy', function()
  {
    var test = {a: 'a', b: 'b', c: 'c'}, copy = util.copy(test);
    
    assert.deepEqual(test, copy, 'it is a copy');
    
    // But it is not affected 
    copy.a = 'x';
    assert.notEqual(test.a, copy.a, 'it is a copy, and not a reference');
  });
  
  it('should copy multiple', function()
  {
    var first = {a: 'a'}, snd = {a: 'x', b: 'b'}, copy = util.copy(first, snd);
    assert.deepEqual({a: 'x', b: 'b'}, copy, 'copy multiple with right preferred');
    
    copy = util.copy(first, snd, {b: 'x'});
    assert.deepEqual({a: 'x', b: 'x'}, copy, 'copy multiple without again');
  });
  
  it('should copy multiple with out overwriting', function()
  {
    var first = {a: 'a'}, snd = {a: 'x', b: 'b'}, copy = util.copy(first, snd, true);
    assert.deepEqual({a: 'a', b: 'b'}, copy, 'copy multiple with left preferred');
    
    copy = util.copy(first, snd, {b: 'x'}, true);
    assert.deepEqual({a: 'a', b: 'b'}, copy, 'copy multiple without again');
  });
});

/**
 * 
 * @test Util.generateDirectoryTree
 */
describe('Util.generateDirectoryTree', function()
{
  var fileSplit = __filename.split('/'),
      file = fileSplit.pop();
  
  it('should find this file', function()
  {
    var tree = util.generateDirectoryTree(__dirname);
    assert.equal(__filename, tree[file], 'check if file is in this');
  });
  
  it('should generate a tree recursively and consistently', function()
  {
    var parentDir = fileSplit.pop(), 
        tree = util.generateDirectoryTree(fileSplit.join('/'));
    assert.deepEqual(util.generateDirectoryTree(__dirname), 
      tree[parentDir], 'check recursion into parent dir, and matches itself');
  });
});

/**
 * 
 * @test Util.define
 */
describe('Util.define', function()
{
  it('should return a function to define constants on an object', function()
  {
    var test = {},
        define = util.define(test);
    
    define('TEST', 'testtesttest');
    assert.strictEqual(undefined, global['TEST'], 'globally its not defined');
    assert.strictEqual('testtesttest', test.TEST, 'on local object its defined');
    
    test.TEST = null;
    assert.strictEqual('testtesttest', test.TEST, 'value doesnt change');
  });
  
  it('should export constant globally', function()
  {
    util.define('TEST', 'testtesttest');
    assert.strictEqual('testtesttest', TEST, 'exported globally');
    
    TEST = null;
    assert.strictEqual('testtesttest', TEST, 'value doesnt change');
  });
});
