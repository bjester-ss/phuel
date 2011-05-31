/* 
 * Author: Blaine Jester
 * Phuel Core
 * Date: 11/2/10
 *
 */
(function(Phuel,$,Ti,http){
	var global = this;
	
	var isN = Phuel.fn.isN;
	var locale = Phuel.fn.locale;
	var copy = Phuel.fn.copy;
	var scan = Phuel.fn.scan;
	var type = Phuel.fn.type;
	var json = Phuel.fn.json;
	
	try {
		var serialize = $.param;
		var url = require('url');
	}
	catch(e) {
		var serialize = false;
		var url = false;
		"Not node";
	}
	
	var Ajax = function(A){ return new Ajax.fn.__construct(A);};
	
	Ajax.fn = Ajax.prototype = {
		__construct:function(c){
			var me = this;
			
			if(!isN(c['type'])) {
				this.type = c.type;
			}
			copy(this,c,true);
			
			if((locale.titanium && this.type === 0) || this.type === 1) {
				this.xhr = Ti.Network.createHTTPClient();
				this.xhr.onload = function(err){
					clearInterval(me.interval);
					if(this.statusText != "success") {
						if(this.statusText == "abort" && me.aborted == true) { return;}
						me.on.error.call(me,this.statusText,this,err);
					}
					else {
						me.on.complete.call(me,this.responseText,this.statusText,this);
					}
				};
				this.xhr.onreadystatechange = function() {
					me.on.readystatechange.call(me,this.readyState,this);
				};
				
				this.type = 1;
			}
			else if((locale.jquery && this.type === 0) || this.type === 2) {
				this.type = 2;
			}
			else if((!locale.nodejs && this.type === 0) || this.type === 3) {
				var done = false;
				this.xhr = new XMLHttpRequest();
				this.xhr.onreadystatechange = function() {
					me.on.readystatechange.call(me,me.xhr.readyState,me.xhr);
					if(me.xhr.readyState == 4) {
						if(me.xhr.status == 200) {
							(isN(c['upload']) ? me.xhr.onload : me.xhr.upload.onload)();
						}
					}
					else {
					}
				};
				var set;
				if(!isN(c['upload'])) {
					set = this.xhr.upload;
					this.xhr.setRequestHeader("If-Modified-Since", "Mon, 26 Jul 1997 05:00:00 GMT");
					this.xhr.setRequestHeader("Cache-Control", "no-cache");
					this.xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
					this.xhr.setRequestHeader("Content-Type", "multipart/form-data");
				}
				else {
					set = this.xhr;
				}
				set.onprogress = function(e){
					me.on.progress.call(me,me.tick++,Math.round((e.loaded * 100) / e.total));
				};
				set.onload = function(e) {
					if(!done) {
						me.on.complete.call(me,me.xhr.responseText,me.xhr.statusText,me.xhr);
						done = true;
					}
				};
				set.onerror = function(e){
					me.on.error.call(me,me.xhr.statusText,me.xhr,e);
				};
				
				this.type = 3;
			}
			else {
				if(!isN(global['http'])) {
					this.type = 4;
				}
			}
		},
		xhr:"",
		type:0,
		url:"",
		method:"POST",
		async:true,
		cache:false,
		data:"",
		ret:"",
		
		aborted:false,
		interval:"",
		tick:0,
		properties:{
			version:"1.0.0"
		},
		send:function(d,op){
			var me = this;

			if(this.type === 1) {
				if(!isN(d['isFile'])) {
					if(d.isFile()) {
						if(!isN(op['params'])) {
							this.url += "?"+serialize(op.params);
						}
						this.on.start.call(this,d,this.url);
						this.xhr.open(this.method,this.url,this.async);
						if(!this.cache) {
							this.xhr.setRequestHeader("Cache-Control", "no-cache");
						}
						this.xhr.sendFile(d);
						this.interval = setInterval(function(){
							me.on.progress.call(me,me.tick++,25,me.tick*25/1000);
						},25);
					}
					else {
						this.on.error("Filesystem object to send is not a file!");
					}
				}
				else {
					if(type(d) == "object") {
						this.on.start.call(this,d,this.url);
						this.xhr.open(this.method,this.url,this.async);
						if(!this.cache) {
							this.xhr.setRequestHeader("Cache-Control", "no-cache");
						}
						this.xhr.send(d);
						this.interval = setInterval(function(){
							me.on.progress.call(me,me.tick++,25,me.tick*25/1000);
						},25);
					}
				}
			}
			else if(this.type == 2 && type(d) == "object") {
				this.xhr = $.ajax({
					url:this.url,
					type:this.method,
					async:this.async,
					cache:this.cache,
					data:d,
					success:function(d,ts,jqxhr){
						me.on.complete.call(me,data,ts,jqxhr);
					},
					error:function(jqxhr,ts,err){
						if(ts == "abort" && me.aborted == true) { return;}
						me.on.error.call(me,ts,jqxhr,err);
					},
					complete:function(){
						clearInterval(me.interval);
					}
				});
				this.interval = setInterval(function(){
					me.on.progress.call(me,me.tick++,25,me.tick*25/1000);
				},25);
				
			}
			else if(this.type == 3) {
				if(!isN(op['params'])) {
					var reader = new FileReader();
					this.url += "?"+serialize(op.params);
					this.xhr.setRequestHeader("X-File-Name", d.fileName);
					this.xhr.setRequestHeader("X-File-Size", d.fileSize);
					this.xhr.open(this.method,this.url,this.async);
					this.xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');
					reader.onload = function(evt) {
						me.xhr.sendAsBinary(evt.target.result);
					};
					reader.readAsBinaryString(d);
				}
				else {
					this.xhr.open(this.method,this.url,this.async);
					this.xhr.send(serialize(d));
				}
			}
			else if(this.type == 4) {
				var dub = url.parse(this.url);
				var ops = {
					host:dub.hostname,
					port:80,
					path:dub.pathname+dub.search,
					method:this.method
				};
				this.interval = setInterval(function(){
					me.on.progress.call(me,me.tick++,25,me.tick*25/1000);
				},25);
				this.xhr = http.request(ops);
				this.xhr.on('response',function(res){
					res.on('data',function(chunk){
						me.ret += chunk;
					});
					res.on('end',function(){
						clearInterval(me.interval);
						if(ts == "abort" && me.aborted == true) { return;}
						me.on.complete.call(me,me.ret,"unknown",res);
					});
				});
				this.xhr.end();
			}
			return this.xhr;
		},
		abort:function(){
			this.xhr.abort();
			this.aborted = true;
			return this.xhr;
		},
		on:{
			start:function(){},
			complete:function(){},
			error:function(){},
			progress:function(){},
			readystatechange:function(){}
		},
		type:"ajax",
		extend:function(A) {
			Phuel.fn.extend.call(this,A,true);
		},
		__destruct:function(A){
			delete this;
		}
	};
	
	Ajax.fn.__construct.prototype = Ajax.fn;
	Ajax.extend = Ajax.fn.extend;
	
	Phuel.fn.extend({
		ajax:Ajax
	});
	
})(Phuel,window['jQuery'],window['Titanium'],http);