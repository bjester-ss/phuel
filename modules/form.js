/* 
 * Author: Blaine Jester
 * Form Module -- Adds to Phuel Class
 * Date: 11/2/10
 *
 */
(function(Phuel){
	var Form = function(A){ return new Form.fn.__construct(A);};
	var form = {};
	
	Form.fn = Form.prototype = {
		__construct:function(A){

		},
		properties:{},
		extend:function(A) {
			Phuel.fn.extend.call(this,A,true);
		},
		__destruct:function(A){
			delete this;
		},
		type:"form"
	};
	
	Form.fn.__construct.prototype = Form.fn;
	Form.extend = Form.fn.extend;

	Phuel.fn.extend({
		form:Form
	});
	
})(Phuel);