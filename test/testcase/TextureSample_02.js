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