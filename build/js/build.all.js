
/****************
 * namespace.js
 *****************/

(function ( global ) {

    "use strict";

    if( global.usenamespace ) return;

    global.usenamespace = function( namespace ){

        function __find( a, at ){
            var n = a.length;
            var name = a[0];

            if( !at.hasOwnProperty(name) ){
                at[name] = {};
            }

            if( n == 1 ) return at[name];

            return __find(a.splice(1, n-1), at);
        }

        if( !namespace.extends ){
            namespace.extends = function( a, b ){
                a.prototype = Object.create(b.prototype);
                a.prototype.constructor = a;

                return a.prototype;
            }
        }

        if( !namespace.import ){
            namespace.import = function( name ){
                return __find( name.split("."), namespace );
            }
        }

        return namespace;
    };

})( typeof window === "undefined" ? this : window );

/****************
 * srcmain.js
 *****************/

(function ( global ) {

    "use strict";

    global.glbasic = usenamespace( global.glbasic || {} );

})( typeof window === "undefined" ? this : window );
/**
 * Created by dnvy0084 on 2015. 11. 21..
 */

(function () {

    "use strict";

    var display = glbasic.import("display");
    var geom = glbasic.import("geom");

    display.RAD = 1 * 180 / Math.PI;
    display.ANG = 1 * Math.PI / 180;

    function DisplayObject( w, h, gl ) {

        this._x = 0;
        this._y = 0;
        this._scaleX = 1;
        this._scaleY = 1;
        this._radian = 0;
        this._anchorX = 0;
        this._anchorY = 0;

        this._transform = new geom.Matrix3D();

        this._transformChanged = true;

        Object.defineProperties( this, {

            "x": {
                get: function () {
                    return this._x;
                },
                set: function (value) {
                    if(this._x == value ) return;

                    this._x = value;
                    this._transformChanged = true;
                }
            },

            "y": {
                get: function () {
                    return this._y;
                },
                set: function (value) {
                    if(this._y == value ) return;

                    this._y = value;
                    this._transformChanged = true;
                }
            },

            "scaleX": {
                get: function () {
                    return this._scaleX;
                },
                set: function (value) {
                    if(this._scaleX == value ) return;

                    this._scaleX = value;
                    this._transformChanged = true;
                }
            },

            "scaleY": {
                get: function () {
                    return this._scaleY;
                },
                set: function (value) {
                    if(this._scaleY == value ) return;
                    this._scaleY = value;

                    this._transformChanged = true;
                }
            },

            "rotation": {
                get: function () {
                    return this._radian * display.ANG;
                },
                set: function (value) {
                    this.radian = value * display.RAD;
                }
            },

            "radian": {
                get: function () {
                    return this._radian;
                },
                set: function (value) {
                    if(value == this._radian) return;

                    this._radian = value;
                    this._transformChanged = true;
                }
            },

            "anchorX": {
                get: function () {
                    return this._anchorX;
                },
                set: function (value) {
                    if(this._anchorX == value ) return;

                    this._anchorX = value;
                    this._transformChanged = true;
                }
            },

            "anchorY": {
                get: function () {
                    return this._anchorY;
                },
                set: function (value) {
                    if(this._anchorY == value) return;

                    this._anchorY = value;
                    this._transformChanged = true;
                }
            },

            "transform": {
                get: function () {
                    if( this._transformChanged )
                    {
                        var a, b, c, d, tx, ty;

                        if(this._radian == 0)
                        {
                            a = this._scaleX;
                            b = 0;
                            c = 0;
                            d = this._scaleY;
                            tx = this._x;
                            ty = this._y;
                        }
                        else
                        {

                        }

                        this._transform.setTo(
                            a, c, 0, tx,
                            b, d, 0, ty,
                            0, 0, 1, 0,
                            0, 0, 0, 1
                        );
                    }

                    return this._transform;
                }
            },
        });

        this.gl = gl;
        this.setGeometry( w, h );
    }

    DisplayObject.prototype = {

        constructor: DisplayObject,

        setGeometry: function ( w, h ) {

            this.buffer = this.gl.createBuffer();
            this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.buffer );

            var buf = new Float32Array([
                0, 0, 0, 0,
                w, 0, 1, 0,
                w, h, 1, 1,
                0, h, 0, 1
            ]);

            this.gl.bufferData( this.gl.ARRAY_BUFFER, buf, this.gl.STATIC_DRAW );
        },
    };

    display.DisplayObject = DisplayObject;

})();
/**
 * Created by dnvy0084 on 15. 12. 7..
 */

(function () {

    var display = glbasic.import( "display" );

    function DisplayObjectContainer() {

        display.DisplayObject.call( this );

        this._children = [];
    }

    var p = glbasic.extends( DisplayObjectContainer, display.DisplayObject );

    p.render = function (renderer) {

        for (var i = 0, l = this._children.length; i < l; i++) {

            this._children[i].render( renderer );
        }
    };

    p.add = function (child) {

        var index = this._children.indexOf( child );

        if(index != -1) return;

        this._children.push( child );
        child.parent = this;
    };

    p.remove = function (child) {

        var index = this._children.indexOf(child);

        if(index != -1) return;

        this._children.splice( index, 1 );
        child.parent = null;
    };

    p.contains = function (child) {
        return this._children.indexOf(child) != -1;
    };
    
    display.DisplayObjectContainer = DisplayObjectContainer;

})();
/****************
 * Quad.js
 *****************/

