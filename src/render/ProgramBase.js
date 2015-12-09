/****************
 * Program.js
 *****************/

(function () {

    "use strict";

    var render = glbasic.import("render");
    var util = glbasic.import("util");

    var gl;

    ProgramBase.setWebglContext = function( context ){
        gl = context;
    };

    function ProgramBase() {

        this.onLoadItemCompleteListener = this.onLoadComplete.bind( this );

        Object.defineProperties( this, {
            "webGLProgram": {
                get: function () {
                    return this._program;
                }
            },

            "webGLContext": {
                get: function () {
                    console.log( "call context", gl );
                    return gl;
                }
            },
        });
    }

    ProgramBase.prototype = {
        constructor: ProgramBase,

        initWithRemoteSources: function (vertexSourceURL, fragmentSourceURL, onComplete ) {

            this.onReady = onComplete;

            util.loadItems(
                [ vertexSourceURL, fragmentSourceURL ],
                this.onLoadItemCompleteListener
            );

            return this;
        },
        
        initWithSources: function (vertexSource, fragmentSource) {

            this._program = gl.createProgram();
            
            this._vertexShader = this.makeShader( gl.VERTEX_SHADER, vertexSource );
            this._fragmentShader = this.makeShader( gl.FRAGMENT_SHADER, fragmentSource );

            gl.attachShader( this._program, this._vertexShader );
            gl.attachShader( this._program, this._fragmentShader );
            gl.linkProgram( this._program );

            if( !gl.getProgramParameter( this._program, gl.LINK_STATUS ) ){
                throw new Error( "Program Error: " + gl.getProgramInfoLog( this._program ) );
            }

            return this;
        },

        dispose: function () {

            gl.detachShader( this._program, this._vertexShader );
            gl.detachShader( this._program, this._fragmentShader );

            gl.deleteShader( this._vertexShader );
            gl.deleteShader( this._fragmentShader );

            gl.deleteProgram( this._program );
        },

        makeShader: function (type, source) {

            var shader = gl.createShader( type );

            gl.shaderSource( shader, source );
            gl.compileShader( shader );

            if( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ){
                throw new Error( "Shader Error:" + gl.getShaderParameter( shader ) );
            }

            return shader;
        },

        onLoadComplete: function (res) {

            this.initWithSources( res[0], res[1] );

            if( this.onReady )
                this.onReady();
        },

        initAttribs: function () {
            // override
        },
    }

    render.ProgramBase = ProgramBase;

})();

