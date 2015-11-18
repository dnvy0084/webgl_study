(function () {

    "use strict";

    var c = test.import("testcase");
    var gl;
    var size = 0.4;

    function DrawTriangle_0() {

    }

    var p = test.extends( DrawTriangle_0, c.BaseCase );

    p.start = function () {

        gl = document.getElementById( "canvas").getContext( "webgl" );
        gl.clearColor( 0,0,0,1 );

        this.program = this.makeProgram();
        this.buffer = this.makeBuffer();
        this.draw();
    };

    p.clear = function () {
        gl.clear( gl.COLOR_BUFFER_BIT );
        gl.deleteBuffer( this.buffer );
        gl.deleteProgram( this.program );
    };


    p.draw = function () {

        gl.clear( gl.COLOR_BUFFER_BIT );
        gl.bindBuffer( gl.ARRAY_BUFFER, this.buffer );

        var pos = gl.getAttribLocation( this.program, "pos" );
        gl.enableVertexAttribArray( pos );
        gl.vertexAttribPointer( pos, 2, gl.FLOAT, false, 4 * 2, 4 * 0 );
        gl.drawArrays( gl.TRIANGLES, 0, 3 );
    };

    p.makeProgram = function () {

        var p = gl.createProgram();

        var vsSrc = [
            "attribute vec2 pos;",

            "void main(){",
            "   gl_Position = vec4( pos, 0, 1 );",
            "}"
        ].join( "\n" );

        var fsSrc = [
            "void main(){",
            "   gl_FragColor = vec4( 1, 0, 0, 1 );",
            "}"
        ].join("\n");

        gl.attachShader(p, this.makeShader(gl.VERTEX_SHADER, vsSrc ));
        gl.attachShader(p, this.makeShader(gl.FRAGMENT_SHADER, fsSrc ));
        gl.linkProgram(p);

        if( gl.getProgramParameter(p, gl.LINK_STATUS) == false )
            throw new Error( "program link error : " + gl.getProgramInfoLog(p) );

        gl.useProgram(p);
        return p;
    };

    p.makeShader = function (type, source) {

        var shader = gl.createShader( type );

        gl.shaderSource( shader, source );
        gl.compileShader( shader );

        if( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) )
            throw new Error( "glsl Compile error : " + gl.getShaderInfoLog( shader ) );

        return shader;
    };

    p.makeBuffer = function () {

        var buffer = gl.createBuffer();
        var a = [
            0, size,
            size, -size,
            -size, -size,
        ];

        var vertices = new Float32Array(a);

        gl.bindBuffer( gl.ARRAY_BUFFER, buffer );
        gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

        return buffer;
    };


    c.DrawTriangle_0 = DrawTriangle_0;

})();