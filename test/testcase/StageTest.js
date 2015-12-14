/****************
 * StageTest.js
 *****************/

(function () {

    "use strict";

    var c = test.import("testcase");
    var display = glbasic.import("display");
    var Stage = display.Stage;

    var gl;

    function StageTest() {

    }

    var p = test.extends(StageTest, c.BaseCase);

    p.start = function () {
        this.setTitle( "stage test" );
        gl = document.getElementById( "canvas").getContext( "webgl" );

        new Stage();
    };

    p.clear = function () {

    };

    c.StageTest = StageTest;

})();

