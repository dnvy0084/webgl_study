/****************
 * loadItems.js
 *****************/

(function () {

    "use strict";

    var util = glbasic.import("util");

    function loadItems( items, onComplete, onFail ) {

        var xhr, response = [];

        for (var i = 0, n = 0, l = items.length; i < l; i++) {
            xhr = new XMLHttpRequest();
            xhr.index = i;
            xhr.open( "GET", items[i]);
            xhr.send();

            xhr.onload = function(e){

                if( e.target.readyState != 4 ) return;

                response[e.target.index] = e.target.response;

                if( ++n == l ) onComplete( response );
            }
        }
    }

    util.loadItems = loadItems;

})();

