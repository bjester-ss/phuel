/* 
 * Author: Blaine Jester
 * Phuel Core
 * Created: 11/2/10
 * Last Edit: 6/28/11
 * Base of Phuel Core and System
 * Current Version: 1.1.3
 *  
 * Changelog
 * V 1.1.6 : Added 'unique' array function
 * V 1.1.5 : Added 'trim' string function
 * V 1.1.4 : Added 'type' property to jQuery
 * V 1.1.3 : Added 'last' array proto function
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
	var Phuel = function(blank){
        /// <summary>Phuel Constructor Reference Function</summary>
        /// <param name="blank" type="*">Blank (not currently used)</param>
        /// <returns type="phuel">Returns a new Phuel object</returns>
		return new Phuel.fn.__construct(blank);
	};
	
	// isN function checks to see if the arugment is Null, undefined, empty string (""), or false
	var isN = function(isItNull) {
		/// <summary>Is it Null function, includes "",false, and NaN</summary>
        /// <param name="isItNull" type="*">isItNull</param>
        /// <returns type="boolean">Returns whether or not item is NULL</returns>
		try {
		    var B = (isItNull == undefined || isItNull == null || isItNull == "" || isItNull == false || typeof isItNull == "undefined" || isItNull == NaN);
		}
		catch(e) {
			var B = true;
		}
		return B;
	};
	
	var copy = function(to,from,recurse) {
        /// <summary>Copies data from one object to another</summary>
        /// <param name="to" type="object">Object to copy to</param>
        /// <param name="from" type="object">Object to copy from</param>
        /// <param name="recurse" type="boolean" optional="true">Boolean whether to recurse</param>
        /// <returns type="object">Returns original 'to' object</returns>
		if(isN(from)) { return to;}
		for(var k in from) {
		    // Are we recursively copying if source is an object?
			if(!isN(recurse) && type(from[k]) == "object") {
				to[k] = copy({},from[k],true);
			}
			else {
				// Since no recurse and source is not an object
				if(type(from[k]) != "object") {
					// Copy normal
					to[k] = from[k];
				}
				else {
					// Since source was an object, set destination with string
					to[k] = "object";
				}
				
			}
		}
		return to;
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
	var type = function(multiType) {
        /// <summary>Determines the type of the item</summary>
        /// <param name="multiType" type="*">Item to determine its type</param>
        /// <returns type="string">Returns string of type</returns>
	    return (isN(multiType) ? "undefined" : ((isN(multiType['type'])) ? (types[Object.prototype.toString.call(multiType)]) : (multiType.type)));
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
			version:"1.1.6" // Expose version of this file
		},
		isN:isN, // Load isN function
		type:type, // Load type function
		each:function(object,iterator){ // Custom Iterator, used possibly in place of loop
            /// <summary>Interates over object using iterator function</summary>
            /// <param name="object" type="object || array">Object or array to iterate over</param>
            /// <param name="iterator" type="function">The iterator function</param>
            /// <returns type="void"></returns>
			// If object A is an array, get its length
		    var length = object.length, brk = false;
			
			// Its not an array if length is undefined
			if(isN(length)) {
				// Use object for loop
			    for (var o in object) {
			        brk = iterator(o, object[o]); // Send data to function for operation
					if(brk){break;} // Stop if returned data from B is true
				}
			}
			else {
				// Loop through array
				for(var i = 0; i < length; i++) {
				    brk = iterator(i, object[i]); // Send data to function for operation
					if(brk){break;} // Stop if returned data from B is true
				}
			}
		},
		extend:function(extender,overwrite) { // Extend/Add to Phuel object, as is customary operation for all additions
            /// <summary>Extends an object, similar to copy</summary>
            /// <param name="extender" type="object">Object literal to iterate over and extend</param>
            /// <param name="overwrite" type="boolean" optional="true">Whether or not to overwrite name if its allocated</param>
            /// <returns type="void"></returns>
		    var B = type(extender), C = this;
		    overwrite = (isN(overwrite) ? false : true);
		    if (B == "object") { for (var op in extender) { if (!C[op] || overwrite) { C[op] = extender[op]; } } }
		},
		copy:copy, // Add copy to Phuel
		scan: function (paper, addition) { // Make an exact copy of an object
            /// <summary>Scans an object and returns an exact copy, with any additions</summary>
            /// <param name="paper" type="object">Object to scan</param>
            /// <param name="addition" type="object" optional="true">Object to copy onto scanned copy</param>
            /// <returns type="object">Returns the scanned copy with any additions</returns>
			return copy(copy({},paper),addition);
		},
		ping:function(ret) {return ret;}, // Ping function sends argument directly back
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
	global.Phuel = Phuel;
	
	// Add a type to jQuery, most likely overwrites type function of jQuery >= 1.4.3
	if(locale.jquery) {
		global.jQuery.fn.extend({type:"jquery"});
	}
})();


/* 
 * Author: Blaine Jester
 * String Extensions -- Adds to Phuel Class & String Class
 * Date: 12/16/10
 * Works with: Browser, HTML5, Titanium, NodeJS
 */
