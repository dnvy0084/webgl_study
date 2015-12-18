/****************
 * NodeTest.js
 *****************/

(function () {

    "use strict";

    var c = test.import("testcase");
    var texture = glbasic.import("texture");
    var Node = texture.Node;

    function NodeTest() {

    }

    var p = test.extends(NodeTest, c.BaseCase);

    p.start = function () {

        this.setTitle( "node test" );

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
    };

    p.clear = function () {

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

