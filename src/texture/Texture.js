/****************
 * Texture.js
 *****************/

(function () {

    "use strict";

    var tex = glbasic.import("texture");
    var Node = tex.Node;

    var size = 2048;

    Texture.initWithSize = function (textureSize) {

        if( textureSize < 32 )
            throw new Error( "[Error]: textureSize has to bigger then 32" );

        var t = textureSize;

        for( ; t > 1; t >>= 1 ){
            if( t & 1 ) throw new Error( "[ERROR]: textureSize has to be pow of 2." );
        }

        size = textureSize;
    };

    function Texture() {

        this.root = new Node( 0, 0, size, size );

    }

    Texture.prototype = {
        constructor: Texture,

        append: function (key, width, height) {

        },
    }

    tex.Texture = Texture;

})();

