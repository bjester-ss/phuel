/* 
 * Author: Blaine Jester
 * Url Module/Function -- Adds to Phuel Class
 * Date: 12/16/10
 * Works with: Browser, HTML5, Titanium
 */
(function(Phuel){
		  
	var isN = Phuel.fn.isN;
	
	var separate = function(M) {
		var ret = {};
		for(var i = 0; i < M.length; i++) {
			M[i] = M[i].split("=");
			ret[M[i][0]] = (isN(M[i][1]) ? "" : M[i][1]);
		}
		return ret;
	};
	
	if(!Phuel.fn.locale.nodejs) {
		var url = function(A){
			if(isN(A)) { 
				A = window.location.href;
			}
			var B = A.split("/")[2], C = A.split("?"), D = A.split("#");
			var ret = {
				domain:B,
				url:A,
				tld:B.split(".").pop(),
				secure:(A.indexOf("https://") >= 0),
				query:{},
				hash:{
					call:((D.length > 1)? (D[1].split("?")[0]) : ("")),
					query:{}
				},
				path:C[0].split("/").slice(3)
			};
			
			if(C.length > 1) {
				ret.query = separate(C[1].split("#")[0].split("&"));
			}
			if(C.length > 2 && D.length > 1) {
				ret.hash.query = separate(C[2].split("&"));
			}
			
			return ret;
		};
	}
	else {
		// TO DO
		// Create transfer interface for node
	}
	
	Phuel.fn.extend({
		url:url
	});
	
})(Phuel);