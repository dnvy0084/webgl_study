/****************
 * createProgram.js
 *****************/

(function () {

    "use strict";

    var util = glbasic.import("util");

    function createProgram( gl, remoteSources, onComplete ) {

        var program = gl.createProgram();

        util.loadItems( remoteSources, function(responses){
            gl.attachShader( program, util.createShader(gl, gl.VERTEX_SHADER, responses[0] ) );
            gl.attachShader( program, util.createShader(gl, gl.FRAGMENT_SHADER, responses[1] ) );
            gl.linkProgram( program );

            if( gl.getProgramParameter(program, gl.LINK_STATUS) == false )
                throw new Error( "LINK_ERROR > " + gl.getProgramInfoLog(program) );

            onComplete( program );
        });
    }

})();

