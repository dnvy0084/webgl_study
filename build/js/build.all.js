
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
    }

    testcase.BaseCase = BaseCase;

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

        var currentCase = testcase.ConvertPosWithVertexShader;
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