(function () {

    "use strict";

    var display = glbasic.import("display");

    var ANG = 180 / Math.PI;
    var RAD = Math.PI / 180;

    function Quad() {

        this._texture = null;

        this._x = 0;
        this._y = 0;
        this._scaleX = 1;
        this._scaleY = 1;
        this._radian = 0;

        this.transformChanged = true;

        Object.defineProperties( this, {

            "x": {
                get: function () {
                    return this._x;
                },
                set: function (value) {
                    if(this._x == value ) return;

                    this._x = value;
                    this.transformChanged = true;
                }
            },

            "y": {
                get: function () {
                    return this._y;
                },
                set: function (value) {
                    if(this._y == value) return;

                    this._y = value;
                    this.transformChanged = true;
                }
            },

            "scaleX": {
                get: function () {
                    return this._scaleX;
                },
                set: function (value) {
                    if(value == this._scaleX) return;

                    this._scaleX = value;
                    this.transformChanged = true;
                }
            },

            "scaleY": {
                get: function () {
                    return this._scaleY;
                },
                set: function (value) {
                    if(this._scaleY == value) return;

                    this._scaleY = value;
                    this.transformChanged = true;
                }
            },

            "radian": {
                get: function () {
                    return this._radian;
                },
                set: function (value) {
                    if( this._radian == value ) return;

                    this._radian = value;
                    this._transformChanged = true;
                }
            },

            // 180 : Math.PI = 1ang : 1rad
            // 1rad = 1ang * Math.PI / 180;
            // 1ang = 1rad * 180 / Math.PI;
            "rotation": {
                get: function () {
                    return this._radian * ANG;
                },
                set: function (value) {
                    this.radian = value * RAD;
                }
            },
        });
    }

    Quad.prototype = {
        constructor: Quad,

        render: function (renderer) {

        },
    }

    display.Quad = Quad;

})();


/**
 * Created by dnvy0084 on 2015. 11. 21..
 */

(function () {

    "use strict";

    var geom = glbasic.import("geom");

    function Matrix3D() {

        Object.defineProperties( this, {
            "raw": {
                get: function () {
                    return this._raw;
                }
            },
        });

        this._raw = new Float32Array(16);
        this.identity();
    }

    Matrix3D.prototype = {
        constructor: Matrix3D,

        setTo: function (
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44
        ){
            var m = this._raw;

            m[0] = m11, m[4] = m12, m[8 ] = m13, m[12] = m14,
            m[1] = m21, m[5] = m22, m[9 ] = m23, m[13] = m24,
            m[2] = m31, m[6] = m32, m[10] = m33, m[14] = m34,
            m[3] = m41, m[7] = m42, m[11] = m43, m[15] = m44;
        },

        identity: function () {
            this.setTo(
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            );
        },

        /**
         * this = b * this
         * @param b
         */
        preppend: function (b) {
            var m = b._raw;

            var a11 = m[0], a12 = m[4], a13 = m[8 ], a14 = m[12],
                a21 = m[1], a22 = m[5], a23 = m[9 ], a24 = m[13],
                a31 = m[2], a32 = m[6], a33 = m[10], a34 = m[14],
                a41 = m[3], a42 = m[7], a43 = m[11], a44 = m[15];

            m = this._raw;

            var b11 = m[0], b12 = m[4], b13 = m[8 ], b14 = m[12],
                b21 = m[1], b22 = m[5], b23 = m[9 ], b24 = m[13],
                b31 = m[2], b32 = m[6], b33 = m[10], b34 = m[14],
                b41 = m[3], b42 = m[7], b43 = m[11], b44 = m[15];

            var c11 = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41,
                c12 = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42,
                c13 = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43,
                c14 = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44,

                c21 = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41,
                c22 = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42,
                c23 = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43,
                c24 = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44,

                c31 = a31 * b11 + a32 * b21 + a33 * b31 + a44 * b41,
                c32 = a31 * b12 + a32 * b22 + a33 * b32 + a44 * b42,
                c33 = a31 * b13 + a32 * b23 + a33 * b33 + a44 * b43,
                c34 = a31 * b14 + a32 * b24 + a33 * b34 + a44 * b44,

                c41 = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41,
                c42 = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42,
                c43 = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43,
                c44 = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

            this.setTo(
                c11, c12, c13, c14,
                c21, c22, c23, c24,
                c31, c32, c33, c34,
                c41, c42, c43, c44
            );
        },
    };

    geom.Matrix3D = Matrix3D;

})();
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

            gl.enableVertexAttribArray( this._pos );
            gl.enableVertexAttribArray( this._uv );

            this._mat = gl.getUniformLocation( this._program, "mat" );
            this._colorMat = gl.getUniformLocation( this._program, "colorMat" );

            this._stage = gl.getUniformLocation( this._program, "stage" );
        },
    }

    render.Renderer = Renderer;

})();
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

    util.createProgram = createProgram;

})();



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
/****************
 * loadItems.js
 *****************/

