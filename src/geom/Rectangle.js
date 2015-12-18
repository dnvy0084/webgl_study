/****************
 * Rectangle.js
 *****************/

(function () {

    "use strict";

    var geom = glbasic.import("geom");

    function Rectangle( x, y, w, h ) {

        this.setTo( x, y, w, h );

        Object.defineProperties( this, {

            "left": {
                get: function () {
                    return this.x;
                }
            },

            "top": {
                get: function () {
                    return this._y;
                }
            },

            "right": {
                get: function () {
                    return this.x + this.width;
                }
            },

            "bottom": {
                get: function () {
                    return this.y + this.height;
                }
            },
        });
    }

    Rectangle.prototype = {
        constructor: Rectangle,

        setTo: function (x, y, w, h) {
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h;
        },
    }

    geom.Rectangle = Rectangle;

})();

