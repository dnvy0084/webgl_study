
/* global test */
/* global glbasic */

(function(){
    
    var testcase = test.import( "testcase" );
    var BaseCase = testcase.BaseCase;
    
    var display = glbasic.display;
    var DisplayObject = display.DisplayObject;
    var DisplayObjectContainer = display.DisplayObjectContainer;
    
    function TempTest(){
        var o = new DisplayObjectContainer();
        
    }
    
    var p = test.extends( TempTest, BaseCase );
    
    p.start = function(){
        
        var gl = document.getElementById( "canvas" ).getContext("webgl");
        
        this.setTitle( "temp test" );
    }
    
    p.clear = function(){
        var o = new display.DisplayObjectContainer();
    }
    
    testcase.TempTest = TempTest;
    
})();