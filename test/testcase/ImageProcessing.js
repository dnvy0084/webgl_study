/**
 * Created by dnvy0084 on 2015. 11. 21..
 */

(function () {

    "use strict";

    var c = test.import("testcase");
    var util = glbasic.import("util");
    var display = glbasic.import("display");
    var DisplayObject = display.DisplayObject;

    var gl;

    function ImageProcessing() {

    }

    var p = glbasic.extends( ImageProcessing, c.BaseCase );

    p.start = function () {

        document.getElementById( "title").innerHTML = "image processing sample";
        gl = document.getElementById( "canvas").getContext( "webgl" );
        gl.clearColor( 0,0,0,1 );

        util.createProgram( gl, [ "shader/VS-ImageProcessing.cpp", "shader/FS-ImageProcessing.cpp"], (function(p){
            this.initProgram(p);
        }).bind(this));
    };

    p.clear = function () {
        console.log( "clear", this.constructor.name );
    };

    p.initProgram = function (p) {
        this.program = p;

        this.program.pos = gl.getAttribLocation( this.program, "pos" );
        this.program.uv = gl.getAttribLocation( this.program, "uv" );

        gl.enableVertexAttribArray( this.program.pos );
        gl.enableVertexAttribArray( this.program.uv );

        this.program.mat = gl.getUniformLocation( this.program, "mat" );
        this.program.stage = gl.getUniformLocation( this.program, "stage" );

        gl.useProgram(p);
        gl.uniform2f( this.program.stage, gl.canvas.width, gl.canvas.height );

        this.initTexture();
    };

    p.initTexture = function () {

        var img = document.createElement( "img" );
        img.src = "img/a.jpg";
        img.style.position = "absolute";
        img.style.left = "100000px";

        img.onload = (function(){

            document.body.appendChild(img);
            this.tex = gl.createTexture();

            gl.bindTexture( gl.TEXTURE_2D, this.tex );

            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );

            gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img );

            var scale = 300 / img.clientHeight;

            this.layout( img.clientWidth * scale, img.clientHeight * scale );

        }).bind(this);
    };

    p.layout = function ( w, h ) {

        this.indices = gl.createBuffer();

        var buf = new Uint16Array([
            0,1,2, 0,2,3
        ]);

        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices );
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, buf, gl.STATIC_DRAW);

        this.picture = new DisplayObject( w, h, gl );
        this.picture.x = ( gl.canvas.width - w ) / 2;
        this.onRender = this.draw.bind( this );

        this.draw();
    };

    p.draw = function () {

        gl.clear( gl.COLOR_BUFFER_BIT );

        gl.bindBuffer( gl.ARRAY_BUFFER, this.picture.buffer );

        gl.vertexAttribPointer( this.program.pos, 2, gl.FLOAT, false, 4 * 4, 4 * 0 );
        gl.vertexAttribPointer( this.program.uv, 2, gl.FLOAT, false, 4 * 4, 4 * 2 );
        gl.uniformMatrix4fv( this.program.mat, false, this.picture.transform.raw );

        gl.bindTexture( gl.TEXTURE_2D, this.tex );
        gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );

        this.id = requestAnimationFrame( this.onRender );
    };

    c.ImageProcessing = ImageProcessing;

})();