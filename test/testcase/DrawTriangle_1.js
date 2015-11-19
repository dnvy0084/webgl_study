
/****************
 * DrawTriangle_1.js
 *****************/

(function () {

    "use strict";

    var c = test.import("testcase");
    var gl, size = 0.5;

    function DrawTriangle_1() {

    }

    var p = test.extends( DrawTriangle_1, c.BaseCase );

    p.start = function () {

        document.getElementById( "title" ).innerHTML = "draw triangle with glDrawElements";
        gl = document.getElementById( "canvas").getContext( "webgl" );
        gl.clearColor( 0,0,0,1 );

        this.makeBuffer();
        this.makeProgram();
        this.draw();
    };

    p.clear = function () {

        gl.clear( gl.COLOR_BUFFER_BIT );
        gl.deleteBuffer( this.vertexBuffer );
        gl.deleteBuffer( this.indexBuffer );
        gl.deleteProgram( this.program );
    };

    p.draw = function () {

        gl.clear( gl.COLOR_BUFFER_BIT );
        gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );

        var pos = gl.getAttribLocation( this.program, "pos" );
        gl.enableVertexAttribArray( pos );
        gl.vertexAttribPointer( pos, 2, gl.FLOAT, false, 4 * 2, 4 * 0 );

        //gl.drawArrays( gl.TRIANGLES, 0, 3 );

        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer );
        gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );
    };

    p.makeProgram = function () {

        this.program = gl.createProgram();

        var vssrc = [
            "attribute vec2 pos;",
            "void main(){",
            "   gl_Position = vec4(pos, 0, 1);",
            "}"
        ].join("\n");

        var fssrc = [
            "void main(){",
            "   gl_FragColor = vec4(1,0,0,1);",
            "}"
        ].join("\n");

        gl.attachShader( this.program, this.makeShader( gl.VERTEX_SHADER, vssrc ) );
        gl.attachShader( this.program, this.makeShader( gl.FRAGMENT_SHADER, fssrc ) );
        gl.linkProgram( this.program );

        if(gl.getProgramParameter(this.program, gl.LINK_STATUS) == false )
            throw new Error( "link error " + gl.getProgramInfoLog( this.program ) );

        gl.useProgram( this.program );
    };

    p.makeShader = function (type, source) {

        var shader = gl.createShader( type );
        gl.shaderSource( shader, source );
        gl.compileShader( shader );

        if( gl.getShaderParameter( shader, gl.COMPILE_STATUS ) == false )
            throw new Error( "shader compile error " + gl.getShaderInfoLog(shader) );

        return shader;
    };

    p.makeBuffer = function () {
        this.vertexBuffer = gl.createBuffer();
        this.indexBuffer = gl.createBuffer();

        var vertices = new Float32Array([
            -size, size,
            size, size,
            size, -size,
            -size, -size,
        ]);

        gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

        var indices = new Uint16Array([
            0, 1, 2,
            0, 2, 3,
        ]);

        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer );
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW );
    };

    c.DrawTriangle_1 = DrawTriangle_1;

})();