(function () {

    "use strict";

    var util = glbasic.import("util");

    function loadItems( items, onComplete, onFail ) {

        var xhr, response = [];

        for (var i = 0, n = 0, l = items.length; i < l; i++) {
            xhr = new XMLHttpRequest();
            xhr.index = i;
            xhr.open( "GET", items[i]);
            xhr.send();

            xhr.onload = function(e){

                if( e.target.readyState != 4 ) return;

                response[e.target.index] = e.target.response;

                if( ++n == l ) onComplete( response );
            }
        }
    }

    util.loadItems = loadItems;

})();



/****************
 * BaseCase.js
 *****************/

(function () {

    "use strict";

    window.test = usenamespace( window.test || {} );

    var testcase = test.import("testcase");

    function BaseCase() {

    }

    BaseCase.prototype = {
        constructor: BaseCase,

        start: function () {
            console.log( "start // override" );
        },

        clear: function () {
            console.log( "clear // override" );
        },

        setTitle: function (title) {
            var element = document.getElementById( "title" );

            if( !element ) return;

            element.innerHTML = title;
        },
    }

    testcase.BaseCase = BaseCase;

})();

/****************
 * testmain.js
 *****************/

(function () {

    "use strict";

    var testcase = test.import("testcase");
    var current = null;

    function init() {
        makeList();
    }

    function makeList() {

        var currentCase = testcase.TestSyncBuffer;
        var list = document.getElementById( "list" );

        for( var s in testcase ){
            if( s == "BaseCase" ) continue;

            var opt = document.createElement("option");
            opt.value = s;
            opt.innerHTML = s;

            list.appendChild( opt );
        }

        list.addEventListener( "change", onChange );
        startCase( currentCase );
    }

    function onChange(e) {
        startCase( testcase[ e.target.selectedOptions[0].value ] );
    }

    function clearCase() {
        if( current == null ) return;

        current.clear();
    }

    function startCase( item ) {

        clearCase();
        current = new item();
        current.start();
    }

    window.onload = init;

})();
/**
 * Created by dnvy0084 on 2015. 11. 19..
 */

(function () {

    "use strict";

    var dis = test.import("display");

    function Rect( w, h ) {

        Object.defineProperties( this, {
            "x": {
                get: function () {
                    return this._x;
                },
                set: function (value) {
                    this._x = value;
                }
            },
        });
    }

    Rect.prototype = {
        
        constructor: Rect,

        init: function () {
            
        },
    };

    dis.Rect = Rect;

})();

/****************
 * ConvertPosWithVertexShader.js
 *****************/

(function () {

    "use strict";

    var c = test.import("testcase");
    var util = glbasic.import("util");

    var gl;

    function ConvertPosWithVertexShader() {

    }

    var p = test.extends( ConvertPosWithVertexShader, c.BaseCase );

    p.start = function () {

        document.getElementById("title").innerHTML = "convert to pixel postion with vertexShader";

        gl = document.getElementById( "canvas").getContext( "webgl" );
        gl.clearColor( 0, 0, 0, 1 );

        this.rects = [];

        for (var i = 0; i < 50; i++) {
            this.rects.push( this.makeRect(
                Math.random() * 400,
                Math.random() * 300,
                Math.random() * 100 + 10,
                Math.random() * 100 + 10,
                [ Math.random(), Math.random(), Math.random() ]
            ));
        }


        util.loadItems( ["shader/VS-pixelPosConvert.cpp", "shader/FS-customColor.cpp"],
            ( function( responses ){
                this.makeProgram( responses[0], responses[1] );
                this.draw();
            } ).bind( this )
        )
    };

    p.clear = function () {

        gl.clear( gl.COLOR_BUFFER_BIT );

        for (var i = 0; i < this.rects.length; i++) {
            gl.deleteBuffer( this.rects[i].vertexBuffer );
            gl.deleteBuffer( this.rects[i].indexBuffer );
        }

        gl.deleteProgram( this.program );
    };


    p.draw = function () {
        gl.clear( gl.COLOR_BUFFER_BIT );

        var r;
        var pos = gl.getAttribLocation( this.program, "pos" );
        gl.enableVertexAttribArray(pos);

        var clipspace = gl.getUniformLocation(this.program, "clipspace" );
        var clipspaceVector = new Float32Array([ gl.canvas.width, gl.canvas.height ]);

        var color = gl.getUniformLocation( this.program, "color" );

        for (var i = 0; i < this.rects.length; i++) {

            r = this.rects[i];

            gl.bindBuffer( gl.ARRAY_BUFFER, r.vertexBuffer);
            gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 4 * 2, 4 * 0 );
            gl.uniform2fv(clipspace, clipspaceVector);
            gl.uniform3f( color, r.color[0], r.color[1], r.color[2] );
            //gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, r.indexBuffer);
            gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );
        }
    };

    p.makeRect = function ( x, y, w, h, color ) {

        var r = {};
        var vertices = this.makeVertices( x, y, w, h );
        var indices = new Uint16Array([
            0, 1, 2,
            0, 2, 3,
        ]);

        r.vertexBuffer = this.makeBuffer( gl.ARRAY_BUFFER, vertices );
        r.indexBuffer = this.makeBuffer( gl.ELEMENT_ARRAY_BUFFER, indices );
        r.color = color;

        return r;
    };

    p.makeVertices = function ( x, y, w, h ) {

        var a = [
            x, y,
            x + w, y,
            x + w, y + h,
            x, y + h
        ];

        return new Float32Array(a);
    };

    p.makeBuffer = function ( target, data ) {

        var buffer = gl.createBuffer();

        gl.bindBuffer( target, buffer );
        gl.bufferData( target, data, gl.STATIC_DRAW );

        return buffer;
    };

    p.makeProgram = function ( vssrc, fssrc ) {

        this.program = gl.createProgram();

        gl.attachShader( this.program, util.createShader( gl, gl.VERTEX_SHADER, vssrc ) );
        gl.attachShader( this.program, util.createShader( gl, gl.FRAGMENT_SHADER, fssrc ) );
        gl.linkProgram( this.program );

        if( gl.getProgramParameter(this.program, gl.LINK_STATUS) == false )
            throw new Error( "LINK Error > " + gl.getProgramInfoLog( this.program ) );

        gl.useProgram( this.program );
    };

    c.ConvertPosWithVertexShader = ConvertPosWithVertexShader;

})();

