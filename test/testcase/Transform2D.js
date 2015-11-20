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

        document.getElementById("title").innerHTML = "4x4 matrix sample";

        gl = document.getElementById( "canvas").getContext( "webgl" );
        gl.clearColor( 0,0,0,1 );

        util.createProgram(
            gl,
            [ "shader/VS-Transform2D.cpp", "shader/FS-Transform2D.cpp"],
            (function(program){

                gl.useProgram( program );
                this.program = program;

                this.layout();
                this.onRender( 0 );

            }).bind(this)
        );

        this.onRender = this.draw.bind( this );
    };

    p.clear = function () {

        for (var i = 0; i < this.rects.length; i++) {
            this.rects[i].dispose();
        }

        gl.deleteBuffer( this.indices );
        gl.deleteProgram( this.program );

        webkitCancelRequestAnimationFrame( this.id );
    };

    p.layout = function () {

        this.indices = gl.createBuffer();

        var indices = new Uint16Array([
            0,1,2,  0,2,3
        ]);

        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices );
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW );

        this.rects = [];

        for (var i = 0; i < 500; i++) {
            this.rects.push( this.makeRect( 100 * Math.random(), 100 * Math.random() ) );
            //this.rects.push( this.makeRect( 200, 200 ) );
        }
    };

    p.draw = function ( ms ) {
        gl.clear( gl.COLOR_BUFFER_BIT );

        var r;

        var pos = gl.getAttribLocation( this.program, "pos" );
        gl.enableVertexAttribArray( pos );

        var col = gl.getAttribLocation( this.program, "col" );
        gl.enableVertexAttribArray( col );

        var t = gl.getUniformLocation( this.program, "transform" );

        var stage = gl.getUniformLocation( this.program, "stage" );
        gl.uniform2f( stage, gl.canvas.width, gl.canvas.height );

        var color = gl.getUniformLocation( this.program, "color" );

        for (var i = 0, l = this.rects.length; i < l; i++) {

            r = this.rects[i];

            gl.uniform3fv( color, r.color );

            gl.bindBuffer( gl.ARRAY_BUFFER, r.buffer);
            gl.vertexAttribPointer( pos, 2, gl.FLOAT, false, 4 * 5, 4 * 0 );
            gl.vertexAttribPointer( col, 3, gl.FLOAT, false, 4 * 5, 4 * 2 );

            r.x = gl.canvas.width * ( Math.cos(r.start + ms/500) + 1 ) / 2;
            r.scaleX = 0.5;
            r.scaleY = 0.5;

            r.radian += r.speed;

            this.getMatrix(r);

            gl.uniformMatrix4fv( t, false, r.mat );
            gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );
        }

        this.id = requestAnimationFrame( this.onRender );
    };

    p.makeRect = function ( w, h ) {

        var r = {
            x: 0,
            y: gl.canvas.height * Math.random(),
            radian: 0,
            scaleX: 1,
            scaleY: 1,
            anchorX: 0.5,
            anchorY: 0.5,
            width: w,
            height: h,
            speed: Math.random() * 0.2,
            start: Math.random() * 100,

            dispose: function(){
                gl.deleteBuffer( this.buffer );
                delete this.mat;
            }
        };

        r.color = new Float32Array([ Math.random(), Math.random(), Math.random() ]);

        var ax = 0, ay = 0,
            bx = w, by = h;

        var vertices = new Float32Array([
            ax, ay, 1, 0, 0, // 0
            bx, ay, 0, 0, 1, // 1
            bx, by, 0, 1, 0, // 2
            ax, by, 1, 0, 1, // 3
        ]);

        r.mat = new Float32Array(16);
        this.identity(r.mat);

        r.buffer = gl.createBuffer();

        gl.bindBuffer( gl.ARRAY_BUFFER, r.buffer );
        gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

        return r;
    };

    p.getMatrix = function (r) {

        var a, b, c, d, tx, ty,
            ox = -r.width * r.anchorX,
            oy = -r.height * r.anchorY,
            mat = r.mat,
            t = r.radian;


        if(t == 0.0 )
        {
            a = r.scaleX;
            b = 0;
            c = 0;
            d = r.scaleY;
            tx = r.x + ox * r.scaleX;
            ty = r.y + oy * r.scaleY;
        }
        else
        {
            var cos = Math.cos(t);
            var sin = Math.sin(t);

            a = r.scaleX * cos;
            b = r.scaleX * sin;
            c = r.scaleY * -sin;
            d = r.scaleY * cos;

            tx = r.x + ox * a + oy * c;
            ty = r.y + ox * b + oy * d;
        }

        mat[0] = a,    mat[4] = c,    mat[8] = 0,     mat[12] = tx,
        mat[1] = b,    mat[5] = d,    mat[9] = 0,     mat[13] = ty,
        mat[2] = 0,    mat[6] = 0,    mat[10] = 1,    mat[14] = 0,
        mat[3] = 0,    mat[7] = 0,    mat[11] = 0,    mat[15] = 1;
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