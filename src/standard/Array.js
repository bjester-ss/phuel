
Array.prototype.last = function(defaultValue)
{
  var val = this[this.length - 1];
  return (PhuelFramework.Util.isSet(val))
    ? val
    : defaultValue;
};

Array.prototype.first = function(defaultValue)
{
  var val = this[0];
  return (PhuelFramework.Util.isSet(val))
    ? val
    : defaultValue;
};
