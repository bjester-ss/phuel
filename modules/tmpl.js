/* 
 * Author: Blaine Jester
 * Template Module -- Adds to Phuel Class and jQuery
 * Date: 11/2/10
 *
 */
(function(Phuel,jQuery){
	var cache = {};
	var tmpl = function(str, data){
		var fn = ((!/\W/.test(str)) ? (cache[str] = cache[str] ||
		tmpl(document.getElementById(str).innerHTML)) :
		(new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" + "with(obj){p.push('" + str
		.replace(/[\r\t\n]/g, " ")
		.split("<%").join("\t")
		.replace(/((^|%>)[^\t]*)'/g, "$1\r")
		.replace(/\t=(.*?)%>/g, "',$1,'")
		.split("\t").join("');")
		.split("%>").join("p.push('")
		.split("\r").join("\\'")
		+ "');}return p.join('');")));
		return data ? fn( data ) : fn;
	};
	
	Phuel.fn.extend({
		tmpl:tmpl
	});
	
	if(Phuel.fn.locale.jquery) {
		jQuery.fn.extend({
			tmpl:function(str, data){
				return ((!Phuel.fn.isN(data))?($(this).append(tmpl(str,data))):(tmpl(str)));
			}
		});
	}

})(Phuel,window['jQuery']);