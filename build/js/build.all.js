
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

        var currentCase = testcase.TextureSample;
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

        document.getElementById( "title").innerHTML = "basic Texture sample";
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

    };

    p.initProgram = function () {

        gl.useProgram( this.program );

        this.program.pos = gl.getAttribLocation( this.program, "pos" );
        this.program.uv = gl.getAttribLocation( this.program, "uv" );

        gl.enableVertexAttribArray( this.program.pos );
        gl.enableVertexAttribArray( this.program.uv );

        this.program.mat = gl.getUniformLocation( this.program, "mat" );
        this.program.stage = gl.getUniformLocation( this.program, "stage" );
    };

    p.layout = function () {

        this.img = document.createElement( "img" );
        this.img.onload = ( function( e ){
            this.img.style.visibility = "hidden";
            document.body.appendChild( this.img );

            this.makeTexture( this.img );
        }).bind(this);

        this.img.src = "img/a.jpg";
    };

    p.makeTexture = function ( img ) {

        this.tex = gl.createTexture();

        gl.bindTexture( gl.TEXTURE_2D, this.tex );

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

        r.color = new Float32Array([ Math.random(), Math.random(), Math.random() ]);

        var ax = 0, ay = 0,
            bx = w, by = h;

        var vertices = new Float32Array([
            ax, ay, 0, 0,
            bx, ay, 1, 0,
            bx, by, 1, 1,
            ax, by, 0, 1,
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

    c.TextureSample = TextureSample;

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