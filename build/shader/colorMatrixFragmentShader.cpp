
precision highp float;

uniform mat4 colorMat;
uniform sampler2D tex;

varying vec2 frag_uv;

void main(){
    gl_FragColor = texture2D( tex, frag_uv );
}