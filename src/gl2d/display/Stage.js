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

