/****************
 * RendererTest.js
 *****************/

(function () {

    "use strict";

    var c = test.import("testcase");

    var render = glbasic.import("render");
    var Renderer = render.Renderer;

    var util = glbasic.import("util");

    var gl;

    function RendererTest() {

    }

    var p = test.extends(RendererTest, c.BaseCase);

    p.start = function () {

        this.setTitle( "renderer test" );

        gl = document.getElementById("canvas").getContext( "webgl" );
        gl.clearColor( 0, 0, 0, 1 );

        util.loadItems(
            [ "shader/quadVertexShader.cpp", "shader/colorMatrixFragmentShader.cpp"],
            (function(res){
                this.renderer = new Renderer( gl ).initWithSources( res[0], res[1] );
                this.renderer.stageSize = { x: gl.canvas.width, y: gl.canvas.height };

                this.loadImage();
            }).bind(this)
        );
    };

    p.clear = function () {

        this.setTitle( "" );
        this.renderer.dispose();
    };

    p.loadImage = function () {

        var img = document.createElement( "img" );
        img.src = "img/b.jpg";
        img.onload = (function(e){
            this.setGeometry( img );
            this.createTexture( img );
            this.draw();
        }).bind(this);
    };

    p.draw = function () {

        gl.clear( gl.COLOR_BUFFER_BIT );

        gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
        gl.vertexAttribPointer( this.renderer._pos, 2, gl.FLOAT, false, 4 * 4, 0 );
        gl.vertexAttribPointer( this.renderer._uv, 2, gl.FLOAT, false, 4 * 4, 4 * 2 );

        gl.uniformMatrix3fv( this.renderer._mat, false, this.mat );

        gl.bindTexture( gl.TEXTURE_2D, this.tex );
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer );
        gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );
    };

    p.createTexture = function (img) {

        this.tex = gl.createTexture();

        gl.bindTexture( gl.TEXTURE_2D, this.tex );
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img );
    };

    p.setGeometry = function ( img ) {

        this.vertexBuffer = gl.createBuffer();

        var vertices = new Float32Array([
            0, 0, 0, 0,
            img.width, 0, 1, 0,
            img.width, img.height, 1, 1,
            0, img.height, 0, 1,
        ]);

        gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

        this.indexBuffer = gl.createBuffer();

        var indices = new Uint16Array([
            0, 1, 2, 0, 2, 3
        ]);

        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer );
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW );

        this.mat = new Float32Array([
            0.05, 0, 0,
            0, 0.05, 0,
            10, 10, 1,
        ]);
    };

    c.RendererTest = RendererTest;

})();

