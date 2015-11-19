
/****************
 * ConvertPosWithVertexShader.js
 *****************/

(function () {

    "use strict";

    var c = test.import("testcase");
    var util = glbasic.import("util");

    var gl;

    function ConvertPosWithVertexShader() {

    }

    var p = test.extends( ConvertPosWithVertexShader, c.BaseCase );

    p.start = function () {

        document.getElementById("title").innerHTML = "convert to pixel postion with vertexShader";

        gl = document.getElementById( "canvas").getContext( "webgl" );
        gl.clearColor( 0, 0, 0, 1 );

        this.rects = [];

        for (var i = 0; i < 50; i++) {
            this.rects.push( this.makeRect(
                Math.random() * 400,
                Math.random() * 300,
                Math.random() * 100 + 10,
                Math.random() * 100 + 10,
                [ Math.random(), Math.random(), Math.random() ]
            ));
        }


        util.loadItems( ["shader/VS-pixelPosConvert.cpp", "shader/FS-customColor.cpp"],
            ( function( responses ){
                this.makeProgram( responses[0], responses[1] );
                this.draw();
            } ).bind( this )
        )
    };

    p.clear = function () {

        gl.clear( gl.COLOR_BUFFER_BIT );

        for (var i = 0; i < this.rects.length; i++) {
            gl.deleteBuffer( this.rects[i].vertexBuffer );
            gl.deleteBuffer( this.rects[i].indexBuffer );
        }

        gl.deleteProgram( this.program );
    };


    p.draw = function () {
        gl.clear( gl.COLOR_BUFFER_BIT );

        var r;
        var pos = gl.getAttribLocation( this.program, "pos" );
        gl.enableVertexAttribArray(pos);

        var clipspace = gl.getUniformLocation(this.program, "clipspace" );
        var clipspaceVector = new Float32Array([ gl.canvas.width, gl.canvas.height ]);

        var color = gl.getUniformLocation( this.program, "color" );

        for (var i = 0; i < this.rects.length; i++) {

            r = this.rects[i];

            gl.bindBuffer( gl.ARRAY_BUFFER, r.vertexBuffer);
            gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 4 * 2, 4 * 0 );
            gl.uniform2fv(clipspace, clipspaceVector);
            gl.uniform3f( color, r.color[0], r.color[1], r.color[2] );
            //gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, r.indexBuffer);
            gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );
        }
    };

    p.makeRect = function ( x, y, w, h, color ) {

        var r = {};
        var vertices = this.makeVertices( x, y, w, h );
        var indices = new Uint16Array([
            0, 1, 2,
            0, 2, 3,
        ]);

        r.vertexBuffer = this.makeBuffer( gl.ARRAY_BUFFER, vertices );
        r.indexBuffer = this.makeBuffer( gl.ELEMENT_ARRAY_BUFFER, indices );
        r.color = color;

        return r;
    };

    p.makeVertices = function ( x, y, w, h ) {

        var a = [
            x, y,
            x + w, y,
            x + w, y + h,
            x, y + h
        ];

        return new Float32Array(a);
    };

    p.makeBuffer = function ( target, data ) {

        var buffer = gl.createBuffer();

        gl.bindBuffer( target, buffer );
        gl.bufferData( target, data, gl.STATIC_DRAW );

        return buffer;
    };

    p.makeProgram = function ( vssrc, fssrc ) {

        this.program = gl.createProgram();

        gl.attachShader( this.program, util.createShader( gl, gl.VERTEX_SHADER, vssrc ) );
        gl.attachShader( this.program, util.createShader( gl, gl.FRAGMENT_SHADER, fssrc ) );
        gl.linkProgram( this.program );

        if( gl.getProgramParameter(this.program, gl.LINK_STATUS) == false )
            throw new Error( "LINK Error > " + gl.getProgramInfoLog( this.program ) );

        gl.useProgram( this.program );
    };

    c.ConvertPosWithVertexShader = ConvertPosWithVertexShader;

})();