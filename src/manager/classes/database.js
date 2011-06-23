/* 
 * Author: Blaine Jester
 * Database
 * Created: 2/27/11
 * Last Edit: 5/21/11
 * Database and DatabaseResult
 * Current Version: 1.0.0
 *  
 * Changelog 
 * V 1.0.4 : TBD
 * V 1.0.3 : TBD
 * V 1.0.2 : TBD
 * V 1.0.1 : TBD
 * V 1.0.0 : Initial Development
 */
(function(Phuel,$,Ti){
	// Give "this" a better name from within anonymous function, which is the global scope or everything in window.*
	var global = this;
	
	// Import dependents
	var isN = Phuel.fn.isN;
	var locale = Phuel.fn.locale;
	var copy = Phuel.fn.copy;
	var type = Phuel.fn.type;
	
	
	var open = {}; // Literal of open databases
	var results = new Array(); // Array of result objects
	var resources = new Array(); // Array of result resources
	var cache = {}; // Literal of cached items for fast access, mostly used for just Titanium
	
	// Function to create and return object, without need to use word "new"
	var DatabaseResult = function(A,b,c,d){ 
		return new DatabaseResult.fn.__construct(A,b,c,d);
	};
	
	// Specify prototype of Db result
	DatabaseResult.fn = DatabaseResult.prototype = {
		__construct:function(rc,id,db,ti){
			this.db = db; // Reference to db that the result is from
			this.id = id; // The results id (index in results array)
			this.ti = ti; // Boolean if we are using Titanium db
			
			// Depending on db type, we set values appropriately
			if(this.ti) {
				this.rowsAffected = db.rowsAffected;
				this.insertID = db.lastInsertRowId;
				this.rows = rc.rowCount();
			}
			else {
				this.rowsAffected = rc.rowsAffected;
				this.insertID = rc.insertId;
				this.rows = rc.rows.length;
			}
			
			// Build a fields array, for easy access
			var n = new Array();
			if(this.rows >= 1) {
				if(this.ti) {
					for(var i = 0; i < rc.fieldCount(); i++) {
						n.push(rc.fieldName(i));
					}
				}
				else {
					var p = rc.rows.item(0);
					for(var k in p) {
						n.push(k);
					}
				}
			}
			this.fields = n; // Set fields array publicly in result object
			cache["_"+this.id] = new Array(); // Set up some workspace in the cache
		},
		db:"", // Db reference
		id:-1, // Result id
		ti:true, // Boolean whether using Titanium
		insertID:-1, // If data was inserted, this will have its new id
		rowsAffected:-1, // Rows affected by db query
		rows:0, // Quantity of returned rows by query
		fields:"", // Array of the fields, if any in result rows
		properties:{
			version:"1.0.0"
		},
		each:function(f){ // Execute a function over the result
			// Storage of non-true data returned from 'f' function
			var ret = new Array();
			
			for(var i = 0; i <  this.rows; i++) {
				// Call the function, in scope of result data, pass the index and the DbResult object also
				var stop = f.call(this.fetch(i),i,this);
				// Dont do anything will returned data unless its defined
				if(!isN(stop)) {
					// Stop the loop if 'true' was returned
					if(stop === true) {
						break;
					}
					else {
						// Push the returned data into array
						ret.push(stop);
					}
				}
			}
			// Return any data.  This can force the function to be called synchronously if the callee is waiting for returned data (no callback functions)
			return ret;
		},
		fetch:function(i){ // Fetch a row of data from result
			if(i >= this.rows) {return null;}  // Is the row index defined
			if(this.ti) { // Are we in Titanium Db
				// Since its Titanium, we must cache any rows pulled out.
				// They arent accessible through the resource after they have been accessed
				// So we must cache them, in case of access later
				while(cache["_"+this.id].length <= i) {
					this._pull();
				}
				// Return it
				return cache["_"+this.id][i];
			}
			else {
				return resources[this.id].rows.item(i); // Easy return of data from browser db
			}
		},
		fetchAll:function(){
			if(this.ti) {
				
				if(cache["_"+this.id].length == this.rows) {
					// If cache contains all of result rows, return it
					return cache["_"+this.id];
				}
				else {
					// If not, then we just call fetch for the last row in the set, which fills the cache
					this.fetch(this.rows - 1);
					return cache["_"+this.id];
				}
			}
			// For browser db we must create a set of the rows at call time
			var ret = new Array();
			for(var i = 0; i <  this.rows; i++) {
				// Push each row into array
				ret.push(resources[this.id].rows.item(i));
			}
			return ret;
		},
		release:function(){
			// Release this result, deletes results[id] and resources[id]
			this.db.releaseResult(this.id);
		},
		_pull:function(){
			// This is only used in Titanium DB
			// Extracts row data into object literal
			var k = {};
			for(var j = 0; j < this.fields.length; j++) {
				k[this.fields[j]] = resources[this.id].field(j);
			}
			// Cache the row
			cache["_"+this.id].push(k);
			// Move to next row (get ready for next)
			resources[this.id].next();
			return k;
		},
		_release:function(){
			if(this.ti) {
				// For Titanium we can close the resource, in browser db we just delete reference and let garbage collector work
				resources[this.id].close();
			}
			// Delete reference
			delete resources[this.id];
		},
		extend:function(A) {
			Phuel.fn.extend.call(this,A,true);
		},
		__destruct:function(A){
			delete this;
		},
		type:"databaseResult"
	};
	
	DatabaseResult.fn.__construct.prototype = DatabaseResult.fn;
	DatabaseResult.extend = DatabaseResult.fn.extend;
	
	// -----------------------------------------------------------------------
	
	// Start DB Def
	
	// -----------------------------------------------------------------------
	var Database = function(A,b){ return new Database.fn.__construct(A,b);};
	
	Database.fn = Database.prototype = {
		__construct:function(name,ops){
			// Copy options
			copy(this,ops);
			// Databases have names
			this.name = name;
			
			if(locale.titanium && this.ti) {
				// Remove any "." in the name
				if(name.indexOf(".") >= 0) { this.name = name.replace(/\./,"_"); }
				
				// Make sure the db is not open
				if(isN(open[name])) {
					// Titanium can open a version of its HTML5 db or a sqlite
					if(this.html5) {
						open[name] = Ti.Database.open(name); // Ti HTML5
					}
					else {
						open[name] = Ti.Database.openFile(Ti.Filesystem.getApplicationDataDirectory()+"\\"+name+".db"); // SQLite
					}
				}
			}
			else {
				if(!isN(global['openDatabase'])) {
					// If we can open a browser db, then check if its open already
					if(isN(open[name])) {
						// Open the brower db (Current support is Webkit (Chrome & Safari))
						open[name] = global.openDatabase(name,"1.0",this.description,this.size);
					}
				}
				else {
					// Problems :(
					this.name = "error";
					this.fault = true;
				}
			}
		},
		name:"", // DB Name
		size:1024*1024*20, // Size of the DB
		description:"New Database", // Description
		html5:true, // Do we want a Titanium HTML5 db
		ti:true, // Do we want a Titanium db
		fault:false, // Is there a problem
		properties:{
			version:"1.0.0"
		},
		lastQuery:"", // Last executed query
		execute:function(qu,arr,cb){
			// Get reference for Db
			var db = open[this.name];
			// Determine arguements types, and set appropriately
			cb = (type(arr) == "function" ? arr : (isN(cb) ? Phuel.fn.ping : cb));
			arr = (type(arr) == "array" ? arr : new Array());
			
			// Set the last query, as this query
			this.lastQuery = qu;
			if(this.ti) {
				// Notice in Titanium all queries are synchronous!
				// To maintain best compatibility, and execute in Titanium, we must use query applied to execute with any additional parameters in "arr"
				var rc = db.execute.apply(db,([qu]).concat(arr));
				// Create the result
				var res = DatabaseResult(rc,resources.push(rc)-1,this,true);
				// Execute the callback
				return cb.call(res,results.push(res)-1);	
			}
			else {
				// Browser db is accessed asynchrously (standardly) and is standard to javascripts event nature (callbacks)
				var me = this;
				// Start the communication with the db
				db.transaction(function(tx){
					// Execute the query on the db
					tx.execute(qu,arr,function(tx,result){
						// Query executed, create the result
						var res = DatabaseResult(result,resources.push(result)-1,me,false);
						// Call the callback
						cb.call(res,results.push(res)-1);
					},me.error);
				});
			}
			return this;
		},
		executeJSON:function(qu,jso){
			// TBD
			if(qu.indexOf("INSERT") >= 0) {
				
			}
			else if(qu.indexOf("UPDATE") >= 0) {
			}
		},
		results:function(id,cb) {
			// Execute a function on a past result
			if(id < results.length) {
				return cb.call(results[id],this);
			}
			return null;
		},
		debug:function(id){ return results[id];},
		releaseResult:function(id) {
			// Called from DbResult.release
			results[id]._release();
			delete results[id];
		},
		"export":function(){},
		extend:function(A) {
			Phuel.fn.extend.call(this,A,true);
		},
		__destruct:function(A){
			delete this;
		},
		type:"database"
	};
	
	Database.fn.__construct.prototype = Database.fn;
	Database.extend = Database.fn.extend;
	
	// Extend Phuel with the beautiful objects
	Phuel.fn.extend({
		database:Database,
		databaseResult:DatabaseResult
	});
	
})(Phuel,window['jQuery'],window['Titanium']);
