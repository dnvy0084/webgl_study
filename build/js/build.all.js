
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
 * gl2d.js
 *****************/

(function ( global ) {

    "use stirct";

    global.gl2d = usenamespace( global.gl2d || {} );

})( this );


/****************
 * Ticker.js
 *****************/

(function () {

    "use strict";

    var core = gl2d.import("core");

    function Ticker() {
        this.objects = [];
        this.bindingUpdate = this.update.bind( this );
        this.start();
    }

    Ticker.prototype = {
        constructor: Ticker,

        start: function () {
            this.update(0);
        },

        stop: function () {
            webkitCancelRequestAnimationFrame( this.reqID );
        },

        update: function (ms) {

            this.reqID = requestAnimationFrame( this.bindingUpdate );

            var l = this.objects.length;
            if( l == 0 ) return;

            var n = 0, o;

            for ( var i = 0; i < l; ++i ) {

                o = this.objects[i];

                if( o == null ) continue;
                if( i != n ) this.objects[n] = o;

                o.advanceTime( ms );
                ++n;
            }

            for ( l = this.objects.length; i < l ; ) {
                this.objects[n++] = this.objects[i++];
            }

            this.objects.length = n;
        },

        add: function (o) {

            if( !o.advanceTime ) return null;

            this.objects.push( o );
            return o;
        },

        remove: function (o) {

            var index = this.objects.indexOf( o );
            if( index == -1 ) return null;

            this.objects[index] = null;
        },

        contain: function (o) {
            return this.objects.indexOf(o) != -1;
        },
    };

    core.Ticker = Ticker;

})();


/****************
 * DisplayObject.js
 *****************/

(function () {

    "use strict";

    var display = gl2d.import("display");

    function DisplayObject() {

    }

    display.DisplayObject = DisplayObject;

})();


/****************
 * DisplayObjectContainer.js
 *****************/

(function () {

    "use strict";

    var display = gl2d.import("display");
    var DisplayObject = display.DisplayObject;

    function DisplayObjectContainer() {

    }

    gl2d.extends( DisplayObjectContainer, DisplayObject );

    display.DisplayObjectContainer = DisplayObjectContainer;

})();


/****************
 * Stage.js
 *****************/

(function () {

    "use strict";

    var display = gl2d.import("display");
    var DisplayObjectContainer = display.DisplayObjectContainer;

    function Stage() {

    }

    gl2d.extends( Stage, DisplayObjectContainer );

    display.Stage = Stage;

})();



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
/****************
 * Rectangle.js
 *****************/

(function () {

    "use strict";

    var geom = glbasic.import("geom");

    function Rectangle( x, y, w, h ) {

        this.setTo( x, y, w, h );

        Object.defineProperties( this, {

            "left": {
                get: function () {
                    return this.x;
                }
            },

            "top": {
                get: function () {
                    return this._y;
                }
            },

            "right": {
                get: function () {
                    return this.x + this.width;
                }
            },

            "bottom": {
                get: function () {
                    return this.y + this.height;
                }
            },
        });
    }

    Rectangle.prototype = {
        constructor: Rectangle,

        setTo: function (x, y, w, h) {
            this.x = x;
            this.y = y;
            this.width = w;
            this.height = h;
        },
    }

    geom.Rectangle = Rectangle;

})();


var gl = gl || {};

gl.drawingBufferHeight = 500;
gl.drawingBufferWidth = 500;
gl.canvas = null;

