
/****************
 * testmain.js
 *****************/

(function () {

    "use strict";

    var testcase = test.import("testcase");
    var current = null;

    function init() {
        makeList();
    }

    function makeList() {

        var currentCase = testcase.TextureSample_02;
        var list = document.getElementById( "list" );

        for( var s in testcase ){
            if( s == "BaseCase" ) continue;

            var opt = document.createElement("option");
            opt.value = s;
            opt.innerHTML = s;

            list.appendChild( opt );
        }

        list.addEventListener( "change", onChange );
        startCase( currentCase );
    }

    function onChange(e) {
        startCase( testcase[ e.target.selectedOptions[0].value ] );
    }

    function clearCase() {
        if( current == null ) return;

        current.clear();
    }

    function startCase( item ) {

        clearCase();
        current = new item();
        current.start();
    }

    window.onload = init;

})();