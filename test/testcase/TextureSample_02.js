/**
 * Created by dnvy0084 on 2015. 11. 24..
 */

(function () {

    "use strict";

    var c = test.import("testcase");
    var display = glbasic.import("display");
    var DisplayObject = display.DisplayObject;
    var util = glbasic.import("util");

    var gl;

    function TextureSample_02() {

    }

    var p = glbasic.extends( TextureSample_02, c.BaseCase );

    p.start = function () {

        gl = document.getElementById( "canvas").getContext( "webgl" );
        document.getElementById( "title").innerHTML = "texture sample 02";

        gl.clearColor( 0,0,0, 1 );

        util.createProgram(
            gl,
            [ "shader/VS-TextureSample02.cpp", "shader/FS-TextureSample02.cpp" ],
            (function(p){
                this.initProgram( p );
            }).bind(this)
        );
    };

    p.clear = function () {
        console.log( "clear", this.constructor.name );
    };

    p.initProgram = function (p) {
        this.program = p;

        gl.useProgram( this.program );

        this.program.pos = gl.getAttribLocation( this.program, "pos" );
        this.program.uv = gl.getAttribLocation( this.program, "uv" );

        //gl.enableVertexAttribArray( this.program.pos );
        //gl.enableVertexAttribArray( this.program.uv );

        this.program.stage = gl.getUniformLocation( this.program, "stage" );
        this.program.mat = gl.getUniformLocation( this.program, "mat" );

        gl.uniform2f( this.program.stage, gl.canvas.width, gl.canvas.height );

        this.img = document.createElement( "img" );
        this.img.src = "img/a.jpg";
        this.img.onload = ( function(e){

            this.setGeometry();
            this.makeTexture();
            this.draw();

        }).bind(this);
    };

    p.draw = function () {

        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

        var mat = new Float32Array([
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        ]);

        gl.uniform2f( this.program.stage, gl.canvas.width, gl.canvas.height );
        gl.uniformMatrix4fv( this.program.mat, false, mat );

        gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
        gl.vertexAttribPointer( this.program.pos, 2, gl.FLOAT, false, 4 * 4, 4 * 0 );
        gl.vertexAttribPointer( this.program.uv, 2, gl.FLOAT, false, 4 * 4, 4 * 2 );

        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices );
        gl.bindTexture( gl.TEXTURE_2D, this.tex );

        gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );
    };

    p.setGeometry = function () {

        this.vertexBuffer = gl.createBuffer();
        this.indices = gl.createBuffer();

        var w = this.img.clientWidth / 5;
        var h = this.img.clientHeight / 5;

        var vertices = new Float32Array([
            0, 0, 0, 0,
            w, 0, 1, 0,
            w, h, 1, 1,
            0, h, 0, 1
        ]);

        gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

        var indices = new Uint16Array([
            0, 1, 2,
            0, 2, 3
        ]);

        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices );
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW );
    };

    p.makeTexture = function () {

        this.tex = gl.createTexture();

        gl.bindTexture( gl.TEXTURE_2D, this.tex );

        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.img );
    };

    c.TextureSample_02 = TextureSample_02;

})();