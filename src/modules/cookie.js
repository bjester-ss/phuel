/* 
 * Author: Blaine Jester
 * Cookie Module -- Adds to Phuel Class
 * Date: 11/2/10
 * Last Edit: 5/31/2011
 *
 */
(function(Phuel){
	var window = this;
	var isN = Phuel.fn.isN;
	var type = Phuel.fn.isN;
	var locale = Phuel.fn.locale;
	
	var Cookie = function(nm) {
		return new Cookie.fn.__construct(name,response);
	};
	
	Cookie.fn = Cookie.prototype = {
		__construct:function(name,response) {
			
			this.properties.name = name;
			var src = (locale.nodejs ? response.getHeader("Set-Cookie").join(";~ ") : document.cookie);
			this._response = response;
			
			var arr = src.split(" "+name+"=");
			if(arr.length == 2) {
				this.properties.value = unescape(arr[1].split(";")[0]);
			}
			else {
				if(src.indexOf(name+"=") == 0) {
					this.properties.value = unescape(((src.split(name+"="))[1]).split(";")[0]);
				}
			
			}
		},
		_response:"",
		properties:{
			name:"",
			value:"",
			path:"",
			expiration:""
		},
		val:function(A,B,C) {
			if(!isN(A)) {
				if(locale.nodejs) {
					var pos, src = this._response.getHeader("Set-Cookie").join(";~ ");
					if(pos = src.indexOf(";~ "+this.properties.name+"=") >= 0) {
						this._response.setHeader("Set-Cookie",(src.substring(0,src.next("=",pos)+1)+escape(A)+src.substr(src.next(";~ ",pos)) ).split(";~ "));
					}
					else {
						this._response.setHeader("Set-Cookie",this._response.getHeader("Set-Cookie").push(this.properties.name+"="+escape(A)))
					}
				}
				else {
					document.cookie=this.properties.name+"="+escape(A)+";expires="+this.expire(B,true)+C;
				}
				this.properties.value = A;
			}
			else {
				return this.properties.value;
			}
		},
		expire:function(A,B){
			var expire;
			if(locale.nodejs) return;
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
			return this.properties.expiration = expire;
		},
		remove:function(){
			if(locale.nodejs) {
				var pos, src = this._response.getHeader("Set-Cookie").join(";~ ");
				if(pos = src.indexOf(";~ "+this.properties.name+"=") >= 0) {
					this._response.setHeader("Set-Cookie",(src.substring(0,src.prev(";~ ",pos))+src.substr(src.next(";~ ",pos)) ).split(";~ "));
				}
			}
			else {
				document.cookie = this.properties.name+"=DIS;expires=Thu, 1 Aug 2000 20:00:00 UTC;Path=/";
			}
			
		},
		extend:function(A) {
			Phuel.fn.extend.call(this,A,true);
		},
		toJSON:function(){
			return "~"+this.type+"("+this.properties.name+")";
		},
		type:"cookie"
	};

	Cookie.fn.__construct.prototype = Cookie.fn;
	Cookie.extend = Cookie.fn.extend;
	
	Phuel.fn.extend({
		cookie:Cookie
	});

})(Phuel);