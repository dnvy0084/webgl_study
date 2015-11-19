/**
 * Created by dnvy0084 on 2015. 11. 19..
 */

(function () {

    "use strict";

    var c = test.import("testcase");
    var util = glbasic.import("util");

    var gl;

    function Transform2D() {
        
    }

    var p = test.extends( Transform2D, c.BaseCase );

    p.start = function () {

        gl = document.getElementById( "canvas").getContext( "webgl" );
        gl.clearColor( 0,0,0,1 );

        util.createProgram(
            gl,
            [ "shader/VS-Transform2D.cpp", "shader/FS-Transform2D.cpp"],
            (function(program){

                gl.useProgram( program );
                this.program = program;

                this.layout();
                this.draw();

            }).bind(this)
        );
    };

    p.clear = function () {
        console.log( "clear", this.constructor.name );
    };

    p.layout = function () {

        this.indices = gl.createBuffer();

        var indices = new Uint16Array([
            0,1,2,  0,2,3
        ]);

        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices );
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW );

        this.rects = [];

        for (var i = 0; i < 1; i++) {
            this.rects.push( this.makeRect( 100, 100 ) );
        }
    };

    p.draw = function () {
        gl.clear( gl.COLOR_BUFFER_BIT );

        var r;

        var pos = gl.getAttribLocation( this.program, "pos" );
        gl.enableVertexAttribArray( pos );

        var t = gl.getUniformLocation( this.program, "transform" );

        var stage = gl.getUniformLocation( this.program, "stage" );
        gl.uniform2f( stage, gl.canvas.width, gl.canvas.height );

        var color = gl.getUniformLocation( this.program, "color" );
        gl.uniform3f( color, 1,0,0 );

        for (var i = 0, l = this.rects.length; i < l; i++) {
            r = this.rects[i];
            gl.bindBuffer( gl.ARRAY_BUFFER, r.buffer);
            gl.vertexAttribPointer( pos, 2, gl.FLOAT, false, 4 * 2, 4 * 0 );

            this.translate(r.mat, 100, 50 );

            gl.uniformMatrix4fv( t, false, r.mat );
            gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );

            console.log(r.mat);
        }
    };

    p.makeRect = function ( w, h ) {

        var r = { x: 0, y: 0 };

        var ax = 0, ay = 0,
            bx = w, by = h;

        var vertices = new Float32Array([
            ax, ay,
            bx, ay,
            bx, by,
            ax, by
        ]);

        r.mat = new Float32Array(16);
        this.identity(r.mat);

        r.buffer = gl.createBuffer();

        gl.bindBuffer( gl.ARRAY_BUFFER, r.buffer );
        gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

        return r;
    };

    p.identity = function ( mat ) {
        mat[0] = 1, mat[4] = 0, mat[8] = 0, mat[12] = 0,
        mat[1] = 0, mat[5] = 1, mat[9] = 0, mat[13] = 0,
        mat[2] = 0, mat[6] = 0, mat[10] = 1, mat[14] = 0,
        mat[3] = 0, mat[7] = 0, mat[11] = 0, mat[15] = 1;
    };

    p.translate = function (mat,x,y) {
        mat[0] = 1, mat[4] = 0, mat[8] = 0, mat[12] += x,
        mat[1] = 0, mat[5] = 1, mat[9] = 0, mat[13] += y,
        mat[2] = 0, mat[6] = 0, mat[10] = 1, mat[14] = 0,
        mat[3] = 0, mat[7] = 0, mat[11] = 0, mat[15] = 1;
    };

    c.Transform2D = Transform2D;

})();