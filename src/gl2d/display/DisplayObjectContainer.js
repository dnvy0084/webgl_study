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

