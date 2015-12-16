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

