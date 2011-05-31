/* 
 * Author: Blaine Jester
 * Site Class -- Adds to Phuel Class
 * Works with: HTML5, Titanium
 * Date: 11/2/10
 *
 */
(function(Phuel){
	var window = this;
	var isN = Phuel.fn.isN;
	var json = Phuel.fn.json;
	var type = Phuel.fn.type;
	
	var Site = function(nm) {
		return new Site.fn.__construct(nm);
	};
	
	Site.fn = Site.prototype = {
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
		properties:{
			name:"Phios Development",
			domain:"phiosdev.com",
			pages:0,
			type:"static",
			key:"000",
			schema:{
				id:"number",
				sid:"string",
				name:"string",
				title:"string",
				head:"string || object",
				content:"string || object",
				type:"string || object",
				updated:"date",
				accessed:"date"
			}
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

	Site.fn.__construct.prototype = Site.fn;
	Site.extend = Site.fn.extend;
	
	Phuel.fn.extend({
		site:Site
	});

})(Phuel);