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

