
/****************
 * createShader.js
 *****************/

(function () {

    "use strict";

    var util = glbasic.import("util");

    function createShader( gl, type, source ) {

        var shader = gl.createShader( type );

        gl.shaderSource( shader, source );
        gl.compileShader( shader );

        if( gl.getShaderParameter( shader, gl.COMPILE_STATUS ) == false )
            throw new Error( "Compile Error > " + gl.getShaderInfoLog( shader ) );

        return shader;
    }

    util.createShader = createShader;

})();