/****************
 * Quad.js
 *****************/

(function () {

    "use strict";

    var display = glbasic.import("display");

    var ANG = 180 / Math.PI;
    var RAD = Math.PI / 180;

    function Quad() {

        this._texture = null;

        this._x = 0;
        this._y = 0;
        this._scaleX = 1;
        this._scaleY = 1;
        this._radian = 0;

        this.transformChanged = true;

        Object.defineProperties( this, {

            "x": {
                get: function () {
                    return this._x;
                },
                set: function (value) {
                    if(this._x == value ) return;

                    this._x = value;
                    this.transformChanged = true;
                }
            },

            "y": {
                get: function () {
                    return this._y;
                },
                set: function (value) {
                    if(this._y == value) return;

                    this._y = value;
                    this.transformChanged = true;
                }
            },

            "scaleX": {
                get: function () {
                    return this._scaleX;
                },
                set: function (value) {
                    if(value == this._scaleX) return;

                    this._scaleX = value;
                    this.transformChanged = true;
                }
            },

            "scaleY": {
                get: function () {
                    return this._scaleY;
                },
                set: function (value) {
                    if(this._scaleY == value) return;

                    this._scaleY = value;
                    this.transformChanged = true;
                }
            },

            "radian": {
                get: function () {
                    return this._radian;
                },
                set: function (value) {
                    if( this._radian == value ) return;

                    this._radian = value;
                    this._transformChanged = true;
                }
            },

            // 180 : Math.PI = 1ang : 1rad
            // 1rad = 1ang * Math.PI / 180;
            // 1ang = 1rad * 180 / Math.PI;
            "rotation": {
                get: function () {
                    return this._radian * ANG;
                },
                set: function (value) {
                    this.radian = value * RAD;
                }
            },
        });
    }

    Quad.prototype = {
        constructor: Quad,

        render: function (renderer) {

        },
    }

    display.Quad = Quad;

})();

