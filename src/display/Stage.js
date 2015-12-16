/****************
 * Stage.js
 *****************/

(function () {

    "use strict";

    var display = glbasic.import("display");
    var gl;

    function Stage( canvas ) {

        display.DisplayObjectContainer.call( this );

        if( typeof canvas == "string" )
            gl = document.getElementById( canvas).getContext( "webgl" );
        else
            gl = canvas.getContext( "webgl" );

        this.id = 0;
        this.superRender = display.DisplayObjectContainer.prototype.render.bind( this );

        this.onUpdate = this.update.bind( this );
        this.onUpdate( 0 );

        Object.defineProperties( this, {

            "renderer": {
                get: function () {
                    return this._renderer;
                }
            },

            "webglContext": {
                get: function () {
                    return gl;
                }
            },

            "background": {
                get: function () {
                    var a = gl.getParameter( gl.COLOR_CLEAR_VALUE );

                    return  parseInt( a[3] * 255 ) << 24 |
                            parseInt( a[0] * 255 ) << 16 |
                            parseInt( a[1] * 255 ) << 8 |
                            parseInt( a[2] * 255 );
                },
                set: function (value) {

                    var a = ( value >> 24 & 0xff ) / 255,
                        r = ( value >> 16 & 0xff ) / 255,
                        g = ( value >> 8 & 0xff ) / 255,
                        b = ( value & 0xff ) / 255;

                    gl.clearColor( r, g, b, a );
                }
            },
        });
    }

    var p = glbasic.extends( Stage, display.DisplayObjectContainer );

    p.initWithRenderer = function (renderer) {

        this._renderer = renderer;
    };

    p.update = function ( time ) {

        this.id = requestAnimationFrame( this.onUpdate );

        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

        this.superRender( this, [ this._renderer ] );
    };

    display.Stage = Stage;

})();

