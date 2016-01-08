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

