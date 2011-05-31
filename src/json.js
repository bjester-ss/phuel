/* 
 * Author: Blaine Jester
 * JSON -- Use when Native JSON is missing
 * Date: 2/3/11
 * Works with: All
 *
 */
(function(Phuel){
	var Json = {};
	
	var $json = {
		stringify:function(A){
			return Json.stringify(A);
		},
		parse:function(A,B){
			A = Json.parse(A);
			return (B ? this.walk(A) : A);
		},
		walk:function(A){
			for(var k in A) {
				var ty = type(A[k]);
				if(ty == "object" || ty == "array") {
					A[k] = this.walk(A[k]);
				}
				else if(ty == "string") {
					if(A[k].charAt(0) == "~") {
						var n = A[k].substring(1).split("(");
						if(!isN(Phuel.fn[n[0]])) {
							var st = n[1].substring(0,n[1].length-1);
							st = (st.charAt(0) == "{" ? st : '"'+st+'"');
							A[k] = Phuel.fn[n[0]](Json.parse(st));
						}
					}
				}
			}
			return A;
		}
	};  
	
	Phuel.fn.extend({
		json:$json
	});
	
	RegExp.prototype.toJSON = function(){
		return $json.stringify({
			source:this.source,
			global:this.global,
			ignore:this.ignoreCase,
			multi:this.multiline
		});
	};
	RegExp.prototype.fromJSON = function(A){
		A = $json.walk.parse(A);
		var mods = ((A.global)?("g"):("")) + ((A.ignore)?("i"):("")) + ((A.multi)?("m"):(""));
		return new RegExp(A.source,mods);
	};
	
	if(Phuel.fn.locale.json) {Json = this.JSON; return;}
	
/*
    http://www.JSON.org/json2.js || Crockford on Github
    2011-01-18
*/

function l(b){return b<10?"0"+b:b}function p(b){q.lastIndex=0;return q.test(b)?'"'+b.replace(q,function(f){var c=t[f];return typeof c==="string"?c:"\\u"+("0000"+f.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+b+'"'}function n(b,f){var c,d,g,j,i=h,e,a=f[b];if(a&&typeof a==="object"&&typeof a.toJSON==="function")a=a.toJSON(b);if(typeof k==="function")a=k.call(f,b,a);switch(typeof a){case "string":return p(a);case "number":return isFinite(a)?String(a):"null";case "boolean":case "null":return String(a);
case "object":if(!a)return"null";h+=o;e=[];if(Object.prototype.toString.apply(a)==="[object Array]"){j=a.length;for(c=0;c<j;c+=1)e[c]=n(c,a)||"null";g=e.length===0?"[]":h?"[\n"+h+e.join(",\n"+h)+"\n"+i+"]":"["+e.join(",")+"]";h=i;return g}if(k&&typeof k==="object"){j=k.length;for(c=0;c<j;c+=1){d=k[c];if(typeof d==="string")if(g=n(d,a))e.push(p(d)+(h?": ":":")+g)}}else for(d in a)if(Object.hasOwnProperty.call(a,d))if(g=n(d,a))e.push(p(d)+(h?": ":":")+g);g=e.length===0?"{}":h?"{\n"+h+e.join(",\n"+h)+
"\n"+i+"}":"{"+e.join(",")+"}";h=i;return g}}var m={};if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+l(this.getUTCMonth()+1)+"-"+l(this.getUTCDate())+"T"+l(this.getUTCHours())+":"+l(this.getUTCMinutes())+":"+l(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(){return this.valueOf()}}var r=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
q=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,h,o,t={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},k;if(typeof m.stringify!=="function")m.stringify=function(b,f,c){var d;o=h="";if(typeof c==="number")for(d=0;d<c;d+=1)o+=" ";else if(typeof c==="string")o=c;if((k=f)&&typeof f!=="function"&&(typeof f!=="object"||typeof f.length!=="number"))throw Error("JSON.stringify");return n("",{"":b})};
if(typeof m.parse!=="function")m.parse=function(b,f){function c(g,j){var i,e,a=g[j];if(a&&typeof a==="object")for(i in a)if(Object.hasOwnProperty.call(a,i)){e=c(a,i);if(e!==undefined)a[i]=e;else delete a[i]}return f.call(g,j,a)}var d;b=String(b);r.lastIndex=0;if(r.test(b))b=b.replace(r,function(g){return"\\u"+("0000"+g.charCodeAt(0).toString(16)).slice(-4)});if(/^[\],:{}\s]*$/.test(b.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){d=eval("("+b+")");return typeof f==="function"?c({"":d},""):d}throw new SyntaxError("JSON.parse");};

	Json = m;
	
})(Phuel);