gl.activeTexture = function( eTexture ){}
gl.attachShader = function( oProgram, oShader ){}
gl.bindAttribLocation = function( oProgram, uintIndex, stringName ){}
gl.bindBuffer = function( eTarget, oBuffer ){}
gl.bindFramebuffer = function( eTarget, oFramebuffer ){}
gl.bindRenderbuffer = function( eTarget, oRenderbuffer ){}
gl.bindTexture = function( eTarget, oTexture ){}
gl.blendColor = function( fRed, fGreen, fBlue, fAlpha ){}
gl.blendEquation = function( eMode ){}
gl.blendEquationSeparate = function( eModeRGB, eModeAlpha ){}
gl.blendFunc = function( eSfactor, eDfactor ){}
gl.blendFuncSeparate = function( eSrcRGB, eDstRGB, eSrcAlpha, eDstAlpha ){}
gl.bufferData = function( eTarget, oArrayBuffer, eUsage ){}
gl.bufferSubData = function( eTarget, nOffset, oData ){}
gl.checkFramebufferStatus = function( eTarget ){}
gl.clear = function( nMask ){}
gl.clearColor = function( fRed, fGreen, fBlue, fAlpha ){}
gl.clearDepth = function( fDepth ){}
gl.clearStencil = function( intS ){}
gl.colorMask = function( bRed, bGreen, bBlue, bAlpha ){}
gl.compileShader = function( oShader ){}
gl.compressedTexImage2D = function( eTarget, numberLevel, numberInternalformat, numberWidth, numberHeight, numberRborder, arrayBufferData ){}
gl.compressedTexSubImage2D = function( eTarget, numberLevel, numberXoffset, numberYoffset, numberWidth, numberRheight, eFormat,arrayBufferData ){}
gl.copyTexImage2D = function( eTarget, intLevel, eInternalformat, intX, intY, intWidth, intHeight, intBorder ){}
gl.copyTexSubImage2D = function( eTarget, intLevel, intXoffset, intYoffset, intX, intY, intWidth, intHeight ){}
gl.createBuffer = function(){}
gl.createFramebuffer = function(){}
gl.createProgram = function(){}
gl.createRenderbuffer = function(){}
gl.createShader = function( eType ){}
gl.createTexture = function(){}
gl.cullFace = function( eMode ){}
gl.deleteBuffer = function( oBuffer ){}
gl.deleteFramebuffer = function( oBuffer ){}
gl.deleteProgram = function( oProgram ){}
gl.deleteRenderbuffer = function( oRenderbuffer ){}
gl.deleteShader = function( oShader ){}
gl.deleteTexture = function( oTexture ){}
gl.depthFunc = function( eFunc ){}
gl.depthMask = function( bFlag ){}
gl.depthRange = function( fZNear, fGFar ){}
gl.detachShader = function( oProgram, oShader ){}
gl.disable = function( eCap ){}
gl.disableVertexAttribArray = function( uintIndex ){}
gl.drawArrays = function( eMode, intFirst, intCount ){}
gl.drawElements = function( eMode, nCount, eType, intOffset ){}
gl.enable = function( eCap ){}
gl.enableVertexAttribArray = function( uintIndex ){}
gl.finish = function(){}
gl.flush = function(){}
gl.framebufferRenderbuffer = function( eTarget, eAttachment, eRenderbuffertarget, oRenderbuffer ){}
gl.framebufferTexture2D = function( eTarget, eAttachment, eTextarget, oTexture, intLevel ){}
gl.frontFace = function( eMode ){}
gl.generateMipmap = function( eTarget ){}
gl.getActiveAttrib = function( oProgram, uintIndex ){}
gl.getActiveUniform = function( oProgram, uintIndex ){}
gl.getAttachedShaders = function( oProgram ){}
gl.getAttribLocation = function( oProgram, stringName ){}
gl.getBufferParameter = function( eTarget, ePname ){}
gl.getContextAttributes = function(){}
gl.getError = function(){}
gl.getExtension = function( stringName ){}
gl.getFramebufferAttachmentParameter = function( eTarget, eAttachment, ePname ){}
gl.getParameter = function( ePname ){}
gl.getProgramParameter = function( oProgram, ePname ){}
gl.getProgramInfoLog = function( oProgram ){}
gl.getRenderbufferParameter = function( eTarget, ePname ){}
gl.getShaderParameter = function( oShader, ePname ){}
gl.getShaderInfoLog = function( oShader ){}
gl.getShaderPrecisionFormat = function( eShaderType, ePrecisionType ){}
gl.getShaderSource = function( oShader ){}
gl.getSupportedExtensions = function(){}
gl.getTexParameter = function( eTarget, ePname ){}
gl.getUniform = function( oProgram, uintLocation ){}
gl.getUniformLocation = function( oProgram, stringName ){}
gl.getVertexAttrib = function( uintIndex, ePname ){}
gl.getVertexAttribOffset = function( uintIndex, ePname ){}
gl.hint = function( eTarget, eMode ){}
gl.isBuffer = function( oBuffer ){}
gl.isContextLost = function(){}
gl.isEnabled = function( eCap ){}
gl.isFramebuffer = function( oFramebuffer ){}
gl.isProgram = function( oProgram ){}
gl.isRenderbuffer = function( oRenderbuffer ){}
gl.isShader = function( oShader ){}
gl.isTexture = function( oTexture ){}
gl.lineWidth = function( fWidth ){}
gl.linkProgram = function( oProgram ){}
gl.pixelStorei = function( ePname, intParam ){}
gl.polygonOffset = function( fFactor, fGnits ){}
gl.readPixels = function( intX, intY, intWidth, intHeight, eFormat, eType, oPixels ){}
gl.renderbufferStorage = function( eTarget, eInternalformat, intWidth, intHeight ){}
gl.sampleCoverage = function( fValue, bInvert ){}
gl.scissor = function( intX, intY, intWidth, intHeight ){}
gl.shaderSource = function( oShader, stringSource ){}
gl.stencilFunc = function( eFunc, intRef, uintMask ){}
gl.stencilFuncSeparate = function( eFace, eFunc, intRef, uintMask ){}
gl.stencilMask = function( uintMask ){}
gl.stencilMaskSeparate = function( eFace, uintMask ){}
gl.stencilOp = function( eFail, eZfail, eZpass ){}
gl.stencilOpSeparate = function( eFace, eFail, eZfail, eZpass ){}
gl.texParameterf = function( eTarget, ePname, fParam ){}
gl.texParameteri = function( eTarget, ePname, intParam ){}
gl.texImage2D = function( eTarget, intLevel, eInternalformat, intWidth, intHeight, intBorder, eFormat, eType, oPixels ){}
gl.texSubImage2D = function( eTarget, intLevel, intXoffset, intYoffset, intWidth, intHeight, eFormat, eType, oPixels ){}
gl.uniform1f = function( uintLocation, fG ){}
gl.uniform1fv = function( uintLocation, flaot32ArrayVector ){}
gl.uniform1i = function( uintLocation, intX ){}
gl.uniform1iv = function( uintLocation, int32ArrayVector ){}
gl.uniform2f = function( uintLocation, fG, fY ){}
gl.uniform2fv = function( uintLocation, flaot32ArrayVector ){}
gl.uniform2i = function( uintLocation, intX, intY ){}
gl.uniform2iv = function( uintLocation, int32ArrayVector ){}
gl.uniform3f = function( uintLocation, fG, fY, fZ ){}
gl.uniform3fv = function( uintLocation, float32ArrayVector ){}
gl.uniform3i = function( uintLocation, intX, intY, intZ ){}
gl.uniform3iv = function( uintLocation, int32ArrayVector ){}
gl.uniform4f = function( uintLocation, fG, fY,  fZ, floatW ){}
gl.uniform4fv = function( uintLocation, float32ArrayVector ){}
gl.uniform4i = function( uintLocation, intX, intY, intZ, intW ){}
gl.uniform4iv = function( uintLocation, int32ArrayVector ){}
gl.uniformMatrix2fv = function( uintLocation, bTranspose, float32ArrayRawData ){}
gl.uniformMatrix3fv = function( uintLocation, bTranspose, float32ArrayRawData ){}
gl.uniformMatrix4fv = function( uintLocation, bTranspose, float32ArrayRawData ){}
gl.useProgram = function( oProgram ){}
gl.validateProgram = function( oProgram ){}
gl.vertexAttrib1f = function( uintLocation, fG ){}
gl.vertexAttrib1fv = function( uintLocation, float32ArrayVector ){}
gl.vertexAttrib2f = function( uintLocation, fG, fY ){}
gl.vertexAttrib2fv = function( uintLocation, flaot32ArrayVector ){}
gl.vertexAttrib3f = function( uintLocation, fG, fY, fZ ){}
gl.vertexAttrib3fv = function( uintLocation, float32ArrayVector ){}
gl.vertexAttrib4f = function( uintLocation, fG, fY, fZ, floatW ){}
gl.vertexAttrib4fv = function( uintLocation, float32ArrayVector ){}
gl.vertexAttribPointer = function( uintIndex, intSize, eType, bNormalized, intStride, intOffset ){}
gl.viewport = function( intX, intY, intWidth, intHeight ){}


