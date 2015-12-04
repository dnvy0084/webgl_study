
/****************
 * BaseCase.js
 *****************/

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