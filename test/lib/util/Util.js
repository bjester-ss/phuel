var assert = require('assert'),
    util = require('../../../src/lib/util/Util.js').Util;

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
});

