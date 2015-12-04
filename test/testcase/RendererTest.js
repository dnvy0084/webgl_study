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
            this.draw();
        }).bind(this);
    };

    p.draw = function () {




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
    };

    c.RendererTest = RendererTest;

})();

