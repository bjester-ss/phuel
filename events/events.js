/* 
 * Author: Blaine Jester
 * Hash Listener Class -- Adds to Phuel.Events Class
 * Works with: HTML
 * Date: 11/2/10
 * Requires: Data, Cookie, Interface
 *
 */
(function(Phuel){
	var window = this;
	var isN = Phuel.fn.isN;
	var json = Phuel.fn.json;
	var location = Phuel.fn.url;
	var scan = Phuel.fn.scan;
	
	var key = 0;
	var Private = {};
	var binding = {
		onOpen:function(){return true;},
		onUpdate:function(){return true;},
		onClose:function(){return true;}
	};
	
	var joinObj = function(A) {
		var ret = "";
		for(var o in A) {
			ret += (o+"="+json.stringify(A[o])+"&");
		}
		return ret.substring(0,ret.length-1);
	};
	
	var HashListener = function(nm) {
		return new HashListener.fn.__construct(nm);
	};
	
	HashListener.fn = HashListener.prototype = {
		__construct:function(N) {
			// {launch:false,timing:100,bindings:{}}
			this.key = "hash"+key;
			key++;
			var loca = location();
			var priv = Private[this.key] = {
				launch:false,
				timing:100,
				bindings:{},
				history:(new Array()),
				interval:"",
				previous:loca.hash,
				current:{call:"",query:{}},
				next:"",
				fault:false,
				phash:"",
				chash:"",
				nhash:""
			};
			priv = Private[this.key] = scan(priv,N);
			Phuel.fn.each(priv.bindings,function(i,el) {
				priv.bindings[i] = scan(binding,el);
			});
			if(!priv.launch) {
				priv.chash = window.location.hash;
				priv.current = loca.hash;
			}
			priv.interval = window.setInterval(function(){
				if(priv.chash != window.location.hash) {
					var loc = location();
					if(priv.current.call == loc.hash.call) {
						if(!isN(priv.bindings[priv.current.call])) {
							if(priv.bindings[priv.current.call].onUpdate(loc.hash.query)) {
								priv.history.push(priv.current);
								priv.previous = priv.current;
								priv.current = loc.hash;
								priv.chash = window.location.hash;
							}
							else {
								//priv.fault = true;
								window.location.hash = priv.chash;
							}
						}
					}
					else {
						if(!isN(priv.bindings[priv.current.call])) {
							if(priv.bindings[priv.current.call].onClose(priv.current.query,loc.hash.query)) {
								if(!isN(priv.bindings[loc.hash.call])) {
									priv.bindings[loc.hash.call].onOpen(loc.hash.query);
								}
								priv.history.push(priv.current);
								priv.previous = priv.current;
								priv.current = loc.hash;
								priv.chash = window.location.hash;
							}
							else {
								window.location.hash = priv.chash;
							}
						}

					}
				}
				
			},priv.timing);
		},
		key:"",
		bind:function(K,A){
			if(isN(Private[this.key].bindings[K])) {
				Private[this.key].bindings[K] = scan(binding,A);
			}
		},
		unbind:function(K){
			delete Private[this.key].bindings[K];
		},
		trigger:function(A,B){
			window.location.hash = "#"+A+"?"+joinObj(B);
		},
		remove:function(){
			window.clearInterval(Private[this.key].interval);
			delete Private[this.key];
		},
		extend:function(A) {
			Phuel.fn.extend.call(this,A,true);
		},
		debug:function(){ return Private[this.key];},
		type:"hashListener"
	};

	HashListener.fn.__construct.prototype = HashListener.fn;
	HashListener.extend = HashListener.fn.extend;
	
	Phuel.fn.extend({
		hashListener:HashListener
	});

})(Phuel);