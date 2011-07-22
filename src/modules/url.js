/// <reference path="..\main.js" />
/// <reference path="..\json.js" />
/* 
* Author: Blaine Jester
* Phuel Url Parser
* Created: 11/2/10
* Last Edit: 7/8/11
* Phuel Module
* Current Version: 1.0.1
*  
* Changelog
* V 1.0.2 : TBD
* V 1.0.1 : Revised with RegExp's
* V 1.0.0 : Original
*
*
*/
(function () {

    var isN = Phuel.fn.isN;
    var json = Phuel.fn.json;
    var copy = Phuel.fn.copy;
    var nurl;

    var reg = /(http)(s|):\/\/([\w\d\.]*\.(\w{1,3}))(\/.*)(\?|#|)(.*)/;

    var parse = function (M) {
        return '{' + M.replace(/([\w\d]*)=([^&]*)/g, '"$1":"$2"').replace(/&/g, ",") + '}'; ;
    };

    if (!Phuel.fn.locale.nodejs) {
        var Url = function (url) {
            /// <summary>Parses a url or the current one</summary>
            /// <param name="url" type="string" optional="true">The url to parse, defaults to window.location.href</param>
            /// <returns type="object">An object containing url data</returns>
            if (isN(url)) {
                url = window.location.href;
            }
            var ret = {
                secure: (url.replace(reg, "$2") == "s"),
                tld: url.replace(reg, "$4"),
                domain: url.replace(reg, "$3"),
                path: url.replace(reg, "$5"),
                query: {},
                hash: url.replace(/([^#]*)(?:#|)(.*)/, "$2")
            };
            if (/\?/.test(url)) {
                ret.query = JSON.parse(parse(url.split("?")[1].split("#")[0]));
            }

            return ret;
        };
    }
    else {
        // TO DO
        // Create transfer interface for node
        nurl = require('url');
        var Url = function (url) {
            /// <summary>Parses a url or the current one</summary>
            /// <param name="url" type="string" optional="true">The url to parse, defaults to window.location.href</param>
            /// <returns type="object">An object containing url data</returns>
            if (isN(url)) {
                //url = request.url; No access to request
            }
            var purl = nurl.parse(url, true);
            var ret = copy(purl,{
                secure: (purl.href.replace(reg, "$2") == "s"),
                tld: purl.href.replace(reg, "$4"),
                domain: purl.href.replace(reg, "$3"),
                hash: purl.hash.substring(1)
            },true);
            return ret;
        };
    }

    Phuel.fn.extend({
        url: Url
    });

})();
