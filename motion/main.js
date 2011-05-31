/* 
 * Author: Blaine Jester
 * Motion Dependencies -- Adds to Phuel Class
 * Works with: HTML, Titanium
 * Date: 1/5/2011
 * Requires: jQuery
 *
 */

(function(Phuel,$){
	
	if(!Phuel.fn.locale.jquery) {
		return;
	}
	
	var Motion = {
		standard:{
			c:function(A,B,C,D){
				return (B + (((A >= D) ? (D) : (A)) - C));
			},
			xy:function(X,Y,dX,dY,A,B,W,H){
				return [(dX + (((X >= W) ? (W) : (X)) - A)),(dY + (((Y >= H) ? (H) : (Y)) - B))];
			}
		},
		contain:{
			c:function(A,B,C){
				return (((B + A) >= C) ? (C - A) : (B));
			},
			i:function(A,B,C){
				return (((B + A) >= C) ? (B) : (C - A));
			},
			r:function(A,B,C,D,E) {
				return ( (A) ? (  (B) ? (C) : (D) ) : (E));
			},
			xy:function(dX,dY,A,B,W,H){
				return [(((A + dX) >= W) ? (W - dX) : (A)),(((B + dY) >= H) ? (H - dY) : (B))];
			}
		},
		mouse:{
			X:0,
			Y:0
		}
	};
	
	Phuel.fn.extend({
		motion:Motion
	});

	var mouseMove;
	if($.browser.msie) {
		mouseMove = function(e){
			Motion.mouse.X = event.clientX + document.body.scrollLeft;
			Motion.mouse.Y = event.clientY + document.body.scrollTop;
		};
	}
	else {
		mouseMove = function(e){
			Motion.mouse.X = e.pageX;
			Motion.mouse.Y = e.pageY;
		};
	}
	$(window.document).mousemove(mouseMove);
	
	// For Selection
	var elem = this.document.createElement( "div" ),
	style = elem.style,
	userSelectProp = "userSelect" in style && "userSelect";
	if ( !userSelectProp ) {
		$.each( [ "Moz", "Webkit", "Khtml" ], function( i, prefix ) {
			var vendorProp = prefix + "UserSelect";
			if ( vendorProp in style ) {
				userSelectProp = vendorProp;
				return false;
			}
		});
	}
	
	var selectStart = !userSelectProp && "onselectstart" in elem && "selectstart.mouse";
	
	elem = null;
	
	$.fn.extend({
		disableSelection: function() {
			if ( userSelectProp ) {
				this.css( userSelectProp, "none" );
			} 
			else {
				this.find( "*" ).andSelf().attr( "unselectable", "on" );
			}
			if ( selectStart ) {
				this.bind( selectStart, function() {
					return false;
				});
			}
			
			return this;
		},
		enableSelection: function() {
			if ( userSelectProp ) {
				this.css( userSelectProp, "" );
			} 
			else {
				this.find( "*" ).andSelf().attr( "unselectable", "off" );
			}
			if ( selectStart ) {
				this.unbind( selectStart );
			}
			return this;
		}
	});
	// End For Selection
	
})(Phuel,window['jQuery']);