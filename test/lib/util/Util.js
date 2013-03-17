var assert = require('assert'),
    util = require('../../../src/lib/util/Util.js').Util;

describe('type', function()
{
  it('should return object', function()
  {
    assert.equal('object', util.type({}));
  });
  
  it('should return number', function()
  {
    assert.equal('number', util.type(1));
  });
  
  it('should return array', function()
  {
    assert.equal('array', util.type([]));
  });
  
  it('should return function', function()
  {
    assert.equal('function', util.type(function(){}));
  });
  
  it('should return regexp', function()
  {
    assert.equal('regexp', util.type(/search/));
  });
  
  it('should return date', function()
  {
    assert.equal('date', util.type(new Date()));
  });
  
  it('should return string', function()
  {
    assert.equal('string', util.type('string'));
  });
  
  it('should return boolean', function()
  {
    assert.equal('boolean', util.type(false));
  });
  
  // For classes created by ClassFactory, and have __CLASS__ prop
  it('should return class_name', function()
  {
    var f = function(){};
    f.__CLASS__ = 'class_name';
    
    assert.equal('class_name', util.type(f));
  });
  
  it('should return undefined', function()
  {
    assert.equal('undefined', util.type());
  });
});

describe('isSet', function()
{
  it('should return true', function()
  {
    var k = 'undefined', a = {test: 'no'};
    
    assert.equal(true, util.isSet(''));
    assert.equal(true, util.isSet([]));
    assert.equal(true, util.isSet({}));
    assert.equal(true, util.isSet(k));
    assert.equal(true, util.isSet(0));
    assert.equal(true, util.isSet(false));
    assert.equal(true, util.isSet(a['test']));
  });
  
  it('should return false', function()
  {
    var k = undefined, a = {test: 'no'};
    
    assert.equal(false, util.isSet());
    assert.equal(false, util.isSet(k));
    assert.equal(false, util.isSet(null));
    assert.equal(false, util.isSet(a['not']));
  });
});


describe('isEmpty', function()
{
  it('should return true', function()
  {
    var k = undefined, a = {test: false};
    
    assert.equal(true, util.isEmpty());
    assert.equal(true, util.isEmpty(''));
    assert.equal(true, util.isEmpty([]));
    assert.equal(true, util.isEmpty(k));
    assert.equal(true, util.isEmpty(0));
    assert.equal(true, util.isEmpty(false));
    assert.equal(true, util.isEmpty(a['test']));
  });
  
  it('should return false', function()
  {
    var k = 'undefined', a = {test: 'no'};
    
    assert.equal(false, util.isEmpty([0]));
    assert.equal(false, util.isEmpty(true));
    assert.equal(false, util.isEmpty(1));
    assert.equal(false, util.isEmpty(k));
    assert.equal(false, util.isEmpty(a['test']));
  });
});

