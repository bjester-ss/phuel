/* 
 * Author: Blaine Jester
 * Phuel Core
 * Created: 11/2/10
 * Last Edit: 5/23/11
 * Base of Phuel Core and System
 * Current Version: 1.1.2
 *  
 * Changelog
 * V 1.1.2 : Modified array sorting function to work correctly with number id's
 * V 1.1.1 : Changed parseVal to return NaN if no number is contained in the string
 * V 1.1.0 : Added NaN to isN definitions
 * V 1.0.9 : Developed advanced array sorting function
 * V 1.0.8 : Moved JSON dependent code from String Extensions to phuel.json
 * V 1.0.7 : Removed JSON from core file
 * V 1.0.6 : Added Crockford's JSON2 to JSON for non-native support (IE 7)
 *
 *
 */
(function(){
	// Give "this" a better name from within anonymous function, which is the global scope or everything in window.*
	var global = this;
	
	// Set up a function to return the new Object without the need to use the "new" keyword
	var Phuel = function(A){ 
		return new Phuel.fn.__construct(A);
	};
	
	// isN function checks to see if the arugment is Null, undefined, empty string (""), or false
	var isN = function(A) {
		// Safe to use try catch for undefined items
		try {
			var B = (A == undefined || A == null || A == "" || A == false || typeof A == "undefined" || A == NaN);
		}
		catch(e) {
			var B = true;
		}
		return B;
	};
	
	// Copy's data from object B to object A, recursively if D is true
	var copy = function(A,B,D) {
		if(isN(B)) { return A;}
		for(var k in B) {
			// Are we recursively copying if source is an object?
			if(!isN(D) && type(B[k]) == "object") {
				A[k] = copy({},B[k],true);
			}
			else {
				// Since no recurse and source is not an object
				if(type(B[k]) != "object") {
					// Copy normal
					A[k] = B[k];
				}
				else {
					// Since source was an object, set destination with string
					A[k] = "object";
				}
				
			}
		}
		return A;
	};
	
	// The standard data types in Javascript
	var standardTypes = "Boolean Number String Function Array Date RegExp Object";
	
	// Detect details or features of the locale
	var locale = {
		jquery:!isN(global['jQuery']), // Is jQuery available
		storage:!isN(global["localStorage"]), // Is the HTML5 storage object available, if true and titanium = false, we are in an HTML5 supporting browser
		console:!isN(global["console"]), // Is the console available
		titanium:!isN(global['Titanium']), // Are we in a Titanium app, if false, and nodejs is false, we are in a browser
		json:!isN(global['JSON']), // Is native JSON available
		nodejs:(!isN(global['Buffer']) && !isN(global['require'])), // Are we on a server running Node.js
		isIE:null // To be set, are we in IE
	};
	
	// Check the type of an object, or variable
	// New classes should create a "type" property, ex. MyObject.type = "myobject"
	var type = function(A) {
		return (isN(A)? "undefined" : ((isN(A['type'])) ?(types[Object.prototype.toString.call(A)]) :(A.type)));
	};
	
	// List of standard types, used by the type function
	var types = {};
	
	// Prototype of Phuel, with shorthand of "fn"
	Phuel.fn = Phuel.prototype = {
		__construct:function(A){
			// Do any initial construction of Phuel object
		},
		locale:locale, // Load locale data into Phuel
		properties:{
			version:"1.1.2" // Expose version of this file
		},
		isN:isN, // Load isN function
		type:type, // Load type function
		each:function(A,B){ // Custom Iterator, used possibly in place of loop
			// If object A is an array, get its length
			var length = A.length, brk = false;
			
			// Its not an array if length is undefined
			if(isN(length)) {
				// Use object for loop
				for(var o in A) {
					brk = B(o,A[o]); // Send data to function for operation
					if(brk){break;} // Stop if returned data from B is true
				}
			}
			else {
				// Loop through array
				for(var i = 0; i < length; i++) {
					brk = B(i,A[i]); // Send data to function for operation
					if(brk){break;} // Stop if returned data from B is true
				}
			}
		},
		extend:function(A,D) { // Extend/Add to Phuel object, as is customary operation for all additions
			var B = type(A), C = this;
			D = (isN(D) ? false : true);
			if(B == "object") { for(var op in A) { if(!C[op] || D) { C[op] = A[op];} }}
		},
		copy:copy, // Add copy to Phuel
		scan:function(A,B) { // Make an exact copy of an object
			return copy(copy({},A),B);
		},
		ping:function(A) {return A;}, // Ping function sends argument directly back
		__destruct:function(A){ // Create function to delete itself
			delete this;
		}
	};
	
	// Initialize the types object with the standard list
	Phuel.fn.each(standardTypes.split(" "), function(i, name) {
		types[ "[object " + name + "]" ] = name.toLowerCase();
	});
	
	// Set the object prototype correctly to work with the intializer function, for use without "new" keyword
	Phuel.fn.__construct.prototype = Phuel.fn;
	
	// Add ability to extend intialized Phuel object and not the prototype
	Phuel.extend = Phuel.fn.extend;
	
	// Expose
	this.Phuel = Phuel;
	
})();


