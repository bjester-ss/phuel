/* 
 * Author: Blaine Jester
 * Resizable -- Adds to jQuery
 * Works with: HTML, Titanium
 * Date: 1/5/2011
 * Requires: jQuery, Motion Dep's
 *
 */
(function(Phuel,$){
	var window = this;
	
	var mouse = Phuel.fn.motion.mouse;
	var stan = Phuel.fn.motion.standard;
	var con = Phuel.fn.motion.contain;

	var isN = Phuel.fn.isN;
	var type = Phuel.fn.type;
	var cursors = {
		northWest:"nw-resize",
		west:"w-resize",
		southWest:"sw-resize",
		south:"s-resize",
		southEast:"se-resize",
		east:"e-resize",
		northEast:"ne-resize",
		north:"n-resize"
	};
	
	var Resizable = function(el,op) {
		return new Resizable.fn.__construct(el,op);
	};
	
	Resizable.fn = Resizable.prototype = {
		__construct:function(el,op) {
			var me = this;
			me.el = el;
			me.self = $(el);
			el.resizeObject = this;
			if(!isN(op)) {
				for(var o in op) {
					if(type(op[o]) == "function") {
						if(this[o]) {
							this[o] = op[o];
						}
					}
					else {
						if(!isN(this.properties[o])) {
							this.properties[o] = op[o];
						}
						
					}
				}
			}
			
			op = this.properties;
			
			$.each(op.handles,function(i,k) {
				if(!isN(k)) {
					if($(k).html() == "") {
						$(k).html("<span></span>");
					}
					$(k).bind("mousedown",function(){ me.resizeStart(i,false); });
				}
			});
		
		},
		properties:{
            fade: true,
            contained: true,
            speed:20,
            css: {},
            moveCursor: "move",
            fadeTo: 75,
            resizable: true,
            scroll: false,
			container:window,
			handles:{
				north:"",
				northEast:"",
				east:"",
				southEast:"",
				south:"",
				southWest:"",
				west:"",
				northWest:""
			},
			stats:true
		},
		
		self:{},
		el:{},
		_current:0,
		_timer: "",
		_restoreData: {},

		onStart: function() {return true;},
		onStop: function() { return true;},
		onDrag: function() { },
		
		
		_refresh: function() {
			var da = this.properties;
			var pos = this.self.position();
			if (da.fade) {
				this.self.stop(true).animate({ opacity: da.fadeTo / 100 }, "fast");
			}
			return {
				w: $(this.self).width(),
				h: $(this.self).height(),
				pX: pos.left,
				pY: pos.top,
				W: $(da.container).width(),
				H: $(da.container).height(),
				X: mouse.X,
				Y: mouse.Y
			};
		},	
		
		resizeStart:function(A,B) {
			var m, me = this, data = me.properties;
			if(me._current !== 0) {
				me.resizeEnd();
			}
			if (!data.resizable || !me.onStart.call(me.el,me)) { return this; }
			
			var D = me._refresh();
			
			m = (data.contained) ? ("resizeContain") : ("resizeFull");
			
			me.self.css("position", (data.contained || data.scroll) ? ("absolute") : ("fixed"));
			
			if(B) {
				me.self.css({top:((D.Y < 0)?(D.pY):(D.Y)),left:((D.X < 0)?(D.pX):(D.X))}); return;
			}
			$(me.self).disableSelection();
			$("body").css("cursor", cursors[A]);
			
			$(document).one("mouseup",function(){
				me._end = true;
				me.resizeEnd();
			});
			if(type(data.stats) == "stats") {
				data.stats.start();
				var run = function(){me[m][A].call(me,D);  data.stats.tick();};
			}
			else {
				var run = function(){me[m][A].call(me,D); };
			}
			
			me._current = 2;

			me._timer = window.setInterval(run, data.speed);
			
			return me;
		},
		resizeFull:{
			north:function(D){
				var dY = (mouse.Y - D.Y);
				this.self.css({ top:stan.c(dY,D.pY,0,D.h), height:con.i(dY,0,D.h)});
			},
			northEast:function(D){
				var dX = (mouse.X - D.X);
				var dY = (mouse.Y - D.Y);
				this.self.css({ top:stan.c(dY,D.pY,0,D.h), height:con.i(dY,0,D.h), width:con.i(-dX,0,D.w)});
			},
			east:function(D){
				var dX = (mouse.X - D.X);
				this.self.css({ width:con.i(-dX,0,D.w)});
			},
			southEast:function(D){
				var dX = (mouse.X - D.X);
				var dY = (mouse.Y - D.Y);
				this.self.css({ height:con.i(-dY,0,D.h), width:con.i(-dX,0,D.w)});
			},
			south:function(D){
				var dY = (mouse.Y - D.Y);
				this.self.css({ height:con.i(-dY,0,D.h)});
			},
			southWest:function(D){
				var dX = (mouse.X - D.X);
				var dY = (mouse.Y - D.Y);
				this.self.css({ height:con.i(-dY,0,D.h), width:con.i(dX,0,D.w),left:stan.c(dX,D.pX,0,D.w)});
			},
			west:function(D){
				var dX = (mouse.X - D.X);
				this.self.css({width:con.i(dX,0,D.w),left:stan.c(dX,D.pX,0,D.w)});
			},
			northWest:function(D){
				var dX = (mouse.X - D.X);
				var dY = (mouse.Y - D.Y);
				this.self.css({ top:stan.c(dY,D.pY,0,D.h), height:con.i(dY,0,D.h), width:con.i(dX,0,D.w),left:stan.c(dX,D.pX,0,D.w)});
			}
		},
		resizeContain:{
			north:function(D){
				var dY = (mouse.Y - D.Y);
				var nY = (D.pY + dY);
				this.self.css({ top:con.r(dY < D.h,-D.pY < dY,nY,0,D.h+D.pY),height:con.r(dY < D.h,-D.pY < dY,(D.h-dY),D.h+D.pY,0)});
			},
			northEast:function(D){
				var dY = (mouse.Y - D.Y);
				var nY = (D.pY + dY);
				this.self.css({ top:con.r(dY < D.h,-D.pY < dY,nY,0,D.h+D.pY), width:con.c(D.pX,(D.w + (mouse.X - D.X)),D.W),height:con.r(dY < D.h,-D.pY < dY,(D.h-dY),D.h+D.pY,0)});
			},
			east:function(D){
				this.self.css({width:con.c(D.pX,(D.w + (mouse.X - D.X)),D.W)});
			},
			southEast:function(D){
				this.self.css({width:con.c(D.pX,(D.w + (mouse.X - D.X)),D.W), height:con.c(D.pY,(D.h + (mouse.Y - D.Y)),D.H)});
			},
			south:function(D){
				this.self.css({height:con.c(D.pY,(D.h + (mouse.Y - D.Y)),D.H) });
			},
			southWest:function(D){
				var dX = (mouse.X - D.X);
				var nX = (D.pX + dX);
				this.self.css({height:con.c(D.pY,(D.h + (mouse.Y - D.Y)),D.H),width:con.r(dX < D.w,-D.pX < dX,(D.w-dX),D.w+D.pX,0), left:con.r(dX < D.w,-D.pX < dX,nX,0,D.w+D.pX)});
			},
			west:function(D){
				var dX = (mouse.X - D.X);
				var nX = (D.pX + dX);
				this.self.css({width:con.r(dX < D.w,-D.pX < dX,(D.w-dX),D.w+D.pX,0), left:con.r(dX < D.w,-D.pX < dX,nX,0,D.w+D.pX)});
			},
			northWest:function(D){
				var dX = (mouse.X - D.X), dY = (mouse.Y - D.Y);
				var nX = (D.pX + dX), nY = (D.pY + dY);
				this.self.css({ top:con.r(dY < D.h,-D.pY < dY,nY,0,D.h+D.pY), width:con.r(dX < D.w,-D.pX < dX,(D.w-dX),D.w+D.pX,0), left:con.r(dX < D.w,-D.pX < dX,nX,0,D.w+D.pX),height:con.r(dY < D.h,-D.pY < dY,(D.h-dY),D.h+D.pY,0)});
			}
		},
		resizeEnd:function() {
			var T = this, R = T.properties;
			if (T.current !== 0) {
				T.self.enableSelection();
				window.clearInterval(T._timer);
				if (R.fade) {
					T.self.stop(true).animate({ opacity: 1 }, "normal");
				}
				$("body").css("cursor", "auto");
				
				T.onStop.call(this.el,this);
				
				T._current = 0;
				if(type(R.stats) == "stats") {
					R.stats.stop();
				}
			}
		},
		extend:function(A) {
			Phuel.fn.extend.call(this,A,true);
		},
		type:"resizable"
	};

	Resizable.fn.__construct.prototype = Resizable.fn;
	Resizable.extend = Resizable.fn.extend;
	
	
	$.fn.extend({
		resizable:function(op,ags){
			var me = $(this);
			var idStr = $(this).attr("id");
			if((!me.isResizable() && typeof op == "string") || me.size() != 1) { 
				return false;
			}
			else if(me.isResizable() && (type(op) == "object" || isN(op)) ) {
				
				return this.each(function(){ Resizable(this,op); });
			}
			else if(me.isResizable() && typeof op == "string") {
				return me.resizeObject[op](ags,true);
			}
			return me;
		},
		isResizable:function(){
			var me = this;
			return (me.is("div") && me.resizeObject != "");
		}
	});
	
	Phuel.fn.motion.resizable = function(A,B,C){
		return $(A).resizable(B,C);
	};

})(Phuel, window['jQuery']);