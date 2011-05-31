/* 
 * Author: Blaine Jester
 * Interpreter
 * Date: 2/25/11
 *
 */
(function(Phuel,$,Ti){
	var global = this;
	
	var isN = Phuel.fn.isN;
	var locale = Phuel.fn.locale;
	var copy = Phuel.fn.copy;
	var scan = Phuel.fn.scan;
	var type = Phuel.fn.type;
	
	var parsers = {
		"import":{
			parse:function(A) {
				if(A[0] == "js") {
					A[1] = this.escape(A[1].split(".").join("/"));
					return '<script type="text/javascript" src="'+A[1]+'"></script>';
				}
				else if(A[0] == "css") {
					A[1] = this.escape(A[1].split(".").join("/"));
					return '<link rel="stylesheet" type="text/css" href="'+A[1]+'" />';
				}
			}
		},
		"tag":{
			parse:function(A) {
				if(A[0] == "js") {
					A[1] = this.escape(A[1].split(".").join("/"));
					return '<script type="text/javascript" src="'+A[1]+'"></script>';
				}
				else if(A[0] == "css") {
					A[1] = this.escape(A[1].split(".").join("/"));
					return '<link rel="stylesheet" type="text/css" href="'+A[1]+'" />';
				}
			}
		}
	};
	
	var peel = function(arr,ch,re){
		for(var i = 1; i < arr.length; i+=2) {
			arr[i] = arr[i].split(ch).join(re);
		}
		return arr;
	};
	
	var parse = function(str) {
		var out = [];
		str = str.replace(/[\r\t\n]/g,"").split(";");
		for(var st, i = 0; i < str.length; i++) {
			st = peel(str[i].split('"')," ","nbsp;").join('"').split(" ");
			if(st[0][0] == "!") {
				
			}
			else if(st[0][0] == "@") {
				
			}
			else {
				if(!isN(parsers[st[0]])) {
					out[i] = parsers[st[0]].parse.call(this,st.slice(1));
				}
				else {
					out[i] = "<!-- Missing Parser: "+st[0]+" -->";
				}
			}
		}
	};
	
	var Interpreter = function(A){ return new Interpreter.fn.__construct(A);};
	
	Interpreter.fn = Interpreter.prototype = {
		__construct:function(c){
			copy(this.variables,c);
		},
		properties:{
			version:"1.0.0"
		},
		variables:{
			"REPO":"http://repo.phiosdev.com",
		},
		parse:function(src,dest){
			var ty = type(src);
			switch(ty) {
				case "string":
					dest = parse.call(this,src);
					break;
				case "object":
			}
			return dest;
		},
		escape:function(A){
			var out = A;
			for(var k in this.variables) {
				out = out.split(k).join(this.variables[k]);
			}
			return out;
		},
		addParser:function(A){},
		extend:function(A) {
			Phuel.fn.extend.call(this,A,true);
		},
		__destruct:function(A){
			delete this;
		}
	};
	
	Interpreter.fn.__construct.prototype = Interpreter.fn;
	Interpreter.extend = Interpreter.fn.extend;
	
	Phuel.fn.extend({
		interpreter:Interpreter
	});
	
})(Phuel,window['jQuery'],window['Titanium']);