/****************
 * DrawTriangle_0.js
 *****************/

(function () {

    "use strict";

    var c = test.import("testcase");
    var gl;
    var size = 0.4;

    function DrawTriangle_0() {

    }

    var p = test.extends( DrawTriangle_0, c.BaseCase );

    p.start = function () {

        document.getElementById( "title").innerHTML = "draw triangle with glDrawArrays";

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
/**
 * Created by dnvy0084 on 2015. 11. 21..
 */

(function () {

    "use strict";

    var c = test.import("testcase");
    var util = glbasic.import("util");
    var display = glbasic.import("display");
    var DisplayObject = display.DisplayObject;

    var gl;

    function ImageProcessing() {

    }

    var p = glbasic.extends( ImageProcessing, c.BaseCase );

    p.start = function () {

        document.getElementById( "title").innerHTML = "image processing sample";
        gl = document.getElementById( "canvas").getContext( "webgl" );
        gl.clearColor( 0,0,0,1 );

        util.createProgram( gl, [ "shader/VS-ImageProcessing.cpp", "shader/FS-ImageProcessing.cpp"], (function(p){
            this.initProgram(p);
        }).bind(this));
    };

    p.clear = function () {
        console.log( "clear", this.constructor.name );
    };

    p.initProgram = function (p) {
        this.program = p;

        this.program.pos = gl.getAttribLocation( this.program, "pos" );
        this.program.uv = gl.getAttribLocation( this.program, "uv" );

        gl.enableVertexAttribArray( this.program.pos );
        gl.enableVertexAttribArray( this.program.uv );

        this.program.mat = gl.getUniformLocation( this.program, "mat" );
        this.program.stage = gl.getUniformLocation( this.program, "stage" );

        gl.useProgram(p);
        gl.uniform2f( this.program.stage, gl.canvas.width, gl.canvas.height );

        this.initTexture();
    };

    p.initTexture = function () {

        var img = document.createElement( "img" );
        img.src = "img/a.jpg";
        img.style.position = "absolute";
        img.style.left = "100000px";

        img.onload = (function(){

            document.body.appendChild(img);
            this.tex = gl.createTexture();

            gl.bindTexture( gl.TEXTURE_2D, this.tex );

            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );

            gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img );

            var scale = 300 / img.clientHeight;

            this.layout( img.clientWidth * scale, img.clientHeight * scale );

        }).bind(this);
    };

    p.layout = function ( w, h ) {

        this.indices = gl.createBuffer();

        var buf = new Uint16Array([
            0,1,2, 0,2,3
        ]);

        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices );
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, buf, gl.STATIC_DRAW);

        this.picture = new DisplayObject( w, h, gl );
        this.picture.x = ( gl.canvas.width - w ) / 2;
        this.onRender = this.draw.bind( this );

        this.draw();
    };

    p.draw = function () {

        gl.clear( gl.COLOR_BUFFER_BIT );

        gl.bindBuffer( gl.ARRAY_BUFFER, this.picture.buffer );

        gl.vertexAttribPointer( this.program.pos, 2, gl.FLOAT, false, 4 * 4, 4 * 0 );
        gl.vertexAttribPointer( this.program.uv, 2, gl.FLOAT, false, 4 * 4, 4 * 2 );
        gl.uniformMatrix4fv( this.program.mat, false, this.picture.transform.raw );

        gl.bindTexture( gl.TEXTURE_2D, this.tex );
        gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );

        this.id = requestAnimationFrame( this.onRender );
    };

    c.ImageProcessing = ImageProcessing;

})();
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
            this.createTexture( img );
            this.draw();
        }).bind(this);
    };

    p.draw = function () {

        gl.clear( gl.COLOR_BUFFER_BIT );

        gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
        gl.vertexAttribPointer( this.renderer._pos, 2, gl.FLOAT, false, 4 * 4, 0 );
        gl.vertexAttribPointer( this.renderer._uv, 2, gl.FLOAT, false, 4 * 4, 4 * 2 );

        gl.uniformMatrix3fv( this.renderer._mat, false, this.mat );

        gl.bindTexture( gl.TEXTURE_2D, this.tex );
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer );
        gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );
    };

    p.createTexture = function (img) {

        this.tex = gl.createTexture();

        gl.bindTexture( gl.TEXTURE_2D, this.tex );
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
            gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img );
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

        this.mat = new Float32Array([
            0.05, 0, 0,
            0, 0.05, 0,
            10, 10, 1,
        ]);
    };

    c.RendererTest = RendererTest;

})();


