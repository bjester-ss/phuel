/**
 * Phuel MVC Framework :: Expr.js
 *    by Blaine Jester
 *       6/9/2012
 */
pf.ClassLoader
  .getInstance()
  .require(pf.ClassLib.ClassFactory);

/**
 * The Expr Class
 * 
 * @classDescription The Expr class is for building sql queries
 * @return Expr
 */
var Expr = pf.ClassFactory.create(
{
  __CLASS__: 'Expr'
});

/**
 * The Expr contstrutor
 *
 * @param {String|Expr} sql 
 * @param {Mixed[]} params
 */
Expr.prototype.__construct = function(sql, params) 
{
  if (Expr.isExpr(sql))
  {
    this.setSql(sql.getSql()).setParams(sql.getParams());
  }
  else
  {
    if (/\$\d/.test(sql))
    {
      var setParams = new Array();
      sql = sql.replace(/\$(\d{1,2})/, function(a, b, c)
      {
        return;
      });
    }
    this.setSql(sql).setParams(params || new Array());
  }
};

/**
 * Determines if expr is an Expr object
 *
 * @param {Expr} expr
 * @return {Bool}
 */
Expr.isExpr = function(expr)
{
  return expr instanceof Expr || pf.Util.type(expr) == 'Expr';
};

/**
 * Prepends sql or an Expr to the current expr
 * 
 * @param {String|Expr} sql
 * @param {String} separator
 * @return {Expr}
 */
Expr.prototype.prepend = function(sql, separator)
{
  separator = separator || ' ';
  
  if (Expr.isExpr(sql))
  {
    sql = sql.getSql();
    this.setParams(sql.getParams().concat(this.getParams()));
  }
  
  this.setSql(sql + separator + this.getSql());
  
  return this;
};

/**
 * Appends sql or an expr to the current expr
 * 
 * @param {String|Expr} sql
 * @param {String} separator
 * @return {Expr} this
 */
Expr.prototype.append = function(sql, separator)
{
  separator = separator || ' ';
  
  if (Expr.isExpr(sql))
  {
    sql = sql.getSql();
    this.setParams(this.getParams().concat(sql.getParams()));
  }
  
  this.setSql(this.getSql() + separator + sql);
  
  return this;
};

/**
 * Wraps the expr with the wrap value, or prepends the wrap value and appends
 * the append value, separated by the sep value
 *
 * @param {String|Expr} wrap The value to wrap or prepend if append is set
 * @param {String} sep
 * @param {String} append
 * @return {Expr} this
 */
Expr.prototype.wrap = function(wrap, sep, append)
{
  append = append || wrap;
  this.prepend(wrap, sep);
  this.append(append, sep);
  return this;
};

/**
 * Creates a prepared statement from the expr
 *
 * @param {Connection} con
 * @return {PreparedStatement}
 */
Expr.prototype.createPreparedStatement = function(con)
{
  con = con || Phuel.getConnection();
  
  return con.createPreparedStatement(this.getSql(), this.getParams());
};

/**
 * 
 *
 * @param {Connection} con
 * @return {ResultSet}
 */
Expr.prototype.executeQuery = function(con)
{
  var statement = this.createPreparedStatement(con);
  return statement.executeQuery();
};

/**
 * 
 *
 * @param {Connection} con
 * @return {Int}
 */
Expr.prototype.executeUpdate = function(con)
{
  var statement = this.createPreparedStatement(con);
  return statement.executeUpdate();
};

/**
 * Sets the value of sql
 * 
 * @param {String} sql
 * @return {Expr}
 */
Expr.prototype.setSql = function(sql)
{
  this.sql = sql;
  return this;
};

/**
 * Gets the value of sql
 * 
 * @return {String}
 */
Expr.prototype.getSql = function()
{
  return this.sql;
};

/**
 * Sets the value of params
 * 
 * @param {Mixed[]} params
 * @return {Expr}
 */
Expr.prototype.setParams = function(params)
{
  this.params = params;
  return this;
};

/**
 * Gets the value of params
 * 
 * @return {Mixed[]}
 */
Expr.prototype.getParams = function()
{
  return this.params;
};

/**
 * Adds a param
 * 
 * @param {Mixed} param
 * @return {Expr}
 */
Expr.prototype.addParam = function(param)
{
  this.params.push(param);
  return this;
};

/**
 * The Expr destructor
 */
Expr.prototype.__destruct = function() {};

exports.Expr = Expr;