(function(){
		  
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
        /// <summary>Parses the numerical value of a string</summary>
        /// <param name="val" type="string" optional="true">String to parse, defaults to this when this is a string</param>
        /// <returns type="number">Returns the parsed value</returns>
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
        /// <summary>Searches for the next occurance of search in string</summary>
        /// <param name="search" type="string || regexp">The search string or regex</param>
        /// <param name="pos" type="number" optional="true">Starting index position, defaults to 0</param>
        /// <returns type="number">Returns the index</returns>
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
        /// <summary>Searches for the previous occurance of search in string</summary>
        /// <param name="search" type="string || regexp">The search string or regex</param>
        /// <param name="pos" type="number>Starting index position</param>
        /// <returns type="number">Returns the index</returns>
		var st = this.substring(0,pos).split("").reverse().join("");
		var m = this.next(search,0);
		return (m >= 0 ? pos-m : -1);
	};
	
	// Trims whitespace before and after string
	var trim = function(str) {
        /// <summary>Trims whitespace from before and after string</summary>
        /// <param name="str" type="string" optional="true">The search to trim, defaults to this</param>
        /// <returns type="string">Returns the trimmed string</returns>
		return (isN(str) ? this : str).replace(/^\s*(.*?)\s*$/,"$1");
	};
	
	if(isN(String.prototype["trim"])) {
		String.prototype.trim = trim;
	}
	
	// Extend standard string object with functions
	String.prototype.parseVal = parseVal;
	String.prototype.next = next;
	String.prototype.prev = prev;
	
	// Extend Phuel prototype with parseVal function
	Phuel.fn.extend({
		parseVal:parseVal
	});
	
})();

/* 
 * Author: Blaine Jester
 * Array Extensions -- Adds to Phuel Class & Array Class
 * Date: 5/21/11
 * Works with: Browser, HTML5, Titanium, NodeJS
 */
(function(){
		  
	// Import the dependent functions from the core
	var isN = Phuel.fn.isN;
	var type = Phuel.fn.type;
	var parseVal = Phuel.fn.parseVal;
	
	// SortBy function, dir = true means reverse
	var sortBy = function(sortBy,direction) {
        /// <summary>Sorts the array, including when elements are objects</summary>
        /// <param name="sortBy" type="string">The property to sort the objects by</param>
        /// <param name="direction" type="boolean" optional="true">The sort direction, defaults to false (meaning increasing)</param>
        /// <returns type="string">Returns the sorted array</returns>
		// Check to make array has elements
		if(this.length >= 0) {
			// SortBy can sort an arrray that containes objects or arrays, as long as 'by' is defined
			if(type(this[0]) == "object" || "array") {
				// Is 'by' index defined
				if(!isN(this[0][sortBy])) {
					// Sort the array appropriately
					return this.sort(function(a,b){
						// Are both values strings or numbers?
						if(isN(parseVal(a[sortBy])) && type(a[sortBy]) == type(b[sortBy]) == "string") {
							// Easiest method for alphabetically sorting is using native array sort
							var chk = [a[sortBy],b[sortBy]].sort();
							// Reverse if its asked
							chk = (isN(direction) ? chk : chk.reverse());
							// Return a value depending which value should come first, -1 means a before b
							return (chk[0] == a[sortBy] ? -1 : 1);
						}
						else if(!isN(parseVal(a[sortBy])) && type(parseVal(a[sortBy])) == type(parseVal(b[sortBy])) == "number") {
							// a before b if its negative
							return (isN(direction) ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]);
						}
					});
				}
			}
			else if(type(this[0]) == "string") {
				// If array is normal, sort normal
				return (isN(direction) ? this.sort() : this.sort().reverse());
			}
		}
		return this;
	};
	
	// Easily return the last item of the array
	var last = function() {
        /// <summary>Gets the last element in the array</summary>
        /// <returns type="*">Returns the element</returns>
		return this[this.length - 1];
	};
	
	// Array Unique Function
	var unique = function(arr){
        /// <summary>Cleans the array, removing duplicate elements</summary>
        /// <param name="arr" type="array" optional="true">The array to make unique, defaults to this</param>
        /// <returns type="array">Returns the unique array</returns>
		arr = (isN(arr) ? this : arr).sort();
		var  len = arr.length, nw = (len >= 1 ? [arr[0]] : []);
		for(var i = 1; i < len; i++) {
			if(nw.last() != arr[i]) {
				nw.push(arr[i]);
			}
		}
		return nw;
	};
	
	// Extend standard array object with function
	Array.prototype.sortBy = sortBy;
	Array.prototype.last = last;
	Array.prototype.unique = unique;
	
	// Extend Phuel prototype with parseVal function
	Phuel.fn.extend({
		sortBy:function(toSort,sortBy,direction) {
			return sortBy.call(toSort,sortBy,direction);
		}
	});
	
	this.sortByTest = [{name:"apple"},{name:"Aa"},{name:"Az"},{name:"Bob"},{name:"bath"},{name:"bz"},{name:"qu"},{name:"za"}];
	
})();
