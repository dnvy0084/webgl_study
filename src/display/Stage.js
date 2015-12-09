/****************
 * Stage.js
 *****************/

(function () {

    "use strict";

    var display = glbasic.import("display");

    Stage.initialize = function () {

    };

    function Stage() {

        display.DisplayObjectContainer.call( this );

        this.id = 0;
        this.superRender = display.DisplayObjectContainer.render.bind( this );

        this.onUpdate = this.update.bind( this );
        this.onUpdate( 0 );

        Object.defineProperties( this, {

            "renderer": {
                get: function () {
                    return this._renderer;
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

        this.superRender( this, [ this._renderer ] );
    };

    display.Stage = Stage;

})();