/* 
 * Author: Blaine Jester
 * String Extensions -- Adds to Phuel Class & String Class
 * Date: 12/16/10
 * Works with: Browser, HTML5, Titanium, NodeJS
 */
(function(Phuel){
		  
	// Import the dependent functions from the core
	var isN = Phuel.fn.isN;
	var type = Phuel.fn.type;
	var ping = Phuel.fn.ping;
	var json = Phuel.fn.json;
	
	
	var returnVal = function() {
		return this.valueOf();
	}
	
	// Revision of native parseInt and parseFloat function, works with strings starting with 0
	var parseVal = function(val) {
		// Determine the context, with which the function is called
		if(isN(val) && type(this) == "string") {
			// Set string variable
			val = this;
		}
		
		// Loop while checking if first character is 0
		while (val.charAt(0) == '0' || isNaN(val.charAt(0))) {
			// Skip if we find a possible start to a float
			if(val.charAt(1) == ".") {
				break;
			}
			// Since we think we are at the start of a number, reset string val
			val = val.substring(1, val.length);
		}
		
		if (val == "") {
			// If there is nothing left in string, default to 0
			val = NaN;
		}
		else {
			// Now use native functions to pull out number
			val = (val.indexOf(".") >= 0 ? parseFloat(val) : parseInt(val));
		}
		
		// Return value
		return val;
	};
	
	// Find the next occurance search string or regexp starting at index "pos"
	var next = function(search,pos) {
		// Determine type of search
		if(type(search) == "string") {
			// Use native function to find the next occurance, since search is a string
			// Return the index
			return this.indexOf(search,pos);
		}
		else if(type(search) == "regexp") {
			// Temporarily create a substring to search for the next occurance of the search regexp
			var m = this.substring(pos).search(search);
			// Alter and return the index appropriately
			return (m >= 0 ? m+pos : m);
		}
		// Return a bad index if search is invalid
		return -1;
	};
	
	// Find the previous occurance search string or regexp starting at index "pos"
	var prev = function(search,pos) {
		var st = this.substring(0,pos).split("").reverse().join("");
		var m = this.next(search,0);
		return (m >= 0 ? pos-m : -1);
	};
	
	// Extend standard string object with functions
	String.prototype.parseVal = parseVal;
	String.prototype.next = next;
	String.prototype.prev = prev;
	
	// Extend Phuel prototype with parseVal function
	Phuel.fn.extend({
		parseVal:parseVal
	});
	
})(Phuel);

/* 
 * Author: Blaine Jester
 * Array Extensions -- Adds to Phuel Class & Array Class
 * Date: 5/21/11
 * Works with: Browser, HTML5, Titanium, NodeJS
 */
(function(Phuel){
		  
	// Import the dependent functions from the core
	var isN = Phuel.fn.isN;
	var type = Phuel.fn.type;
	var parseVal = Phuel.fn.parseVal;
	
	// SortBy function, dir = true means reverse
	var sortBy = function(by,dir) {
		// Check to make array has elements
		if(this.length >= 0) {
			// SortBy can sort an arrray that containes objects or arrays, as long as 'by' is defined
			if(type(this[0]) == "object" || "array") {
				// Is 'by' index defined
				if(!isN(this[0][by])) {
					// Sort the array appropriately
					return this.sort(function(a,b){
						// Are both values strings or numbers?
						if(isN(parseVal(a[by])) && type(a[by]) == type(b[by]) == "string") {
							// Easiest method for alphabetically sorting is using native array sort
							var chk = [a[by],b[by]].sort();
							// Reverse if its asked
							chk = (isN(dir) ? chk : chk.reverse());
							// Return a value depending which value should come first, -1 means a before b
							return (chk[0] == a[by] ? -1 : 1);
						}
						else if(!isN(parseVal(a[by])) && type(parseVal(a[by])) == type(parseVal(b[by])) == "number") {
							// a before b if its negative
							return (isN(dir) ? a[by] - b[by] : b[by] - a[by]);
						}
					});
				}
			}
			else if(type(this[0]) == "string") {
				// If array is normal, sort normal
				return (isN(dir) ? this.sort() : this.sort().reverse());
			}
		}
		return this;
	};
	
	// Extend standard array object with function
	Array.prototype.sortBy = sortBy;
	
	// Extend Phuel prototype with parseVal function
	Phuel.fn.extend({
		sortBy:function(ob,by,dir) {
			return sortBy.call(ob,by,dir);
		}
	});
	
	this.sortByTest = [{name:"apple"},{name:"Aa"},{name:"Az"},{name:"Bob"},{name:"bath"},{name:"bz"},{name:"qu"},{name:"za"}];
	
})(Phuel);