/****************
 * TestSyncBuffer.js
 *****************/

(function () {

    "use strict";

    var c = test.import("testcase");
    var render = glbasic.import("render");
    var Renderer = render.Renderer;
    var util = glbasic.import("util");

    var gl;

    function TestSyncBuffer() {

    }

    var p = test.extends(TestSyncBuffer, c.BaseCase);

    p.start = function () {

        this.setTitle( "buffer sync test" );

        gl = document.getElementById( "canvas").getContext( "webgl" );
        gl.clearColor( 0, 0, 0, 1 );

        this.render = new Renderer();

        util.loadItems(
            [ "shader/basicQuadShader.cpp", "shader/basicFragmentShader.cpp" ],
            (function( res ){

                console.log( res );

            }).bind(this)
        )
    };

    p.clear = function () {

    };

    p.makeQuad = function ( w, h ) {
        var r = {};

        r.vertices = new Float32Array([
            0, 0,
            w, 0,
            w, h,
            0, h
        ]);

        r.buffer = gl.createBuffer();
        gl.bindBuffer( gl.ARRAY_BUFFER, r.buffer );
        gl.bufferData( gl.ARRAY_BUFFER, r.vertices, gl.STATIC_DRAW );
    };

    c.TestSyncBuffer = TestSyncBuffer;

})();


/****************
 * TextureSample.js
 *****************/

