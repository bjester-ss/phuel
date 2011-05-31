/* 
 * Author: Blaine Jester
 * Stats -- Adds to Phuel.Interface Class
 * Works with: HTML
 * Date: 2/3/11
 * Requires: jQuery
 *
 * Modification of: Stats.js 1.1 -- http://code.google.com/p/mrdoob/wiki/stats_js
 *
 */
(function(Phuel,$){
	var window = this;
	var isN = Phuel.fn.isN;
	var copy = Phuel.fn.copy;
	var type = Phuel.fn.type;
	
	if(!Phuel.fn.locale.jquery) {
		return false;
	}
	
	
	var Stats = function(nm) {
		return new Stats.fn.__construct(nm);
	};
	
	Stats.fn = Stats.prototype = {
		__construct:function(N) {
			// {launch:false,timing:100,bindings:{}}
			this.time = this.timePrev = (new Date()).getTime(); 
						
			this.container = $(document.createElement("div")).css(this.styles.container).html('<strong>0 FPS</strong> (0-0)');

		},
		fps:0,
		frames:0,
		framesMin:100,
		framesMax:0,
			
		time:"",
		timePrev:"",
		
		interval:"",
		
		container:{},
		framesText:{},
		canvas:{},
		context:{},
		contextImageData:{},
		
		styles:{
			container:{
				fontFamily:'Arial',
				fontSize:'10px',
				backgroundColor:'#000020',
				opacity:'0.9',
				width:'85px',
				padding:'3px',
				color:'#00ffff'
			}
		},
		
		put:function(id) {
			//document.getElementById(id).appendChild(this.getDisplayElement());
			$(id).append(this.container);
		},
		getDisplayElement: function(){
			return this.container;
		},
		start:function(){
			var me = this;
			this.interval = setInterval(function() { me.update();},1000);
		},
		stop:function(){
			this.frames = 0;
			clearInterval(this.interval);
		},
		tick: function(){
			this.frames++;
		},
		update: function(){
			this.time = (new Date()).getTime();

			this.fps = Math.round((this.frames * 1000 ) / (this.time - this.timePrev)); //.toPrecision(2);
	
			this.framesMin = Math.min(this.framesMin, this.fps);
			this.framesMax = Math.max(this.framesMax, this.fps);
		
			this.container.html('<strong>' + this.fps + ' FPS</strong> (' + this.framesMin + '-' + this.framesMax + ')');
	
			this.timePrev = this.time;
			this.frames = 0;
		},
		type:"stats"
	};

	Stats.fn.__construct.prototype = Stats.fn;
	Stats.extend = Stats.fn.extend;
	
	Phuel.fn.extend({
		stats:Stats
	});

})(Phuel,window['jQuery']);