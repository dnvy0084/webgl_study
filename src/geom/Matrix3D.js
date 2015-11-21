/**
 * Created by dnvy0084 on 2015. 11. 21..
 */

(function () {

    "use strict";

    var geom = glbasic.import("geom");

    function Matrix3D() {

        Object.defineProperties( this, {
            "raw": {
                get: function () {
                    return this._raw;
                }
            },
        });

        this._raw = new Float32Array(16);
        this.identity();
    }

    Matrix3D.prototype = {
        constructor: Matrix3D,

        setTo: function (
            m11, m12, m13, m14,
            m21, m22, m23, m24,
            m31, m32, m33, m34,
            m41, m42, m43, m44
        ){
            var m = this._raw;

            m[0] = m11, m[4] = m12, m[8 ] = m13, m[12] = m14,
            m[1] = m21, m[5] = m22, m[9 ] = m23, m[13] = m24,
            m[2] = m31, m[6] = m32, m[10] = m33, m[14] = m34,
            m[3] = m41, m[7] = m42, m[11] = m43, m[15] = m44;
        },

        identity: function () {
            this.setTo(
                1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1
            );
        },

        /**
         * this = b * this
         * @param b
         */
        preppend: function (b) {
            var m = b._raw;

            var a11 = m[0], a12 = m[4], a13 = m[8 ], a14 = m[12],
                a21 = m[1], a22 = m[5], a23 = m[9 ], a24 = m[13],
                a31 = m[2], a32 = m[6], a33 = m[10], a34 = m[14],
                a41 = m[3], a42 = m[7], a43 = m[11], a44 = m[15];

            m = this._raw;

            var b11 = m[0], b12 = m[4], b13 = m[8 ], b14 = m[12],
                b21 = m[1], b22 = m[5], b23 = m[9 ], b24 = m[13],
                b31 = m[2], b32 = m[6], b33 = m[10], b34 = m[14],
                b41 = m[3], b42 = m[7], b43 = m[11], b44 = m[15];

            var c11 = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41,
                c12 = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42,
                c13 = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43,
                c14 = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44,

                c21 = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41,
                c22 = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42,
                c23 = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43,
                c24 = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44,

                c31 = a31 * b11 + a32 * b21 + a33 * b31 + a44 * b41,
                c32 = a31 * b12 + a32 * b22 + a33 * b32 + a44 * b42,
                c33 = a31 * b13 + a32 * b23 + a33 * b33 + a44 * b43,
                c34 = a31 * b14 + a32 * b24 + a33 * b34 + a44 * b44,

                c41 = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41,
                c42 = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42,
                c43 = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43,
                c44 = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

            this.setTo(
                c11, c12, c13, c14,
                c21, c22, c23, c24,
                c31, c32, c33, c34,
                c41, c42, c43, c44
            );
        },
    };

    geom.Matrix3D = Matrix3D;

})();