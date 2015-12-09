/****************
 * SolidColorProgram.js
 *****************/

(function () {

    "use strict";

    var render = glbasic.import("render");

    var gl;

    SolidColorProgram.COMPONENT_SIZE = 2;
    SolidColorProgram.DATA_PER_VERTEX = 4 * 2;
    SolidColorProgram.VERTEX_OFFSET = 0;

    function SolidColorProgram() {

        render.ProgramBase.call( this );

        var vertexSource =

            "attribute vec2 pos;" +

            "uniform mat3 transform;" +
            "uniform vec2 stage;" +

            "void main(){" +
                "vec2 p = ( transform * vec3( pos, 1.0 ) ).xy / stage * 2.0 - 1.0;" +
                "gl_Position = vec4( p.x, -p.y, 0, 1 );" +
            "}";

        var fragmentSource =

            "precision highp float;" +

            "uniform vec3 color;" +

            "void main(){" +
                "gl_FragColor = vec4( color, 1.0 );" +
            "}";

        gl = this.webGLContext;

        this.initWithSources( vertexSource, fragmentSource );
        this.initAttribs();
    }

    var p = glbasic.extends( SolidColorProgram, render.ProgramBase );

    p.initAttribs = function () {

        gl.useProgram( this._program );

        this.pos = gl.getAttribLocation( this._program, "pos" );

        this.transform = gl.getUniformLocation( this._program, "transform" );
        this.stage = gl.getUniformLocation( this._program, "stage" );
    };

    p.enable = function () {

        gl.useProgram( this._program );

        gl.enableVertexAttribArray( this.pos );
        gl.uniform2f( this.stage, gl.canvas.width, gl.canvas.height );
    };

    p.render = function (object) {

        gl.bindBuffer( object.buffer );

        gl.vertexAttribPointer(
            this.pos,
            SolidColorProgram.COMPONENT_SIZE,
            gl.FLOAT,
            false,
            SolidColorProgram.VERTEX_OFFSET
        );

        gl.uniformMatrix3fv( this.transform, false, object.transformMatrix.raw );
    };

    render.SolidColorProgram = SolidColorProgram;

})();

