/**
 * Created by dnvy0084 on 2015. 11. 21..
 */

(function () {

    "use strict";

    var display = glbasic.import("display");
    var geom = glbasic.import("geom");

    display.RAD = 1 * 180 / Math.PI;
    display.ANG = 1 * Math.PI / 180;

    function DisplayObject( w, h, gl ) {

        this._x = 0;
        this._y = 0;
        this._scaleX = 1;
        this._scaleY = 1;
        this._radian = 0;
        this._anchorX = 0;
        this._anchorY = 0;

        this._transform = new geom.Matrix3D();

        this._transformChanged = true;

        Object.defineProperties( this, {

            "x": {
                get: function () {
                    return this._x;
                },
                set: function (value) {
                    if(this._x == value ) return;

                    this._x = value;
                    this._transformChanged = true;
                }
            },

            "y": {
                get: function () {
                    return this._y;
                },
                set: function (value) {
                    if(this._y == value ) return;

                    this._y = value;
                    this._transformChanged = true;
                }
            },

            "scaleX": {
                get: function () {
                    return this._scaleX;
                },
                set: function (value) {
                    if(this._scaleX == value ) return;

                    this._scaleX = value;
                    this._transformChanged = true;
                }
            },

            "scaleY": {
                get: function () {
                    return this._scaleY;
                },
                set: function (value) {
                    if(this._scaleY == value ) return;
                    this._scaleY = value;

                    this._transformChanged = true;
                }
            },

            "rotation": {
                get: function () {
                    return this._radian * display.ANG;
                },
                set: function (value) {
                    this.radian = value * display.RAD;
                }
            },

            "radian": {
                get: function () {
                    return this._radian;
                },
                set: function (value) {
                    if(value == this._radian) return;

                    this._radian = value;
                    this._transformChanged = true;
                }
            },

            "anchorX": {
                get: function () {
                    return this._anchorX;
                },
                set: function (value) {
                    if(this._anchorX == value ) return;

                    this._anchorX = value;
                    this._transformChanged = true;
                }
            },

            "anchorY": {
                get: function () {
                    return this._anchorY;
                },
                set: function (value) {
                    if(this._anchorY == value) return;

                    this._anchorY = value;
                    this._transformChanged = true;
                }
            },

            "transform": {
                get: function () {
                    if( this._transformChanged )
                    {
                        var a, b, c, d, tx, ty;

                        if(this._radian == 0)
                        {
                            a = this._scaleX;
                            b = 0;
                            c = 0;
                            d = this._scaleY;
                            tx = this._x;
                            ty = this._y;
                        }
                        else
                        {

                        }

                        this._transform.setTo(
                            a, c, 0, tx,
                            b, d, 0, ty,
                            0, 0, 1, 0,
                            0, 0, 0, 1
                        );
                    }

                    return this._transform;
                }
            },
        });

        this.gl = gl;
        this.setGeometry( w, h );
    }

    DisplayObject.prototype = {

        constructor: DisplayObject,

        setGeometry: function ( w, h ) {

            this.buffer = this.gl.createBuffer();
            this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.buffer );

            var buf = new Float32Array([
                0, 0, 0, 0,
                w, 0, 1, 0,
                w, h, 1, 1,
                0, h, 0, 1
            ]);

            this.gl.bufferData( this.gl.ARRAY_BUFFER, buf, this.gl.STATIC_DRAW );
        },
    };

    display.DisplayObject = DisplayObject;

})();