(function () {

    "use strict";

    var c = test.import("testcase");
    var util = glbasic.import("util");

    var gl;

    function TextureSample() {

    }

    var p = test.extends( TextureSample, c.BaseCase );

    p.start = function () {

        document.getElementById( "title" ).innerHTML = "basic Texture sample";
        gl = document.getElementById( "canvas").getContext( "webgl" );

        util.createProgram(
            gl,
            [ "shader/VS-TextureSample.cpp", "shader/FS-TextureSample.cpp" ],
            ( function(program){

                this.program = program;
                this.initProgram();
                this.layout();
            }).bind( this )
        );
    };

    p.clear = function () {

        gl.clear( gl.COLOR_BUFFER_BIT );

        webkitCancelAnimationFrame( this.id );

        this.rect.dispose();

        gl.deleteBuffer( this.indices );
        gl.deleteTexture( this.tex );
        this.disposeProgram();
    };

    p.initProgram = function () {

        gl.useProgram( this.program );

        this.program.pos = gl.getAttribLocation( this.program, "pos" );
        this.program.uv = gl.getAttribLocation( this.program, "uv" );

        gl.enableVertexAttribArray( this.program.pos );
        gl.enableVertexAttribArray( this.program.uv );

        this.program.mat = gl.getUniformLocation( this.program, "mat" );
        this.program.stage = gl.getUniformLocation( this.program, "stage" );
        this.program.image = gl.getUniformLocation( this.program, "image" );
    };

    p.disposeProgram = function () {
        gl.disableVertexAttribArray( this.program.pos );
        gl.disableVertexAttribArray( this.program.uv );

        gl.deleteProgram( this.program );
    };

    p.draw = function () {

        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.bindBuffer( gl.ARRAY_BUFFER, this.rect.buffer );

        gl.vertexAttribPointer( this.program.pos, 2, gl.FLOAT, false, 4 * 4, 0 );
        gl.vertexAttribPointer( this.program.uv, 2, gl.FLOAT, false, 4 * 4, 4 * 2 );

        gl.uniformMatrix4fv( this.program.mat, false, this.rect.transform );
        gl.uniform2f( this.program.stage, gl.canvas.width, gl.canvas.height );

        gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );

        this.id = requestAnimationFrame( this.onRender );
    };

    p.layout = function () {

        this.img = document.createElement( "img" );
        this.img.onload = ( function( e ){
            this.img.style.visibility = "hidden";
            document.body.appendChild( this.img );

            this.makeTexture( this.img );
            this.addImage();
        }).bind(this);

        this.img.src = "img/a.jpg";

        this.indices = gl.createBuffer();

        var buf = new Uint16Array([
            0, 1, 2,    0, 2, 3
        ]);

        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices );
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, buf, gl.STATIC_DRAW );
    };

    p.addImage = function () {

        var scale = 280 / this.img.clientHeight;

        this.rect = this.makeRect( this.img.clientWidth * scale, this.img.clientHeight * scale );

        this.rect.x = (gl.canvas.width - this.rect.width ) / 2;
        this.rect.y = 10;
        this.rect.anchorX = this.rect.anchorY = 0;

        this.onRender = this.draw.bind(this);
        this.draw();
    };



    p.makeTexture = function ( img ) {

        this.tex = gl.createTexture();

        gl.bindTexture( gl.TEXTURE_2D, this.tex );

        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );

        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img );
    };

    p.makeRect = function ( w, h ) {

        var r = {
            x: 0,
            y: gl.canvas.height * Math.random(),
            radian: 0,
            scaleX: 1,
            scaleY: 1,
            anchorX: 0.5,
            anchorY: 0.5,
            width: w,
            height: h,
            speed: Math.random() * 0.2,
            start: Math.random() * 100,

            dispose: function(){
                gl.deleteBuffer( this.buffer );
                delete this.mat;
            }
        };

        var self = this;

        Object.defineProperty( r, "transform", {
            get: function(){

                return self.getMatrix(this);
            }
        });

        r.color = new Float32Array([ Math.random(), Math.random(), Math.random() ]);

        var ax = 0, ay = 0,
            bx = w, by = h,
            u = 1, v = 1;

        var vertices = new Float32Array([
            ax, ay, 0, 0,
            bx, ay, u, 0,
            bx, by, u, v,
            ax, by, 0, v,
        ]);

        r.mat = new Float32Array(16);
        this.identity(r.mat);

        r.buffer = gl.createBuffer();

        gl.bindBuffer( gl.ARRAY_BUFFER, r.buffer );
        gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

        return r;
    };

    p.getMatrix = function (r) {

        var a, b, c, d, tx, ty,
            ox = -r.width * r.anchorX,
            oy = -r.height * r.anchorY,
            mat = r.mat,
            t = r.radian;

        if(t == 0.0 )
        {
            a = r.scaleX;
            b = 0;
            c = 0;
            d = r.scaleY;
            tx = r.x + ox * r.scaleX;
            ty = r.y + oy * r.scaleY;
        }
        else
        {
            var cos = Math.cos(t);
            var sin = Math.sin(t);

            a = r.scaleX * cos;
            b = r.scaleX * sin;
            c = r.scaleY * -sin;
            d = r.scaleY * cos;

            tx = r.x + ox * a + oy * c;
            ty = r.y + ox * b + oy * d;
        }

        mat[0] = a,    mat[4] = c,    mat[8] = 0,     mat[12] = tx,
        mat[1] = b,    mat[5] = d,    mat[9] = 0,     mat[13] = ty,
        mat[2] = 0,    mat[6] = 0,    mat[10] = 1,    mat[14] = 0,
        mat[3] = 0,    mat[7] = 0,    mat[11] = 0,    mat[15] = 1;

        return mat;
    };

    p.identity = function ( mat ) {
        mat[0] = 1, mat[4] = 0, mat[8] = 0, mat[12] = 0,
        mat[1] = 0, mat[5] = 1, mat[9] = 0, mat[13] = 0,
        mat[2] = 0, mat[6] = 0, mat[10] = 1, mat[14] = 0,
        mat[3] = 0, mat[7] = 0, mat[11] = 0, mat[15] = 1;
    };

    c.TextureSample = TextureSample;

})();


/**
 * Created by dnvy0084 on 2015. 11. 24..
 */

