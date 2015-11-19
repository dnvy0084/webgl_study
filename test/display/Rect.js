/**
 * Created by dnvy0084 on 2015. 11. 19..
 */

(function () {

    "use strict";

    var dis = test.import("display");

    function Rect( w, h ) {

        Object.defineProperties( this, {
            "x": {
                get: function () {
                    return this._x;
                },
                set: function (value) {
                    this._x = value;
                }
            },
        });
    }

    Rect.prototype = {
        
        constructor: Rect,

        init: function () {
            
        },
    };

    dis.Rect = Rect;

})();