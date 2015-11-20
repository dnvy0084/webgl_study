/****************
 * TextureSample.js
 *****************/

(function () {

    "use strict";

    var c = test.import("testcase");
    var util = glbasic.import("util");

    var gl;

    function TextureSample() {

    }

    var p = test.extends( TextureSample, c.BaseCase );

    p.start = function () {

        document.getElementById( "title").innerHTML = "basic Texture sample";
        gl = document.getElementById( "canvas").getContext( "webgl" );

        util.createProgram(
            gl,
            [ "shader/VS-TextureSample.cpp", "shader/FS-TextureSample.cpp" ],
            ( function(program){

                this.program = program;
                this.initProgram();
                this.layout();
            }).bind( this )
        );
    };

    p.clear = function () {

    };

    p.initProgram = function () {

        gl.useProgram( this.program );

        this.program.pos = gl.getAttribLocation( this.program, "pos" );
        this.program.uv = gl.getAttribLocation( this.program, "uv" );

        gl.enableVertexAttribArray( this.program.pos );
        gl.enableVertexAttribArray( this.program.uv );

        this.program.mat = gl.getUniformLocation( this.program, "mat" );
        this.program.stage = gl.getUniformLocation( this.program, "stage" );
    };

    p.layout = function () {

        this.img = document.createElement( "img" );
        this.img.onload = ( function( e ){
            this.img.style.visibility = "hidden";
            document.body.appendChild( this.img );

            this.makeTexture( this.img );
        }).bind(this);

        this.img.src = "img/a.jpg";
    };

    p.makeTexture = function ( img ) {

        this.tex = gl.createTexture();

        gl.bindTexture( gl.TEXTURE_2D, this.tex );

        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img );
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
            ax, ay, 0, 0,
            bx, ay, 1, 0,
            bx, by, 1, 1,
            ax, by, 0, 1,
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

    c.TextureSample = TextureSample;

})();