(function () {

    "use strict";

    var c = test.import("testcase");
    var util = glbasic.import("util");

    var gl;
    var color = { red: 1, green: 1, blue: 1, contrast: 1.0 };

    var mat = new Float32Array([
        0.9, 0, 0, 0,
        0, 0.9, 0, 0,
        0, 0, 1, 0,
        10, 10, 0, 1
    ]);

    function TextureSample_02() {

    }

    var p = glbasic.extends( TextureSample_02, c.BaseCase );

    p.start = function () {

        gl = document.getElementById( "canvas" ).getContext( "webgl" );

        document.getElementById( "title" ).innerHTML = "texture sample 02";

        gl.clearColor( 0,0,0,1 );

        util.createProgram(
            gl,
            [ "shader/VS-TextureSample02.cpp", "shader/FS-TextureSample02.cpp" ],
            (function(p){
                this.initProgram( p );
            }).bind(this)
        );

        this.onRender = this.draw.bind( this );

        this.layout();
    };

    p.clear = function () {
        console.log( "clear", this.constructor.name );
    };


    p.layout = function () {

        var container = document.createElement( "div" );
        container.setAttribute("style", "font-size:10px");

        var info = [
            { type: "text", value: "brightness" },
            { type: "slider", value: "red" },
            { type: "slider", value: "green" },
            { type: "slider", value: "blue" },

            {type: "text", value: "contrast" },
            { type: "slider", value: "contrast" },
        ];

        for (var i = 0; i < info.length; i++) {

            var o = info[i];

            switch(o.type)
            {
                case "text":

                    var p = document.createElement( "p" );

                    p.innerHTML = o.value;
                    container.appendChild( p );

                    break;

                case "slider":

                    var div = document.createElement( "div" );
                    div.setAttribute( "style", "width: 255px; margin: 10px;" );
                    div.innerHTML = o.value;
                    div._data = o;

                    var t = $(div).slider({
                        min: 0,
                        max: 255,
                        value: 128,
                        animate: false,
                        slide: (function( e, ui ){

                            var value = ui.handle.parentElement._data.value;

                            switch( value )
                            {
                                case "contrast":
                                    color[ value ] = ui.value / 255 * 5 + 0.2;
                                    break;

                                default:
                                    color[ value ] = ui.value / 128.0;
                                    break;
                            }

                        }).bind(this)
                    });

                    container.appendChild( div );

                    //var span = document.createElement( "span" );
                    //span.setAttribute( "style", "float: left" );
                    //span.innerHTML = o.value;
                    //
                    //div.appendChild( span );
            }
        }

        $( ".footer" )[0].appendChild( container );

        
    };

    p.initProgram = function (p) {

        this.program = p;

        gl.useProgram( this.program );

        this.program.pos = gl.getAttribLocation( this.program, "pos" );
        this.program.uv = gl.getAttribLocation( this.program, "uv" );

        gl.enableVertexAttribArray( this.program.pos );
        gl.enableVertexAttribArray( this.program.uv );

        this.program.stage = gl.getUniformLocation( this.program, "stage" );
        this.program.mat = gl.getUniformLocation( this.program, "mat" );
        this.program.brightness = gl.getUniformLocation( this.program, "brightness" );
        this.program.contrast = gl.getUniformLocation( this.program, "contrast" );

        gl.uniform2f( this.program.stage, gl.canvas.width, gl.canvas.height );

        this.img = document.createElement( "img" );
        this.img.src = "img/b.jpg";
        this.img.onload = ( function(e){

            this.setGeometry();
            this.makeTexture();
            this.draw();

        }).bind(this);
    };

    p.draw = function () {

        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

        gl.uniformMatrix4fv( this.program.mat, false, mat );
        gl.uniform3f( this.program.brightness, color.red, color.green, color.blue );
        gl.uniform1f( this.program.contrast, color.contrast );

        gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
        gl.vertexAttribPointer( this.program.pos, 2, gl.FLOAT, false, 4 * 4, 4 * 0 );
        gl.vertexAttribPointer( this.program.uv, 2, gl.FLOAT, false, 4 * 4, 4 * 2 );

        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices );
        gl.bindTexture( gl.TEXTURE_2D, this.tex );

        gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );

        this.id = requestAnimationFrame( this.onRender );
    };

    p.setGeometry = function () {

        this.vertexBuffer = gl.createBuffer();
        this.indices = gl.createBuffer();

        var w = this.img.width / 10;
        var h = this.img.height / 10;

        var vertices = new Float32Array([
            0, 0,  0, 0, // stride
            w, 0,  1, 0,
            w, h,  1, 1,
            0, h,  0, 1
        ]);

        gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

        var indices = new Uint16Array([
            0, 1, 2,
            0, 2, 3
        ]);

        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices );
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW );
    };

    p.makeTexture = function () {

        this.tex = gl.createTexture();

        gl.bindTexture( gl.TEXTURE_2D, this.tex );

        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR );
        gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR );

        gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.img );
    };

    c.TextureSample_02 = TextureSample_02;

})();
/**
 * Created by dnvy0084 on 2015. 11. 19..
 */

