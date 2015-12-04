/**
 * Created by dnvy0084 on 15. 12. 4..
 */

(function () {

    var render = glbasic.import("render");

    var gl;

    function Renderer( webglContext ) {

        gl = webglContext;

        this._program = null;

        this._stageSize = { x: 0, y: 0 };

        Object.defineProperties( this, {
            "webglContext": {
                get: function () {
                    return gl;
                }
            },

            "program": {
                get: function () {
                    return this._program;
                }
            },

            "stageSize": {
                get: function () {
                    return this._stageSize;
                },
                set: function (value) {

                    if(!( value.hasOwnProperty("x") && value.hasOwnProperty("y") ) )
                        throw new Error( "wrong value" );

                    this._stageSize.x = value.x;
                    this._stageSize.y = value.y;

                    gl.uniform2f( this._stage, value.x, value.y );
                }
            },
        });
    }

    Renderer.prototype = {
        constructor: Renderer,

        initWithSources: function (vertexShaderSource, fragmentShaderSource) {

            this._program = gl.createProgram();

            this._vertexShader = this.makeShader( gl.VERTEX_SHADER, vertexShaderSource );
            this._fragmentShader = this.makeShader( gl.FRAGMENT_SHADER, fragmentShaderSource );

            gl.attachShader( this._program, this._vertexShader );
            gl.attachShader( this._program, this._fragmentShader );
            gl.linkProgram( this._program );

            if( !gl.getProgramParameter( this._program, gl.LINK_STATUS ) ){
                throw new Error( gl.getProgramInfoLog( this._program ) );
            }

            this.initProgram();

            return this;
        },

        dispose: function () {

            gl.detachShader( this._program, this._vertexShader );
            gl.detachShader( this._program, this._fragmentShader );

            gl.deleteShader( this._vertexShader );
            gl.deleteShader( this._fragmentShader );

            gl.deleteProgram( this._program );
        },

        makeShader: function( type, source ){

            var shader = gl.createShader( type );

            gl.shaderSource( shader, source );
            gl.compileShader( shader );

            if( !gl.getShaderParameter( shader, gl.COMPILE_STATUS ) ){
                throw new Error( gl.getShaderInfoLog(shader) );
            }

            return shader;
        },

        initProgram: function () {

            gl.useProgram( this._program );

            this._pos = gl.getAttribLocation( this._program, "pos" );
            this._uv = gl.getAttribLocation( this._program, "uv" );

            this._mat = gl.getUniformLocation( this._program, "mat" );
            this._colorMat = gl.getUniformLocation( this._program, "colorMat" );

            this._stage = gl.getUniformLocation( this._program, "stage" );
        },
    }

    render.Renderer = Renderer;

})();