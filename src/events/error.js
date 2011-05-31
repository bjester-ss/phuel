/* 
 * Author: Blaine Jester
 * Error
 * Created: 5/20/11
 * Last Edit: 5/20/11
 * Error Class, used to return an error with specific information
 * Current Version: 1.0.0
 *  
 * Changelog 
 * V 1.0.4 : TBD
 * V 1.0.3 : TBD
 * V 1.0.2 : TBD
 * V 1.0.1 : TBD
 * V 1.0.0 : Initial Development
 */
(function(Phuel){
	var global = this;
	var isN = Phuel.fn.isN;
	var locale = Phuel.fn.locale;
	var type = Phuel.fn.type;
		
	var Error = function(msg,details,status,location,severity){ return new Error.fn.__construct(msg,details,status,location,severity);};
	
	Error.fn = Error.prototype = {
		__construct:function(msg,details,status,location,severity){
			this.message = msg;
			this.details = details;
			this.status = status;
			this.location = location;
			this.severity = severity;
			
			if(!isN(console)) {
				console.log("PHUEL ERROR",this);
			}
		},
		message:"Error",
		severity:"None",
		status:"Unknown",
		details:"Error",
		location:"Phuel.error.location",
		extend:function(A) {
			Phuel.fn.extend.call(this,A,true);
		},
		__destruct:function(A){
			delete this;
		},
		type:"error"
	};
	
	Error.fn.__construct.prototype = Error.fn;
	Error.extend = Error.fn.extend;

	Phuel.fn.extend({
		error:Error
	});
	
})(Phuel);