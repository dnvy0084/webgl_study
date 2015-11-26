/**
 * Created by dnvy0084 on 2015. 11. 24..
 */

(function () {

    "use strict";

    var c = test.import("testcase");
    var DisplayObject = glbasic.import("display.DisplayObject");
    var util = glbasic.import("util");

    var gl;

    function TextureSample_02() {

    }

    var p = glbasic.extends( TextureSample_02, c.BaseCase );

    p.start = function () {

        gl = document.getElementById( "canvas").getContext( "webgl" );
        document.getElementById( "title").innerHTML = "texture sample 02";

        util.createProgram( gl, [ "shader/VS-TextureSample02.cpp", "shader/FS-TextureSample02.cpp" ], function(p){
            this.initProgram( p );
        });
    };

    p.clear = function () {
        console.log( "clear", this.constructor.name );
    };

    p.initProgram = function (p) {
        this.program = p;

        gl.useProgram( this.program );

        this.program.pos = gl.getAttribLocation( this.program, "pos" );
        this.program.uv = gl.getAttribLocation( this.program, "uv" );

        this.program.stage = gl.getUniformLocation( this.program, "stage" );
        this.program.mat = gl.getUniformLocation( this.program, "mat" );

        gl.uniform2f( this.program.stage, gl.canvas.width, gl.canvas.height );

        this.initRect();
    };

    p.initRect = function () {

        this.rect = new DisplayObject( )
    };

    c.TextureSample_02 = TextureSample_02;

})();