gl.DEPTH_BUFFER_BIT = "DEPTH_BUFFER_BIT";
gl.STENCIL_BUFFER_BIT = "STENCIL_BUFFER_BIT";
gl.COLOR_BUFFER_BIT = "COLOR_BUFFER_BIT";
gl.POINTS = "POINTS";
gl.LINES = "LINES";
gl.LINE_LOOP = "LINE_LOOP";
gl.LINE_STRIP = "LINE_STRIP";
gl.TRIANGLES = "TRIANGLES";
gl.TRIANGLE_STRIP = "TRIANGLE_STRIP";
gl.TRIANGLE_FAN = "TRIANGLE_FAN";
gl.ZERO = "ZERO";
gl.ONE = "ONE";
gl.SRC_COLOR = "SRC_COLOR";
gl.ONE_MINUS_SRC_COLOR = "ONE_MINUS_SRC_COLOR";
gl.SRC_ALPHA = "SRC_ALPHA";
gl.ONE_MINUS_SRC_ALPHA = "ONE_MINUS_SRC_ALPHA";
gl.DST_ALPHA = "DST_ALPHA";
gl.ONE_MINUS_DST_ALPHA = "ONE_MINUS_DST_ALPHA";
gl.DST_COLOR = "DST_COLOR";
gl.ONE_MINUS_DST_COLOR = "ONE_MINUS_DST_COLOR";
gl.SRC_ALPHA_SATURATE = "SRC_ALPHA_SATURATE";
gl.FUNC_ADD = "FUNC_ADD";
gl.BLEND_EQUATION = "BLEND_EQUATION";
gl.BLEND_EQUATION_RGB = "BLEND_EQUATION_RGB";
gl.BLEND_EQUATION_ALPHA = "BLEND_EQUATION_ALPHA";
gl.FUNC_SUBTRACT = "FUNC_SUBTRACT";
gl.FUNC_REVERSE_SUBTRACT = "FUNC_REVERSE_SUBTRACT";
gl.BLEND_DST_RGB = "BLEND_DST_RGB";
gl.BLEND_SRC_RGB = "BLEND_SRC_RGB";
gl.BLEND_DST_ALPHA = "BLEND_DST_ALPHA";
gl.BLEND_SRC_ALPHA = "BLEND_SRC_ALPHA";
gl.CONSTANT_COLOR = "CONSTANT_COLOR";
gl.ONE_MINUS_CONSTANT_COLOR = "ONE_MINUS_CONSTANT_COLOR";
gl.CONSTANT_ALPHA = "CONSTANT_ALPHA";
gl.ONE_MINUS_CONSTANT_ALPHA = "ONE_MINUS_CONSTANT_ALPHA";
gl.BLEND_COLOR = "BLEND_COLOR";
gl.ARRAY_BUFFER = "ARRAY_BUFFER";
gl.ELEMENT_ARRAY_BUFFER = "ELEMENT_ARRAY_BUFFER";
gl.ARRAY_BUFFER_BINDING = "ARRAY_BUFFER_BINDING";
gl.ELEMENT_ARRAY_BUFFER_BINDING = "ELEMENT_ARRAY_BUFFER_BINDING";
gl.STREAM_DRAW = "STREAM_DRAW";
gl.STATIC_DRAW = "STATIC_DRAW";
gl.DYNAMIC_DRAW = "DYNAMIC_DRAW";
gl.BUFFER_SIZE = "BUFFER_SIZE";
gl.BUFFER_USAGE = "BUFFER_USAGE";
gl.CURRENT_VERTEX_ATTRIB = "CURRENT_VERTEX_ATTRIB";
gl.FRONT = "FRONT";
gl.BACK = "BACK";
gl.FRONT_AND_BACK = "FRONT_AND_BACK";
gl.TEXTURE_2D = "TEXTURE_2D";
gl.CULL_FACE = "CULL_FACE";
gl.BLEND = "BLEND";
gl.DITHER = "DITHER";
gl.STENCIL_TEST = "STENCIL_TEST";
gl.DEPTH_TEST = "DEPTH_TEST";
gl.SCISSOR_TEST = "SCISSOR_TEST";
gl.POLYGON_OFFSET_FILL = "POLYGON_OFFSET_FILL";
gl.SAMPLE_ALPHA_TO_COVERAGE = "SAMPLE_ALPHA_TO_COVERAGE";
gl.SAMPLE_COVERAGE = "SAMPLE_COVERAGE";
gl.NO_ERROR = "NO_ERROR";
gl.INVALID_ENUM = "INVALID_ENUM";
gl.INVALID_VALUE = "INVALID_VALUE";
gl.INVALID_OPERATION = "INVALID_OPERATION";
gl.OUT_OF_MEMORY = "OUT_OF_MEMORY";
gl.CW = "CW";
gl.CCW = "CCW";
gl.LINE_WIDTH = "LINE_WIDTH";
gl.ALIASED_POINT_SIZE_RANGE = "ALIASED_POINT_SIZE_RANGE";
gl.ALIASED_LINE_WIDTH_RANGE = "ALIASED_LINE_WIDTH_RANGE";
gl.CULL_FACE_MODE = "CULL_FACE_MODE";
gl.FRONT_FACE = "FRONT_FACE";
gl.DEPTH_RANGE = "DEPTH_RANGE";
gl.DEPTH_WRITEMASK = "DEPTH_WRITEMASK";
gl.DEPTH_CLEAR_VALUE = "DEPTH_CLEAR_VALUE";
gl.DEPTH_FUNC = "DEPTH_FUNC";
gl.STENCIL_CLEAR_VALUE = "STENCIL_CLEAR_VALUE";
gl.STENCIL_FUNC = "STENCIL_FUNC";
gl.STENCIL_FAIL = "STENCIL_FAIL";
gl.STENCIL_PASS_DEPTH_FAIL = "STENCIL_PASS_DEPTH_FAIL";
gl.STENCIL_PASS_DEPTH_PASS = "STENCIL_PASS_DEPTH_PASS";
gl.STENCIL_REF = "STENCIL_REF";
gl.STENCIL_VALUE_MASK = "STENCIL_VALUE_MASK";
gl.STENCIL_WRITEMASK = "STENCIL_WRITEMASK";
gl.STENCIL_BACK_FUNC = "STENCIL_BACK_FUNC";
gl.STENCIL_BACK_FAIL = "STENCIL_BACK_FAIL";
gl.STENCIL_BACK_PASS_DEPTH_FAIL = "STENCIL_BACK_PASS_DEPTH_FAIL";
gl.STENCIL_BACK_PASS_DEPTH_PASS = "STENCIL_BACK_PASS_DEPTH_PASS";
gl.STENCIL_BACK_REF = "STENCIL_BACK_REF";
gl.STENCIL_BACK_VALUE_MASK = "STENCIL_BACK_VALUE_MASK";
gl.STENCIL_BACK_WRITEMASK = "STENCIL_BACK_WRITEMASK";
gl.VIEWPORT = "VIEWPORT";
gl.SCISSOR_BOX = "SCISSOR_BOX";
gl.COLOR_CLEAR_VALUE = "COLOR_CLEAR_VALUE";
gl.COLOR_WRITEMASK = "COLOR_WRITEMASK";
gl.UNPACK_ALIGNMENT = "UNPACK_ALIGNMENT";
gl.PACK_ALIGNMENT = "PACK_ALIGNMENT";
gl.MAX_TEXTURE_SIZE = "MAX_TEXTURE_SIZE";
gl.MAX_VIEWPORT_DIMS = "MAX_VIEWPORT_DIMS";
gl.SUBPIXEL_BITS = "SUBPIXEL_BITS";
gl.RED_BITS = "RED_BITS";
gl.GREEN_BITS = "GREEN_BITS";
gl.BLUE_BITS = "BLUE_BITS";
gl.ALPHA_BITS = "ALPHA_BITS";
gl.DEPTH_BITS = "DEPTH_BITS";
gl.STENCIL_BITS = "STENCIL_BITS";
gl.POLYGON_OFFSET_UNITS = "POLYGON_OFFSET_UNITS";
gl.POLYGON_OFFSET_FACTOR = "POLYGON_OFFSET_FACTOR";
gl.TEXTURE_BINDING_2D = "TEXTURE_BINDING_2D";
gl.SAMPLE_BUFFERS = "SAMPLE_BUFFERS";
gl.SAMPLES = "SAMPLES";
gl.SAMPLE_COVERAGE_VALUE = "SAMPLE_COVERAGE_VALUE";
gl.SAMPLE_COVERAGE_INVERT = "SAMPLE_COVERAGE_INVERT";
gl.COMPRESSED_TEXTURE_FORMATS = "COMPRESSED_TEXTURE_FORMATS";
gl.DONT_CARE = "DONT_CARE";
gl.FASTEST = "FASTEST";
gl.NICEST = "NICEST";
gl.GENERATE_MIPMAP_HINT = "GENERATE_MIPMAP_HINT";
gl.BYTE = "BYTE";
gl.UNSIGNED_BYTE = "UNSIGNED_BYTE";
gl.SHORT = "SHORT";
gl.UNSIGNED_SHORT = "UNSIGNED_SHORT";
gl.INT = "INT";
gl.UNSIGNED_INT = "UNSIGNED_INT";
gl.FLOAT = "FLOAT";
gl.DEPTH_COMPONENT = "DEPTH_COMPONENT";
gl.ALPHA = "ALPHA";
gl.RGB = "RGB";
gl.RGBA = "RGBA";
gl.LUMINANCE = "LUMINANCE";
gl.LUMINANCE_ALPHA = "LUMINANCE_ALPHA";
gl.UNSIGNED_SHORT_4_4_4_4 = "UNSIGNED_SHORT_4_4_4_4";
gl.UNSIGNED_SHORT_5_5_5_1 = "UNSIGNED_SHORT_5_5_5_1";
gl.UNSIGNED_SHORT_5_6_5 = "UNSIGNED_SHORT_5_6_5";
gl.FRAGMENT_SHADER = "FRAGMENT_SHADER";
gl.VERTEX_SHADER = "VERTEX_SHADER";
gl.MAX_VERTEX_ATTRIBS = "MAX_VERTEX_ATTRIBS";
gl.MAX_VERTEX_UNIFORM_VECTORS = "MAX_VERTEX_UNIFORM_VECTORS";
gl.MAX_VARYING_VECTORS = "MAX_VARYING_VECTORS";
gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS = "MAX_COMBINED_TEXTURE_IMAGE_UNITS";
gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS = "MAX_VERTEX_TEXTURE_IMAGE_UNITS";
gl.MAX_TEXTURE_IMAGE_UNITS = "MAX_TEXTURE_IMAGE_UNITS";
gl.MAX_FRAGMENT_UNIFORM_VECTORS = "MAX_FRAGMENT_UNIFORM_VECTORS";
gl.SHADER_TYPE = "SHADER_TYPE";
gl.DELETE_STATUS = "DELETE_STATUS";
gl.LINK_STATUS = "LINK_STATUS";
gl.VALIDATE_STATUS = "VALIDATE_STATUS";
gl.ATTACHED_SHADERS = "ATTACHED_SHADERS";
gl.ACTIVE_UNIFORMS = "ACTIVE_UNIFORMS";
gl.ACTIVE_ATTRIBUTES = "ACTIVE_ATTRIBUTES";
gl.SHADING_LANGUAGE_VERSION = "SHADING_LANGUAGE_VERSION";
gl.CURRENT_PROGRAM = "CURRENT_PROGRAM";
gl.NEVER = "NEVER";
gl.LESS = "LESS";
gl.EQUAL = "EQUAL";
gl.LEQUAL = "LEQUAL";
gl.GREATER = "GREATER";
gl.NOTEQUAL = "NOTEQUAL";
gl.GEQUAL = "GEQUAL";
gl.ALWAYS = "ALWAYS";
gl.KEEP = "KEEP";
gl.REPLACE = "REPLACE";
gl.INCR = "INCR";
gl.DECR = "DECR";
gl.INVERT = "INVERT";
gl.INCR_WRAP = "INCR_WRAP";
gl.DECR_WRAP = "DECR_WRAP";
gl.VENDOR = "VENDOR";
gl.RENDERER = "RENDERER";
gl.VERSION = "VERSION";
gl.NEAREST = "NEAREST";
gl.LINEAR = "LINEAR";
gl.NEAREST_MIPMAP_NEAREST = "NEAREST_MIPMAP_NEAREST";
gl.LINEAR_MIPMAP_NEAREST = "LINEAR_MIPMAP_NEAREST";
gl.NEAREST_MIPMAP_LINEAR = "NEAREST_MIPMAP_LINEAR";
gl.LINEAR_MIPMAP_LINEAR = "LINEAR_MIPMAP_LINEAR";
gl.TEXTURE_MAG_FILTER = "TEXTURE_MAG_FILTER";
gl.TEXTURE_MIN_FILTER = "TEXTURE_MIN_FILTER";
gl.TEXTURE_WRAP_S = "TEXTURE_WRAP_S";
gl.TEXTURE_WRAP_T = "TEXTURE_WRAP_T";
gl.TEXTURE = "TEXTURE";
gl.TEXTURE_CUBE_MAP = "TEXTURE_CUBE_MAP";
gl.TEXTURE_BINDING_CUBE_MAP = "TEXTURE_BINDING_CUBE_MAP";
gl.TEXTURE_CUBE_MAP_POSITIVE_X = "TEXTURE_CUBE_MAP_POSITIVE_X";
gl.TEXTURE_CUBE_MAP_NEGATIVE_X = "TEXTURE_CUBE_MAP_NEGATIVE_X";
gl.TEXTURE_CUBE_MAP_POSITIVE_Y = "TEXTURE_CUBE_MAP_POSITIVE_Y";
gl.TEXTURE_CUBE_MAP_NEGATIVE_Y = "TEXTURE_CUBE_MAP_NEGATIVE_Y";
gl.TEXTURE_CUBE_MAP_POSITIVE_Z = "TEXTURE_CUBE_MAP_POSITIVE_Z";
gl.TEXTURE_CUBE_MAP_NEGATIVE_Z = "TEXTURE_CUBE_MAP_NEGATIVE_Z";
gl.MAX_CUBE_MAP_TEXTURE_SIZE = "MAX_CUBE_MAP_TEXTURE_SIZE";
gl.TEXTURE0 = "TEXTURE0";
gl.TEXTURE1 = "TEXTURE1";
gl.TEXTURE2 = "TEXTURE2";
gl.TEXTURE3 = "TEXTURE3";
gl.TEXTURE4 = "TEXTURE4";
gl.TEXTURE5 = "TEXTURE5";
gl.TEXTURE6 = "TEXTURE6";
gl.TEXTURE7 = "TEXTURE7";
gl.TEXTURE8 = "TEXTURE8";
gl.TEXTURE9 = "TEXTURE9";
gl.TEXTURE10 = "TEXTURE10";
gl.TEXTURE11 = "TEXTURE11";
gl.TEXTURE12 = "TEXTURE12";
gl.TEXTURE13 = "TEXTURE13";
gl.TEXTURE14 = "TEXTURE14";
gl.TEXTURE15 = "TEXTURE15";
gl.TEXTURE16 = "TEXTURE16";
gl.TEXTURE17 = "TEXTURE17";
gl.TEXTURE18 = "TEXTURE18";
gl.TEXTURE19 = "TEXTURE19";
gl.TEXTURE20 = "TEXTURE20";
gl.TEXTURE21 = "TEXTURE21";
gl.TEXTURE22 = "TEXTURE22";
gl.TEXTURE23 = "TEXTURE23";
gl.TEXTURE24 = "TEXTURE24";
gl.TEXTURE25 = "TEXTURE25";
gl.TEXTURE26 = "TEXTURE26";
gl.TEXTURE27 = "TEXTURE27";
gl.TEXTURE28 = "TEXTURE28";
gl.TEXTURE29 = "TEXTURE29";
gl.TEXTURE30 = "TEXTURE30";
gl.TEXTURE31 = "TEXTURE31";
gl.ACTIVE_TEXTURE = "ACTIVE_TEXTURE";
gl.REPEAT = "REPEAT";
gl.CLAMP_TO_EDGE = "CLAMP_TO_EDGE";
gl.MIRRORED_REPEAT = "MIRRORED_REPEAT";
gl.FLOAT_VEC2 = "FLOAT_VEC2";
gl.FLOAT_VEC3 = "FLOAT_VEC3";
gl.FLOAT_VEC4 = "FLOAT_VEC4";
gl.INT_VEC2 = "INT_VEC2";
gl.INT_VEC3 = "INT_VEC3";
gl.INT_VEC4 = "INT_VEC4";
gl.BOOL = "BOOL";
gl.BOOL_VEC2 = "BOOL_VEC2";
gl.BOOL_VEC3 = "BOOL_VEC3";
gl.BOOL_VEC4 = "BOOL_VEC4";
gl.FLOAT_MAT2 = "FLOAT_MAT2";
gl.FLOAT_MAT3 = "FLOAT_MAT3";
gl.FLOAT_MAT4 = "FLOAT_MAT4";
gl.SAMPLER_2D = "SAMPLER_2D";
gl.SAMPLER_CUBE = "SAMPLER_CUBE";
gl.VERTEX_ATTRIB_ARRAY_ENABLED = "VERTEX_ATTRIB_ARRAY_ENABLED";
gl.VERTEX_ATTRIB_ARRAY_SIZE = "VERTEX_ATTRIB_ARRAY_SIZE";
gl.VERTEX_ATTRIB_ARRAY_STRIDE = "VERTEX_ATTRIB_ARRAY_STRIDE";
gl.VERTEX_ATTRIB_ARRAY_TYPE = "VERTEX_ATTRIB_ARRAY_TYPE";
gl.VERTEX_ATTRIB_ARRAY_NORMALIZED = "VERTEX_ATTRIB_ARRAY_NORMALIZED";
gl.VERTEX_ATTRIB_ARRAY_POINTER = "VERTEX_ATTRIB_ARRAY_POINTER";
gl.VERTEX_ATTRIB_ARRAY_BUFFER_BINDING = "VERTEX_ATTRIB_ARRAY_BUFFER_BINDING";
gl.IMPLEMENTATION_COLOR_READ_TYPE = "IMPLEMENTATION_COLOR_READ_TYPE";
gl.IMPLEMENTATION_COLOR_READ_FORMAT = "IMPLEMENTATION_COLOR_READ_FORMAT";
gl.COMPILE_STATUS = "COMPILE_STATUS";
gl.LOW_FLOAT = "LOW_FLOAT";
gl.MEDIUM_FLOAT = "MEDIUM_FLOAT";
gl.HIGH_FLOAT = "HIGH_FLOAT";
gl.LOW_INT = "LOW_INT";
gl.MEDIUM_INT = "MEDIUM_INT";
gl.HIGH_INT = "HIGH_INT";
gl.FRAMEBUFFER = "FRAMEBUFFER";
gl.RENDERBUFFER = "RENDERBUFFER";
gl.RGBA4 = "RGBA4";
gl.RGB5_A1 = "RGB5_A1";
gl.RGB565 = "RGB565";
gl.DEPTH_COMPONENT16 = "DEPTH_COMPONENT16";
gl.STENCIL_INDEX = "STENCIL_INDEX";
gl.STENCIL_INDEX8 = "STENCIL_INDEX8";
gl.DEPTH_STENCIL = "DEPTH_STENCIL";
gl.RENDERBUFFER_WIDTH = "RENDERBUFFER_WIDTH";
gl.RENDERBUFFER_HEIGHT = "RENDERBUFFER_HEIGHT";
gl.RENDERBUFFER_INTERNAL_FORMAT = "RENDERBUFFER_INTERNAL_FORMAT";
gl.RENDERBUFFER_RED_SIZE = "RENDERBUFFER_RED_SIZE";
gl.RENDERBUFFER_GREEN_SIZE = "RENDERBUFFER_GREEN_SIZE";
gl.RENDERBUFFER_BLUE_SIZE = "RENDERBUFFER_BLUE_SIZE";
gl.RENDERBUFFER_ALPHA_SIZE = "RENDERBUFFER_ALPHA_SIZE";
gl.RENDERBUFFER_DEPTH_SIZE = "RENDERBUFFER_DEPTH_SIZE";
gl.RENDERBUFFER_STENCIL_SIZE = "RENDERBUFFER_STENCIL_SIZE";
gl.FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE = "FRAMEBUFFER_ATTACHMENT_OBJECT_TYPE";
gl.FRAMEBUFFER_ATTACHMENT_OBJECT_NAME = "FRAMEBUFFER_ATTACHMENT_OBJECT_NAME";
gl.FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL = "FRAMEBUFFER_ATTACHMENT_TEXTURE_LEVEL";
gl.FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE = "FRAMEBUFFER_ATTACHMENT_TEXTURE_CUBE_MAP_FACE";
gl.COLOR_ATTACHMENT0 = "COLOR_ATTACHMENT0";
gl.DEPTH_ATTACHMENT = "DEPTH_ATTACHMENT";
gl.STENCIL_ATTACHMENT = "STENCIL_ATTACHMENT";
gl.DEPTH_STENCIL_ATTACHMENT = "DEPTH_STENCIL_ATTACHMENT";
gl.NONE = "NONE";
gl.FRAMEBUFFER_COMPLETE = "FRAMEBUFFER_COMPLETE";
gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT = "FRAMEBUFFER_INCOMPLETE_ATTACHMENT";
gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = "FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT";
gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS = "FRAMEBUFFER_INCOMPLETE_DIMENSIONS";
gl.FRAMEBUFFER_UNSUPPORTED = "FRAMEBUFFER_UNSUPPORTED";
gl.FRAMEBUFFER_BINDING = "FRAMEBUFFER_BINDING";
gl.RENDERBUFFER_BINDING = "RENDERBUFFER_BINDING";
gl.MAX_RENDERBUFFER_SIZE = "MAX_RENDERBUFFER_SIZE";
gl.INVALID_FRAMEBUFFER_OPERATION = "INVALID_FRAMEBUFFER_OPERATION";
gl.UNPACK_FLIP_Y_WEBGL = "UNPACK_FLIP_Y_WEBGL";
gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL = "UNPACK_PREMULTIPLY_ALPHA_WEBGL";
gl.CONTEXT_LOST_WEBGL = "CONTEXT_LOST_WEBGL";
gl.UNPACK_COLORSPACE_CONVERSION_WEBGL = "UNPACK_COLORSPACE_CONVERSION_WEBGL";
gl.BROWSER_DEFAULT_WEBGL = "BROWSER_DEFAULT_WEBGL";
/**
 * Created by dnvy0084 on 2015. 11. 21..
 */

