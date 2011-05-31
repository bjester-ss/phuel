/* 
 * Author: Blaine Jester
 * Form Module -- Adds to Phuel Class
 * Date: 11/2/10
 *
 */
(function(Phuel){
	var Form = function(A){ return new Form.fn.__construct(A);};
	var form = {};
	
	Form.fn = Form.prototype = {
		__construct:function(A){

		},
		properties:{},
		extend:function(A) {
			Phuel.fn.extend.call(this,A,true);
		},
		__destruct:function(A){
			delete this;
		},
		type:"form"
	};
	
	Form.fn.__construct.prototype = Form.fn;
	Form.extend = Form.fn.extend;

	Phuel.fn.extend({
		form:Form
	});
	
})(Phuel);


/* 
 * Author: Blaine Jester
 * Url Module/Function -- Adds to Phuel Class
 * Date: 12/16/10
 * Works with: Browser, HTML5, Titanium
 */
(function(Phuel){
		  
	var isN = Phuel.fn.isN;
	
	var separate = function(M) {
		var ret = {};
		for(var i = 0; i < M.length; i++) {
			M[i] = M[i].split("=");
			ret[M[i][0]] = (isN(M[i][1]) ? "" : M[i][1]);
		}
		return ret;
	};
	
	if(!Phuel.fn.locale.nodejs) {
		var url = function(A){
			if(isN(A)) { 
				A = window.location.href;
			}
			var B = A.split("/")[2], C = A.split("?"), D = A.split("#");
			var ret = {
				domain:B,
				url:A,
				tld:B.split(".").pop(),
				secure:(A.indexOf("https://") >= 0),
				query:{},
				hash:{
					call:((D.length > 1)? (D[1].split("?")[0]) : ("")),
					query:{}
				},
				path:C[0].split("/").slice(3)
			};
			
			if(C.length > 1) {
				ret.query = separate(C[1].split("#")[0].split("&"));
			}
			if(C.length > 2 && D.length > 1) {
				ret.hash.query = separate(C[2].split("&"));
			}
			
			return ret;
		};
	}
	else {
		// TO DO
		// Create transfer interface for node
	}
	
	Phuel.fn.extend({
		url:url
	});
	
})(Phuel);

/* 
 * Author: Blaine Jester
 * Template Module -- Adds to Phuel Class and jQuery
 * Date: 11/2/10
 *
 */
