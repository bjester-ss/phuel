/* 
 * Author: Blaine Jester
 * Window Class -- Adds to Phuel Class
 * Works with: HTML, Titanium
 * Date: 11/2/10
 * Requires: Motion(Draggable, Resizable), jQuery
 *
 */
(function(Phuel,$){
	var window = this;
	
	var isN = Phuel.fn.isN;	
	var type = Phuel.fn.type;
	var copy = Phuel.fn.copy;
	
	var windowPieces = [
		["<div id='w-","' class='w-all' style=''><div class='w-content'></div></div>"],
		["<div class='w-title'>","</div>"],
		["<div class='w-buttons'>","</div><div class='w-tl-corner'></div><div class='w-tr-corner'></div><div class='w-ml'></div><div class='w-mr'></div><div class='w-bl-corner'></div><div class='w-b'></div><div class='w-br-corner'></div><div class='w-ulay'></div>"],
		"<div class='w-blankbutton'></div>",
		["<div class='w-minimize'></div>","<div class='w-dock'></div>","<div class='w-close'></div>"]
	];
	var handles = function(A){
		var m = "#w-"+A+" > ";
		return [m+".w-title",{
			west:m+".w-ml",
			northWest:m+".w-tl-corner",
			northEast:m+".w-tr-corner",
			east:m+".w-mr",
			southEast:m+".w-br-corner",
			south:m+".w-b",
			southWest:m+".w-bl-corner",
		}];
	};
	
	var Window = function(nm,op) {
		return new Window.fn.__construct(nm,op);
	};
	
	Window.fn = Window.prototype = {
		__construct:function(el,op) {
			// {key:"",hold:true,type:"session",value:""}
			var me = this;
			me.el = el;
			me.self = $(el);
			el.windowObject = this;
			
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
			op.id = (op.id === 0 ? parseInt(1000000 * Math.random()) : op.id);
			
			// ---------------------------
			
			var hands = handles(op.id);
			var setts = {speed:op.speed,resizable:op.resizable,fade:op.fade,draggable:op.draggable,fadeTo:op.fadeTo,contained:op.contained};
			var str = "", buttons = "", button = [op.minimizable, op.dockable, op.closeable];
			
			for(var i = 0; i < button.length; i++) {
				if(button[i]) {
					buttons += windowPieces[4][i];
				}
				else {
					str += windowPieces[3];
				}
			}
			var Q = me.self.wrap(windowPieces[0].join(op.id))
					.closest(".w-content")
					.before(windowPieces[1].join(op.title))
					.after(windowPieces[2].join(str+buttons))
					.closest(".w-all").css({ opacity: 0.05, display: "block" }).css(op.css)
					.find("div")
					.bind("mousedown", function(evt) {
						$(".w-all").css("zIndex", 600);
						$(this).closest(".w-all").css("zIndex", 700);
					})
					.siblings(".w-buttons > div")
					.bind("click", function() {
						var sid = ($(this).attr("class").split("-"))[1];
						if(!isN(me[sid]) && type(me[sid]) == "function") {
							me[sid]();
						}
						
					})
					.closest(".w-all").find(".w-ulay").css({backgroundColor:op.color})
					.closest(".w-all").animate({ opacity: 1 });
					me.self = Q;
					Q.children("div:not(.w-buttons,.w-content)").disableSelection();
					
					Q.resizable(copy({handles:hands[1],stats:op.stats},setts)).draggable(copy({handle:hands[0],stats:op.stats},setts));
		},
		el:"",
		self:"",
		properties:{
			title:"New Window",
			id:0,
			fade: false,
            contained: true,
            open:true,
			docked:false,
			minimized:false,
            speed: 25,
            css: {
				minWidth: 50,
				minHeight: 50,
				maxWidth: 6000,
				maxHeight: 6000
			},
            moveCursor: "auto",
            fadeTo: 75,
			color:"#33FF66",
			closeable: true,
			minimizable: true,
			dockable:true,
            draggable: true,
            resizable: true,
			stats:true
		},
		open:function(){},
		close:function(){},
		minimize:function(){},
		maximize:function(){},
		dock:function(){},
		set:function(A){
			if(!isN(A['color'])) {
				me.self.find(".w-ulay").animate({backgroundColor:A.color});
			}
		},
		flash:function(A,B){
			if(!isN(A['color'])) {
				var col = this.properties.color, me = this;
				me.self.find(".w-ulay").animate({backgroundColor:A.color},function(){
					setTimeout(function(){me.self.find(".w-ulay").animate({backgroundColor:col},function(){
						if(isN(B)) {
							setTimeout(function(){me.flash(A,true);},500);
						}
					});},500);
				});
			}
		},
		focus:function(){
			
		},
		remove:function(){
			
		},
		extend:function(A) {
			Phuel.fn.extend.call(this,A,true);
		},
		type:"window"
	};

	Window.fn.__construct.prototype = Window.fn;
	Window.extend = Window.fn.extend;
	
	Phuel.fn.extend({
		window:Window
	});
	
	$.fn.extend({
		window:function(op,ags){
			var me = $(this);
			var idStr = $(this).attr("id");
			if((!me.isWindow() && typeof op == "string") || me.size() != 1) { 
				return false;
			}
			else if(me.isWindow() && (type(op) == "object" || isN(op)) ) {
				
				return this.each(function(){ Window(this,op); });
			}
			else if(me.isWindow() && typeof op == "string") {
				if(op == "debug") { return this[0].windowObject;}
				return this[0].windowObject[op](ags);
			}
		},
		isWindow:function(){
			var me = this;
			return (me.is("div") && me.windowObject != "");
		}
	});

})(Phuel,window['jQuery']);