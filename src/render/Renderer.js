/**
 * Created by dnvy0084 on 15. 12. 4..
 */

(function () {

    var render = glbasic.import("render");

    var gl, pos, uv, mat, colorMat, stage;

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

                    gl.uniform2f( stage, value.x, value.y );
                }
            },
        });
    }

    Renderer.prototype = {
        constructor: Renderer,

        initWithSources: function (vertexShaderSource, fragmentShaderSource) {

            this._program = gl.createProgram();

            gl.attachShader( this._program, this.makeShader( gl.VERTEX_SHADER, vertexShaderSource ) );
            gl.attachShader( this._program, this.makeShader( gl.FRAGMENT_SHADER, fragmentShaderSource ) );
            gl.linkProgram( this._program );

            if( !gl.getProgramParameter( this._program, gl.LINK_STATUS ) ){
                throw new Error( gl.getProgramInfoLog( this._program ) );
            }

            this.initProgram();
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

            pos = gl.getAttribLocation( this._program, "pos" );
            uv = gl.getAttribLocation( this._program, "uv" );

            stage = gl.getUniformLocation( this._program, "stage" );
            mat = gl.getUniformLocation( this._program, "mat" );
            colorMat = gl.getUniformLocation( this._program, "colorMat" );
        },
    }

    render.Renderer = Renderer;

})();