(function () {

    "use strict";

    var display = glbasic.import("display");
    var geom = glbasic.import("geom");

    var RAD = 180 / Math.PI;
    var ANG = Math.PI / 180;

    var gl;

    DisplayObject.initIndexBuffer = function( webglContext ){

        gl = webglContext;

        DisplayObject.indexBuffer = gl.createBuffer();

        var indices = new Uint16Array([
            0, 1, 2,    0, 2, 3
        ]);

        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, DisplayObject.indexBuffer );
        gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW );
    };

    function DisplayObject() {

        this._x = 0;
        this._y = 0;
        this._scaleX = 1.0;
        this._scaleY = 1.0;
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
                    return this._radian * ANG;
                },
                set: function (value) {
                    this.radian = value * RAD;
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
    }

    DisplayObject.prototype = {

        constructor: DisplayObject,

        initWithImage: function ( webglContext, image ) {

            if( !gl ) gl = webglContext;
            this._image = image;

            this.setGeometry( this._image.width, this._image.height );
            this.setTexture();
        },

        setGeometry: function ( w, h ) {

            this.vertexBuffer = gl.createBuffer();

            var buf = new Float32Array([
                0, 0, 0, 0,
                w, 0, 1, 0,
                w, h, 1, 1,
                0, h, 0, 1
            ]);

            gl.bindBuffer( gl.ARRAY_BUFFER, this.vertexBuffer );
            gl.bufferData( gl.ARRAY_BUFFER, buf, this.vertexBuffer );
        },

        setTexture: function () {

            this.texture = gl.createTexture();

            gl.bindTexture( gl.TEXTURE_2D, this.texture );
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE );
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE );
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST );
                gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
            gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._image );
        },

        render: function (renderer) {

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


/****************
 * Stage.js
 *****************/

(function () {

    "use strict";

    var display = glbasic.import("display");
    var gl;

    function Stage( canvas ) {

        display.DisplayObjectContainer.call( this );

        if( typeof canvas == "string" )
            gl = document.getElementById( canvas).getContext( "webgl" );
        else
            gl = canvas.getContext( "webgl" );

        this.id = 0;
        this.superRender = display.DisplayObjectContainer.prototype.render.bind( this );

        this.onUpdate = this.update.bind( this );
        this.onUpdate( 0 );

        Object.defineProperties( this, {

            "renderer": {
                get: function () {
                    return this._renderer;
                }
            },

            "webglContext": {
                get: function () {
                    return gl;
                }
            },

            "background": {
                get: function () {
                    var a = gl.getParameter( gl.COLOR_CLEAR_VALUE );

                    return  parseInt( a[3] * 255 ) << 24 |
                            parseInt( a[0] * 255 ) << 16 |
                            parseInt( a[1] * 255 ) << 8 |
                            parseInt( a[2] * 255 );
                },
                set: function (value) {

                    var a = ( value >> 24 & 0xff ) / 255,
                        r = ( value >> 16 & 0xff ) / 255,
                        g = ( value >> 8 & 0xff ) / 255,
                        b = ( value & 0xff ) / 255;

                    gl.clearColor( r, g, b, a );
                }
            },
        });
    }

    var p = glbasic.extends( Stage, display.DisplayObjectContainer );

    p.initWithRenderer = function (renderer) {

        this._renderer = renderer;
    };

    p.update = function ( time ) {

        this.id = requestAnimationFrame( this.onUpdate );

        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

        this.superRender( this, [ this._renderer ] );
    };

    display.Stage = Stage;

})();


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
 * SolidColorProgram.js
 *****************/

(function () {

    "use strict";

    var render = glbasic.import("render");

    var gl;

    SolidColorProgram.COMPONENT_SIZE = 2;
    SolidColorProgram.DATA_PER_VERTEX = 4 * 2;
    SolidColorProgram.VERTEX_OFFSET = 0;

    function SolidColorProgram() {

        render.ProgramBase.call( this );

        var vertexSource =

            "attribute vec2 pos;" +

            "uniform mat3 transform;" +
            "uniform vec2 stage;" +

            "void main(){" +
                "vec2 p = ( transform * vec3( pos, 1.0 ) ).xy / stage * 2.0 - 1.0;" +
                "gl_Position = vec4( p.x, -p.y, 0, 1 );" +
            "}";

        var fragmentSource =

            "precision highp float;" +

            "uniform vec3 color;" +

            "void main(){" +
                "gl_FragColor = vec4( color, 1.0 );" +
            "}";

        gl = this.webGLContext;

        this.initWithSources( vertexSource, fragmentSource );
        this.initAttribs();
    }

    var p = glbasic.extends( SolidColorProgram, render.ProgramBase );

    p.initAttribs = function () {

        gl.useProgram( this._program );

        this.pos = gl.getAttribLocation( this._program, "pos" );

        this.transform = gl.getUniformLocation( this._program, "transform" );
        this.stage = gl.getUniformLocation( this._program, "stage" );
    };

    p.enable = function () {

        gl.useProgram( this._program );

        gl.enableVertexAttribArray( this.pos );
        gl.uniform2f( this.stage, gl.canvas.width, gl.canvas.height );
    };

    p.render = function (object) {

        gl.bindBuffer( object.buffer );

        gl.vertexAttribPointer(
            this.pos,
            SolidColorProgram.COMPONENT_SIZE,
            gl.FLOAT,
            false,
            SolidColorProgram.VERTEX_OFFSET
        );

        gl.uniformMatrix3fv( this.transform, false, object.transformMatrix.raw );
    };

    render.SolidColorProgram = SolidColorProgram;

})();


/****************
 * Node.js
 *****************/

(function () {

    "use strict";

    var texture = glbasic.import("texture");
    var geom = glbasic.import("geom");
    var Rectangle = geom.Rectangle;

    function Node( x, y, width, height ) {

        this._x = x;
        this._y = y;
        this._w = width;
        this._h = height;
        this._used = false;
        this._left = null;
        this._right = null;

        Object.defineProperties( this, {

            "x": {
                get: function () {
                    return this._x;
                }
            },

            "y": {
                get: function () {
                    return this._y;
                }
            },

            "width": {
                get: function () {
                    return this._w;
                }
            },

            "height": {
                get: function () {
                    return this._h;
                }
            },

            "used": {
                get: function () {
                    return this._used;
                }
            },

            "hasChildren": {
                get: function () {
                    return this._left != null;
                }
            },
        });
    }

    Node.prototype = {
        constructor: Node,
        append: function (width, height) {

            if( this.hasChildren )
                return  this._left.append( width, height ) ||
                        this._right.append( width, height );

            var w = this.width,
                h = this.height;

            if( this._used ) return null; // used node
            if( width > w || height > h ) return null; // too big

            // exact fit, return this node
            if( width == w && height == h ) return this._used = true, this;

            var dw = w - width,
                dh = h - height;

            if( dw > dh )
            {
                this._left = new Node( this.x, this.y, width, h );
                this._right = new Node( this.x + width, this.y, w - width, h );
            }
            else
            {
                this._left = new Node( this.x, this.y, w, height );
                this._right = new Node( this.x, this.y + height, w, h - height );
            }

            return this._left.append( width, height );
        },
    }

    texture.Node = Node;

})();


/****************
 * Texture.js
 *****************/

(function () {

    "use strict";

    var tex = glbasic.import("texture");
    var Node = tex.Node;

    var size = 2048;

    Texture.initWithSize = function (textureSize) {

        if( textureSize < 32 )
            throw new Error( "[Error]: textureSize has to bigger then 32" );

        var t = textureSize;

        for( ; t > 1; t >>= 1 ){
            if( t & 1 ) throw new Error( "[ERROR]: textureSize has to be pow of 2." );
        }

        size = textureSize;
    };

    function Texture() {

        this.root = new Node( 0, 0, size, size );

    }

    Texture.prototype = {
        constructor: Texture,

        append: function (key, width, height) {

        },
    }

    tex.Texture = Texture;

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
 
 /* global webkitCancelRequestAnimationFrame */

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
 
 /* global test */
 /* global glbasic */

(function () {

    "use strict";

    var testcase = test.import("testcase");
    var current = null;

    function init() {
        makeList();
    }

    function makeList() {

        var currentCase = testcase.TestGL2D;
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
 * NodeTest.js
 *****************/
 
 /* global glbasic */
 /* global requestAnimationFrame */
 /* global gl */

(function () {

    "use strict";

    var c = test.import("testcase");
    var tex = glbasic.import("texture");
    var Texture = tex.Texture;
    var Node = tex.Node;
    
    function NodeTest() {
        
    }

    var p = test.extends(NodeTest, c.BaseCase);

    p.start = function () {

        this.setTitle( "bin tree node test" );

        var canvas = document.getElementById("canvas");

        canvas.width = 1024;
        canvas.height = 1024;

        this.context = canvas.getContext( "2d" );
        this.off = document.createElement("canvas").getContext( "2d" );
        this.node = new Node( 0, 0, canvas.width, canvas.height );

        var t = 0;
        var randLen = 300;
        
        var onRender = (function render( ms ) {

            this.id = requestAnimationFrame( onRender );

            this.makeQuad(
                parseInt( randLen * Math.random() + 10 ),
                parseInt( randLen * Math.random() + 10 ),
                parseInt( 0xffffff * Math.random() )
            );

            var c = this.off.canvas;
            var n = this.node.append(c.width, c.height);

            if( n == null )
            {
                console.log( "NULL>", c.width, c.height );

                if( ++t > 10 )
                {
                    randLen -= 50;
                    t = 0;

                    if( randLen <= 0 )
                    {
                        webkitCancelRequestAnimationFrame( this.id );
                        console.log( "STOP" );
                    }

                    console.log( "not enough space", randLen );
                }

                return;
            }

            this.context.drawImage( c, n.x, n.y );

        }).bind(this);

        onRender();
        this.testTexturesCheckPowof2();
    };

    p.clear = function () {

    };

    p.testTexturesCheckPowof2 = function () {
        var a = [ 0, 23, 32, 60, 128, 256, 4096, 500 ];

        for (var i = 0; i < a.length; i++) {

            console.log( i, a[i] );

            try
            {
                Texture.initWithSize( a[i] );
            }
            catch( e )
            {
                console.log( e );
            }
        }
    };

    p.makeQuad = function ( w, h, color) {

        var canvas = this.off.canvas;

        canvas.width = w;
        canvas.height = h;

        this.off.fillStyle = this.toStyle( color );
        this.off.strokeStyle = "#333";
        this.off.rect( 0, 0, w, h );
        this.off.fill();
        this.off.stroke();
    };

    p.toStyle = function ( n ) {

        var t = n.toString( 16 );

        return "#" + new Array( 7 - t.length ).join( "0" ) + t;
    };

    c.NodeTest = NodeTest;

})();


/****************
 * RendererTest.js
 *****************/

 /* global glbasic */
 /* global WebGLRenderingContext gl */

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
        
        console.log( gl );

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
 * StageTest.js
 *****************/

(function () {

    "use strict";

    var c = test.import("testcase");
    var display = glbasic.import("display");
    var Stage = display.Stage;
    var DisplayObject = display.DisplayObject;

    var gl;

    function StageTest() {

    }

    var p = test.extends(StageTest, c.BaseCase);

    p.start = function () {

        this.setTitle( "stage test" );

        var stage = new Stage( "canvas" );
        stage.background = 0xffcccccc;

        console.log( stage.webglContext );

        var img = document.createElement( "img" );
        img.src = "img/laon0.png";

        var o = new DisplayObject();
        stage.add( o );
    };

    p.clear = function () {

    };

    c.StageTest = StageTest;

})();



/* global test */
/* global glbasic */

(function(){
    
    var testcase = test.import( "testcase" );
    var BaseCase = testcase.BaseCase;
    
    var display = glbasic.display;
    var DisplayObject = display.DisplayObject;
    var DisplayObjectContainer = display.DisplayObjectContainer;
    
    function TempTest(){
        var o = new DisplayObjectContainer();
        
    }
    
    var p = test.extends( TempTest, BaseCase );
    
    p.start = function(){
        
        var gl = document.getElementById( "canvas" ).getContext("webgl");
        
        this.setTitle( "temp test" );
    }
    
    p.clear = function(){
        var o = new display.DisplayObjectContainer();
    }
    
    testcase.TempTest = TempTest;
    
})();
/****************
 * TestGL2D.js
 *****************/

(function () {

    "use strict";

    var c = test.import("testcase");
    var core = gl2d.import("core");

    function TestGL2D() {

    }

    var p = test.extends(TestGL2D, c.BaseCase);

    p.start = function () {
        this.setTitle( "TestGL2D" );

        var ticker = new core.Ticker();
        var a = [];

        for (var i = 0; i < 10; i++) {

            var o = {};

            o.advanceTime = function(ms){
                if( ms > this.i * 1000 ) ticker.remove( this );
            }.bind(o);

            o.i = i;
            ticker.add( o );

            a.push(o);
        }
    };

    p.clear = function () {

    };

    c.TestGL2D = TestGL2D;

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
    var ProgramBase = render.ProgramBase;

    var gl;

    function TestSyncBuffer() {

    }

    var p = test.extends(TestSyncBuffer, c.BaseCase);

    p.start = function () {

        this.setTitle( "buffer sync test" );

        gl = document.getElementById( "canvas").getContext( "webgl" );
        gl.clearColor( 0, 0, 0, 1 );

        this.render = new Renderer();

        ProgramBase.setWebglContext( gl );

        var program = new render.SolidColorProgram();
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