/****************
 * TestSyncBuffer.js
 *****************/

(function () {

    "use strict";

    var c = test.import("testcase");
    var render = glbasic.import("render");
    var Renderer = render.Renderer;
    var util = glbasic.import("util");

    var gl;

    function TestSyncBuffer() {

    }

    var p = test.extends(TestSyncBuffer, c.BaseCase);

    p.start = function () {

        this.setTitle( "buffer sync test" );

        gl = document.getElementById( "canvas").getContext( "webgl" );
        gl.clearColor( 0, 0, 0, 1 );

        this.render = new Renderer();

        util.loadItems(
            [ "shader/basicQuadShader.cpp", "shader/basicFragmentShader.cpp" ],
            (function( res ){

                console.log( res );

            }).bind(this)
        )
    };

    p.clear = function () {

    };

    p.makeQuad = function ( w, h ) {
        var r = {};

        r.vertices = new Float32Array([
            0, 0,
            w, 0,
            w, h,
            0, h
        ]);

        r.buffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, r.buffer );
        gl.bufferData( gl.ARRAY_BUFFER, r.vertices, gl.STATIC_DRAW );
    };

    c.TestSyncBuffer = TestSyncBuffer;

})();

