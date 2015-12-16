/**
 * Created by dnvy0084 on 2015. 11. 21..
 */

(function () {

    "use strict";

    var display = glbasic.import("display");
    var geom = glbasic.import("geom");

    var RAD = 180 / Math.PI;
    var ANG = Math.PI / 180;

    var gl;

    DisplayObject.initIndexBuffer = function( webglContext ){

        gl = webglContext;

        DisplayObject.indexBuffer = gl.createBuffer();

        var indices = new Uint16Array([
            0, 1, 2,    0, 2, 3
        ]);

        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, DisplayObject.indexBuffer );
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW );
    };

    function DisplayObject() {

        this._x = 0;
        this._y = 0;
        this._scaleX = 1.0;
        this._scaleY = 1.0;
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
                    return this._radian * ANG;
                },
                set: function (value) {
                    this.radian = value * RAD;
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
    }

    DisplayObject.prototype = {

        constructor: DisplayObject,

        initWithImage: function ( webglContext, image ) {

            if( !gl ) gl = webglContext;
            this._image = image;

            this.setGeometry( this._image.width, this._image.height );
            this.setTexture();
        },

        setGeometry: function ( w, h ) {

            this.vertexBuffer = gl.createBuffer();

            var buf = new Float32Array([
                0, 0, 0, 0,
                w, 0, 1, 0,
                w, h, 1, 1,
                0, h, 0, 1
            ]);

            gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
            gl.bufferData( gl.ARRAY_BUFFER, buf, this.vertexBuffer );
        },

        setTexture: function () {

            this.texture = gl.createTexture();

            gl.bindTexture( gl.TEXTURE_2D, this.texture );
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
            gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._image );
        },

        render: function (renderer) {

        },
    };

    display.DisplayObject = DisplayObject;

})();