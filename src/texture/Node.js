/****************
 * Node.js
 *****************/

(function () {

    "use strict";

    var texture = glbasic.import("texture");
    var geom = glbasic.import("geom");
    var Rectangle = geom.Rectangle;

    function Node( x, y, width, height ) {

        this._x = x;
        this._y = y;
        this._w = width;
        this._h = height;
        this._used = false;
        this._left = null;
        this._right = null;

        Object.defineProperties( this, {

            "x": {
                get: function () {
                    return this._x;
                }
            },

            "y": {
                get: function () {
                    return this._y;
                }
            },

            "width": {
                get: function () {
                    return this._w;
                }
            },

            "height": {
                get: function () {
                    return this._h;
                }
            },

            "used": {
                get: function () {
                    return this._used;
                }
            },

            "hasChildren": {
                get: function () {
                    return this._left != null;
                }
            },
        });
    }

    Node.prototype = {
        constructor: Node,
        append: function (width, height) {

            if( this.hasChildren )
                return  this._left.append( width, height ) ||
                        this._right.append( width, height );

            var w = this.width,
                h = this.height;

            if( this._used ) return null; // used node
            if( width > w || height > h ) return null; // too big

            // exact fit, return this node
            if( width == w && height == h ) return this._used = true, this;

            var dw = w - width,
                dh = h - height;

            if( dw > dh )
            {
                this._left = new Node( this.x, this.y, width, h );
                this._right = new Node( this.x + width, this.y, w - width, h );
            }
            else
            {
                this._left = new Node( this.x, this.y, w, height );
                this._right = new Node( this.x, this.y + height, w, h - height );
            }

            return this._left.append( width, height );
        },
    }

    texture.Node = Node;

})();