(function () {

    "use strict";

    var c = test.import("testcase");
    var util = glbasic.import("util");

    var gl;

    function Transform2D() {
        
    }

    var p = test.extends( Transform2D, c.BaseCase );

    p.start = function () {

        document.getElementById("title").innerHTML = "4x4 matrix sample";

        gl = document.getElementById( "canvas").getContext( "webgl" );
        gl.clearColor( 0,0,0,1 );

        util.createProgram(
            gl,
            [ "shader/VS-Transform2D.cpp", "shader/FS-Transform2D.cpp"],
            (function(program){

                gl.useProgram( program );
                this.program = program;

                this.layout();
                this.onRender( 0 );

            }).bind(this)
        );

        this.onRender = this.draw.bind( this );
    };

    p.clear = function () {

        for (var i = 0; i < this.rects.length; i++) {
            this.rects[i].dispose();
        }

        var pos = gl.getAttribLocation( this.program, "pos" );
        gl.disableVertexAttribArray( pos );

        var col = gl.getAttribLocation( this.program, "col" );
        gl.disableVertexAttribArray( col );

        gl.deleteBuffer( this.indices );
        gl.deleteProgram( this.program );

        webkitCancelRequestAnimationFrame( this.id );

        console.log( "clear" );
    };

    p.layout = function () {

        this.indices = gl.createBuffer();

        var indices = new Uint16Array([
            0,1,2,  0,2,3
        ]);

        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices );
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW );

        this.rects = [];

        for (var i = 0; i < 500; i++) {
            this.rects.push( this.makeRect( 100 * Math.random(), 100 * Math.random() ) );
            //this.rects.push( this.makeRect( 200, 200 ) );
        }
    };

    p.draw = function ( ms ) {
        gl.clear( gl.COLOR_BUFFER_BIT );

        var r;

        var pos = gl.getAttribLocation( this.program, "pos" );
        gl.enableVertexAttribArray( pos );

        var col = gl.getAttribLocation( this.program, "col" );
        gl.enableVertexAttribArray( col );

        var t = gl.getUniformLocation( this.program, "transform" );

        var stage = gl.getUniformLocation( this.program, "stage" );
        gl.uniform2f( stage, gl.canvas.width, gl.canvas.height );

        var color = gl.getUniformLocation( this.program, "color" );

        for (var i = 0, l = this.rects.length; i < l; i++) {

            r = this.rects[i];

            gl.uniform3fv( color, r.color );

            gl.bindBuffer( gl.ARRAY_BUFFER, r.buffer);
            gl.vertexAttribPointer( pos, 2, gl.FLOAT, false, 4 * 5, 4 * 0 );
            gl.vertexAttribPointer( col, 3, gl.FLOAT, false, 4 * 5, 4 * 2 );

            r.x = gl.canvas.width * ( Math.cos(r.start + ms/500) + 1 ) / 2;
            r.scaleX = 0.5;
            r.scaleY = 0.5;

            r.radian += r.speed;

            this.getMatrix(r);

            gl.uniformMatrix4fv( t, false, r.mat );
            gl.drawElements( gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );
        }

        this.id = requestAnimationFrame( this.onRender );
    };

    p.makeRect = function ( w, h ) {

        var r = {
            x: 0,
            y: gl.canvas.height * Math.random(),
            radian: 0,
            scaleX: 1,
            scaleY: 1,
            anchorX: 0.5,
            anchorY: 0.5,
            width: w,
            height: h,
            speed: Math.random() * 0.2,
            start: Math.random() * 100,

            dispose: function(){
                gl.deleteBuffer( this.buffer );
                delete this.mat;
            }
        };

        r.color = new Float32Array([ Math.random(), Math.random(), Math.random() ]);

        var ax = 0, ay = 0,
            bx = w, by = h;

        var vertices = new Float32Array([
            ax, ay, 1, 0, 0, // 0
            bx, ay, 0, 0, 1, // 1
            bx, by, 0, 1, 0, // 2
            ax, by, 1, 0, 1, // 3
        ]);

        r.mat = new Float32Array(16);
        this.identity(r.mat);

        r.buffer = gl.createBuffer();

        gl.bindBuffer( gl.ARRAY_BUFFER, r.buffer );
        gl.bufferData( gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW );

        return r;
    };

    p.getMatrix = function (r) {

        var a, b, c, d, tx, ty,
            ox = -r.width * r.anchorX,
            oy = -r.height * r.anchorY,
            mat = r.mat,
            t = r.radian;


        if(t == 0.0 )
        {
            a = r.scaleX;
            b = 0;
            c = 0;
            d = r.scaleY;
            tx = r.x + ox * r.scaleX;
            ty = r.y + oy * r.scaleY;
        }
        else
        {
            var cos = Math.cos(t);
            var sin = Math.sin(t);

            a = r.scaleX * cos;
            b = r.scaleX * sin;
            c = r.scaleY * -sin;
            d = r.scaleY * cos;

            tx = r.x + ox * a + oy * c;
            ty = r.y + ox * b + oy * d;
        }

        mat[0] = a,    mat[4] = c,    mat[8] = 0,     mat[12] = tx,
        mat[1] = b,    mat[5] = d,    mat[9] = 0,     mat[13] = ty,
        mat[2] = 0,    mat[6] = 0,    mat[10] = 1,    mat[14] = 0,
        mat[3] = 0,    mat[7] = 0,    mat[11] = 0,    mat[15] = 1;
    };

    p.identity = function ( mat ) {
        mat[0] = 1, mat[4] = 0, mat[8] = 0, mat[12] = 0,
        mat[1] = 0, mat[5] = 1, mat[9] = 0, mat[13] = 0,
        mat[2] = 0, mat[6] = 0, mat[10] = 1, mat[14] = 0,
        mat[3] = 0, mat[7] = 0, mat[11] = 0, mat[15] = 1;
    };

    p.translate = function (mat,x,y) {
        mat[0] = 1, mat[4] = 0, mat[8] = 0, mat[12] += x,
        mat[1] = 0, mat[5] = 1, mat[9] = 0, mat[13] += y,
        mat[2] = 0, mat[6] = 0, mat[10] = 1, mat[14] = 0,
        mat[3] = 0, mat[7] = 0, mat[11] = 0, mat[15] = 1;
    };

    c.Transform2D = Transform2D;

})();