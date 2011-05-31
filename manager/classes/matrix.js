/* 
 * Author: Blaine Jester
 * Matrix
 * Created: 1/20/11
 * Last Edit: 5/20/11
 * Matrix Class, used to dynamically create menus and block layouts
 * Requires: Array Extensions
 * Current Version: 1.0.0
 *  
 * Changelog 
 * V 1.0.4 : TBD
 * V 1.0.3 : TBD
 * V 1.0.2 : TBD
 * V 1.0.1 : TBD
 * V 1.0.0 : Initial Development
 */
(function(Phuel,$){
	var global = this;
	var isN = Phuel.fn.isN;
	var copy = Phuel.fn.copy;
	var scan = Phuel.fn.scan;
	var type = Phuel.fn.type;
	
	var $default = {
		type:"menu",
		align:"vertical",
		asIs:true,
		sort:"name",
		reverse:false
	};
	
	var templates = {
		menu:function(a,b){
			var me = this;
			$(this.elements).empty();
			a = (isN(a) ? "matrix-menu-item" : a);
			for(var i = 0; i < this.source.length; i++) {
				var nw = $(global.document.createElement("div"))
							.attr({id:"matrix-"+this.id+"-"+i,class:a})
							.html((isN(b) ? this.source[i].name : b(this.source[i])))
							.bind({
								click:function(){
									this.matrixMenuItem.click(this);
								},
								dblclick:function(){
									this.matrixMenuItem.dblclick(this);
								}
							});
					nw[0].matrixMenuItem = this.source[i];
				$(this.elements).append(nw);
			}
		},
		grid:function(){
			return templates.menu.call(this,"matrix-grid-item",function(th){ return th.icon() + '<span class="matrix-name">'+th.name+'</span>'; });
		}
	};
	
	var Matrix = function(elements,source,options){ return new Matrix.fn.__construct(elements,source,options);};
	
	Matrix.fn = Matrix.prototype = {
		__construct:function(elements,source,options){
			if(isN(source)) {
				return {};
			}
			this.options = options = scan($default,options,true);
			this.source = source;
			this.elements = elements;
			this.id = (new Date()).getTime();
			if(options.asIs) {
				this.refresh();
			}
			else {
				this.sort(options.sort,options.reverse);
			}
			return $(elements);
		},
		id:"1010",
		elements:"{}",
		source:"[{}]",
		options:"{}",
		properties:{
			version:"1.0.0"
		},
		sort:function(id,rev){
			this.source = this.source.sortBy(id,rev);
			this.refresh();
		},
		refresh:function(){
			if(!isN(templates[this.options.type])) {
				templates[this.options.type].call(this);
			}
			else {
				if(!isN(Phuel.fn.error)) {
					Phuel.fn.error("Function Undefined","Template function '"+this.options.type+"' is undefined!","Cannot fill matrix","Phuel.matrix.__construct","Mild");
				}
			}
		},
		extend:function(A) {
			Phuel.fn.extend.call(this,A,true);
		},
		__destruct:function(A){
			delete this;
		}
	};
	
	Matrix.fn.__construct.prototype = Matrix.fn;
	Matrix.extend = Matrix.fn.extend;
	
	$.fn.extend({
		matrix:function(source,options){
			return Matrix(this,source,options);
		}
	});
	Phuel.fn.extend({
		matrix:Matrix
	});
	
	this.matrixTest = {};
	
})(Phuel,window['jQuery']);