(function(Phuel,jQuery){
	var cache = {};
	var tmpl = function(str, data){
		var fn = ((!/\W/.test(str)) ? (cache[str] = cache[str] ||
		tmpl(document.getElementById(str).innerHTML)) :
		(new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" + "with(obj){p.push('" + str
		.replace(/[\r\t\n]/g, " ")
		.split("<%").join("\t")
		.replace(/((^|%>)[^\t]*)'/g, "$1\r")
		.replace(/\t=(.*?)%>/g, "',$1,'")
		.split("\t").join("');")
		.split("%>").join("p.push('")
		.split("\r").join("\\'")
		+ "');}return p.join('');")));
		return data ? fn( data ) : fn;
	};
	
	Phuel.fn.extend({
		tmpl:tmpl
	});
	
	if(Phuel.fn.locale.jquery) {
		jQuery.fn.extend({
			tmpl:function(str, data){
				return ((!Phuel.fn.isN(data))?($(this).append(tmpl(str,data))):(tmpl(str)));
			}
		});
	}

})(Phuel,window['jQuery']);


/* 
 * Author: Blaine Jester
 * Cookie Module -- Adds to Phuel Class
 * Date: 11/2/10
 *
 */
(function(Phuel){
	var window = this;
	var isN = Phuel.fn.isN;
	var type = Phuel.fn.isN;
	
	var Cookie = function(nm) {
		return new Cookie.fn.__construct(nm);
	};
	
	Cookie.fn = Cookie.prototype = {
		__construct:function(N) {
			// {name:"",value:""||{},path:"",expiration:""||Date}
			this.properties.name = N;
			var arr = document.cookie.split(" "+N+"=");
			if(arr.length == 2) {
				this.properties.value = unescape(arr[1].split(";")[0]);
			}
			else {
				if(document.cookie.indexOf(N+"=") == 0) {
					this.properties.value = unescape(((document.cookie.split(N+"="))[1]).split(";")[0]);
				}
			}
			
		},
		properties:{
			name:"",
			value:"",
			path:"",
			expiration:""
		},
		val:function(A,B,C) {
			if(A != undefined) {
				document.cookie=this.properties.name+"="+escape(A)+";expires="+this.expire(B,true)+C;
			}
			else {
				return this.properties.value;
			}
		},
		expire:function(A,B){
			var expire;
			if(isN(A)) {
				expire = (new Date());
				expire.setMonth(expire.getMonth() + 6); 
				expire = expire.toGMTString();
			}
			else if(type(A) == "string") {
				expire = (new Date()).setTime(Date.parse(A));
				expire = expire.toGMTString();
			}
			else if(type(A) == "date") {
				expire = A.toGMTString();
			}
			if(!B) {
				document.cookie=this.properties.name+"="+this.properties.value+";expires="+expire+";";
			}
			return expire;
		},
		remove:function(){
			document.cookie = this.properties.name+"=DIS;expires=Thu, 1 Aug 2000 20:00:00 UTC;Path=/";
		},
		extend:function(A) {
			Phuel.fn.extend.call(this,A,true);
		},
		type:"cookie"
	};

	Cookie.fn.__construct.prototype = Cookie.fn;
	Cookie.extend = Cookie.fn.extend;
	
	Phuel.fn.extend({
		cookie:Cookie
	});

})(Phuel);

/* 
 * Author: Blaine Jester
 * Data Module for HTML 5 -- Adds to Phuel Class
 * Works with: Titanium
 * Date: 11/2/10
 *
 */
(function(Phuel){
	if(!Phuel.fn.locale.storage) {
		return;
	}
	var window = this;
	var isN = Phuel.fn.isN;
	var json = Phuel.fn.json;
	var type = Phuel.fn.type;
	
	var compile = function(A) {
		var B = {type:type(A),data:""};
		switch(B.type) {
			case 'string':
				A = A;
				break;
			case 'function':
				A = ((!isN(A['toString']))?(A.toString()):("function(){}"));
				break;
			case 'regexp':
				A = json.stringify({
					source:A.source,
					global:A.global,
					ignore:A.ignoreCase,
					multi:A.multiline
				});
				break;
			default:
				A = json.stringify(A);
				break;
		}
		B.data = A;
		return B;
	};
	
	var parse = function(A) {
		if(isN(A) && !isN(A['type'])) {return null;}
		switch(A.type) {
			case 'string':
				A = A.data;
				break;
			case 'function':
				A = eval(A.data);					
				break;
			case 'regexp':
				A = json.parse(A.data);
				var mods = ((A.global)?("g"):("")) + ((A.ignore)?("i"):("")) + ((A.multi)?("m"):(""));
				A =  new RegExp(A.source,mods);
				break;
			default:
				A = json.parse(A.data);
				break;
		}
		return A;
	};
	
	var Data = function(nm) {
		return new Data.fn.__construct(nm);
	};
	
	Data.fn = Data.prototype = {
		__construct:function(N) {
			// {key:"",hold:true,type:"session",value:""}
			for(var o in N) {
				this.properties[o] = N[o];
			}
			if(!isN(this.properties.value)) {
				this.stor(json.stringify(compile(this.properties.value)));
			}
			if(!this.properties.hold) {
				this.properties.value = null;
			}
		},
		stor:function(A){
			if(isN(A)) { return window[this.properties.type+"Storage"][this.properties.key];}
			window[this.properties.type+"Storage"][this.properties.key] = A;
		},
		properties:{
			key:"empty",
			value:null,
			type:"session",
			hold:true
		},
		val:function(A) {
			if(!isN(A)) {
				if(this.properties.hold) { this.properties.value = A; }
				this.stor(json.stringify(compile(A)));
				return this;
			}
			else {
				if(this.properties.hold) {
					return this.properties.value;
				}
				else {
					return parse(json.parse(this.stor()));
				}
			}
		},
		remove:function(){
			delete window[this.properties.type+"Storage"][this.properties.key];
		},
		extend:function(A) {
			Phuel.fn.extend.call(this,A,true);
		},
		type:"data",
		resolve:function(){
			return json.stringify(this.properties);
		}
	};

	Data.fn.__construct.prototype = Data.fn;
	Data.extend = Data.fn.extend;
	
	Phuel.fn.extend({
		data:Data
	});

})(Phuel);
