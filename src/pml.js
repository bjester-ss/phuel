/* 
 * Author: Blaine Jester
 * Phuel Markup Language Interpreter
 * Created: 6/25/11
 * Last Edit: 6/26/11
 * Integral piece of Phuel system
 * Current Version: 1.0.0
 *  
 * Changelog
 * V 1.0.2 : TODO
 * V 1.0.1 : TODO
 * V 1.0.0 : Added Basic
 *
 *
 */
/*
EXAMPLE OF PML
===============================================
#define page 032342;
#define domain blainejester.com;
#include database "pages" | define db;
#include file /path/to/file.pml;

tag title "Welcome to my website!";

import jquery.main.js phuel.main.js phuel.modules.form.js phuel.modules.menu.js;

tmpl /tmpls/standard/body.tpl

tag meta $db(235) $db(236);
==============================================
*/
 (function(Phuel){
	var global = this;
	
	var isN = Phuel.fn.isN;
	var type = Phuel.fn.type;
	var locale = Phuel.fn.locale;
	var database = (isN(Phuel.fn['database']) ? null : Phuel.fn.database);
	
	var rxLine = /^(.*?)$/gm;
	var rxBreak = /\s\"(.*?)\"(?=\s|;)|((?:(?:\w*\/|\/)(?:\w[\w ]*))+\.(?:\w{1,3}))|(\$\w*\(.*?\))|([^\s;]*)/g;
	//var rxBreak1 = /\"(.*?)\"|((?:(?:\w*\/|\/)(?:\w[\w ]*))+\.(?:\w{1,3}))|([^\s;]*)*/g;
	var rxString = /\w/;
	
	var objectByArray = function(o,a){
		return (a.length > 0 ? (isN(o[a[0]]) ? o : objectByArray(o[a[0]],a.slice(1))) : o);
	};
	
	var CMD = {
		print:function(){
			return arguments.join(" ").replace(/EOL/g,"\n");
		},
		"import":function(){
			var args = arguments, len = args.length, ret = "";
			for(var i = 0; i < len; i++) {
				ret += '<script type="text/javascript" src="http://srv.blainejester.com/deps/'+args[i]+'"></script>';
			}
			return ret;
		},
		tag:function(){
			var args = arguments, len = args.length, ret = "";
			if(len >= 2) {
				for(var i = 0; i < len; i+=2) {
					ret += "<"+args[i]+">"+args[i+1]+"</"+args[i]+">";
				}
			}
			return ret;
		}
	};
	var SYS = {
		define:function(name,value){
			this.define[name] = value;
		},
		include:function(){
			
		}
	};
	
	var pml = function(str) {
		return new pml.fn.__construct(str);
	};
	
	pml.fn = pml.prototype = {
		__construct:function(str) {
			this.string = str;
		},
		string:"",
		output:"",
		lines:null,
		define:{},
		interpret:function(){
			var lns = (isN(this.lines) ? this.parse() : this.lines);
			var str = "";
			for(var i = 0; i < lns.length; i++) {
				str += this.interpretLine(lns[i]);
			}
			return this.output = str;
		},
		interpretLine:function(line){
			var tLine = type(line);
			if(tLine == "string") {
				return this.interpretLine(this.parseLine(line));
			}
			else if(tLine == "number") {
				return this.interpretLine((isN(this.lines) ? this.parse() : this.lines)[line]);
			}
			else if(tLine == "array") {
				if(line.indexOf("|") >= 1) {
					var j = line.indexOf("|"), cmd1 = line.slice(0,j), cmd2 = line.slice(j+1);
					return this.interpretLine(cmd2.push(this.interpretLine(cmd1)));
				}
				else {
					var cmd = line[0];
					if(cmd.charAt(0) == "#") {
						cmd = cmd.substring(1);
						if(!isN(SYS[cmd])) {
							return SYS[cmd].apply(this,ret.slice(1));
						}
						else {
							return "<!-- \\ PML: Command '"+cmd+"' not found! -->";
						}
					}
					else if(!isN(CMD[cmd])) {
						return CMD[cmd].apply(this,ret.slice(1));
					}
					else {
						return "<!-- \\ PML: Command '"+cmd+"' not found! -->";
					}
				}
			}
		},
		parse:function(str){
			var ret = [];
			var me = this;
			(!isN(str) && type(str) == "string" ? str : this.string).replace(rxLine,function(a,b,c){
				if(!rxString.test(b)) { return; }
				ret.push(me.parseLine(b));
			});
			return (isN(str) ? this.lines = ret : ret);
		},
		parseLine:function(line) {
			var ret = [], me = this;
			if(type(line) == "string") {
				line.replace(rxBreak,function(a,b,c,d,e){
					if(!a) { return; }
					ret.push(me.parseItem((e || c || d ? a : b)));
				});
			}
			return ret;
		},
		parseItem:function(itm){
			if(itm.charAt(0) == "$") {
				var isCall = /\$[\w\.]*(?=\()/.test(itm);
				var name = itm.replace(/\$([\w\.]*)/,"$1");
				var inc = (/\./.test(name) ? objectByArray(this.define,name.split(".")) : this.define[name]);
				if(!isN(inc)) {
					var t = type(inc);
					if(isCall && t == "function") {
						return inc.apply(this,itm.replace(/\$[\w\.]*\((.*?)\)/,"$1").split(","));
					}
					else if(!isCall) {
						return inc;
					}
				}
			}
			return itm;
		},
		insert:function(stuff,index,cut){
			var t = type(stuff);
			if(t == "string") {
				return this.insert(this.parse(stuff),index,cut);
			}
			else if(t == "array") {
				
			}
		},
		addCommand:function(){
			var t = type(arguments[0]);
			if(arguments.length === 1 && t == "object") {
				copy(CMD,arguments[0]);
			}
			else if(arguments.length === 2 && t == "string" && type(arguments[1]) == "function" && isN(CMD[arguments[0]])) {
				CMD[arguments[0]] = arguments[1];
			}
		},
		extend:function(A) {
			Phuel.fn.extend.call(this,A,true);
		},
		toJSON:function(){
			return "~"+this.type+"("+this.string+")";
		},
		type:"pml"
	};

	pml.fn.__construct.prototype = pml.fn;
	pml.extend = pml.fn.extend;
	
	String.prototype.pml = function(){
		return pml(this);
	};
	
	Phuel.fn.extend({
		pml:pml
	});

})(Phuel);