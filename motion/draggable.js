/* 
 * Author: Blaine Jester
 * Draggable -- Adds to jQuery
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
	
	
	var Draggable = function(el,op) {
		return new Draggable.fn.__construct(el,op);
	};
	
	Draggable.fn = Draggable.prototype = {
		__construct:function(el,op) {
			var me = this;
			me.el = el;
			me.self = $(el);
			el.dragObject = this;
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

			if(op.handle == "self") {
				op.handle = me.self;
			}
			else {
				op.handle = $(op.handle);
			}
			if($.browser.mozilla && op.handle.html() == "") {
				op.handle.html("<span class='no-set'></span>");
			}
			
			op.handle.bind("mousedown",function(){ me.moveStart(); });
		},
		properties:{
            fade: true,
            contained: true,
            speed:20,
            css: {},
            moveCursor: "move",
            fadeTo: 75,
            draggable: true,
            scroll: false,
			container:window,
			handle:"self",
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
		
		moveStart:function(A,B) {
			var m, me = this, data = me.properties;
			if(me._current !== 0) {
				me.moveEnd();
			}
			if (!data.draggable || !me.onStart.call(me.el,me)) { return this; }
			
			var D = me._refresh();
			
			m = (data.contained) ? ("moveContain") : ("moveFull");
			
			me.self.css("position", (data.contained || data.scroll) ? ("absolute") : ("fixed"));
			
			if(B) {
				me.self.css({top:((D.Y < 0)?(D.pY):(D.Y)),left:((D.X < 0)?(D.pX):(D.X))}); return;
			}
			$(me.self).disableSelection();
			$("body").css("cursor", this.properties.moveCursor);
			
			$(document).one("mouseup",function(){
				me._end = true;
				me.moveEnd();
			});
			
			me._current = 2;
			
			if(type(data.stats) == "stats") {
				data.stats.start();
				var run = function(){me[m](D); data.stats.tick();};
			}
			else {
				var run = function(){me[m](D);};
			}

			me._timer = window.setInterval(run, data.speed);
			
			return me;
		},
		moveFull:function(D) {
			this.self.css({ left:stan.c(((mouse.X <= 0) ? (0) : (mouse.X)),D.pX,D.X,D.W), top:stan.c(((mouse.Y <= 0) ? (0) : (mouse.Y)),D.pY,D.Y,D.H) });
		},
		moveContain:function(D) {
			var nX = (D.pX + (mouse.X - D.X)), nY = (D.pY + (mouse.Y - D.Y));

			this.self.css({left: con.c(D.w,((nX <= 0) ? (0) : (nX)),D.W), top:con.c(D.h,((nY <= 0) ? (0) : (nY)),D.H)});
		},
		moveEnd:function() {
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
		type:"draggable"
	};

	Draggable.fn.__construct.prototype = Draggable.fn;
	Draggable.extend = Draggable.fn.extend;	
	
	$.fn.extend({
		draggable:function(op,ags){
			var me = $(this);
			var idStr = $(this).attr("id");
			if((!me.isDraggable() && typeof op == "string") || me.size() != 1) { 
				return false;
			}
			else if(me.isDraggable() && (type(op) == "object" || isN(op)) ) {
				
				return this.each(function(){ Draggable(this,op); });
			}
			else if(me.isDraggable() && typeof op == "string") {
				return me.dragObject[op](ags,true);
			}
		},
		isDraggable:function(){
			var me = this;
			return (me.is("div") && me.dragObject != "");
		}
	});
	
	Phuel.fn.motion.draggable = function(A,B,C){
		return $(A).draggable(B,C);
	};

})(Phuel,window['jQuery']);