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
			if(!isN(A)) {
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