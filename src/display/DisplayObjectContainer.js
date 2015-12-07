/**
 * Created by dnvy0084 on 15. 12. 7..
 */

(function () {

    var display = glbasic.import( "display" );

    function DisplayObjectContainer() {

        display.DisplayObject.call( this );

        this._children = [];
    }

    var p = glbasic.extends( DisplayObjectContainer, display.DisplayObject );

    p.render = function (renderer) {

        for (var i = 0, l = this._children.length; i < l; i++) {

            this._children[i].render( renderer );
        }
    };

    p.add = function (child) {

        var index = this._children.indexOf( child );

        if(index != -1) return;

        this._children.push( child );
        child.parent = this;
    };

    p.remove = function (child) {

        var index = this._children.indexOf(child);

        if(index != -1) return;

        this._children.splice( index, 1 );
        child.parent = null;
    };

    p.contains = function (child) {
        return this._children.indexOf(child) != -1;
    };
    
    display.DisplayObjectContainer = DisplayObjectContainer;

})();