
precision mediump float;

varying vec2 frag_uv;

uniform sampler2D tex;

void main(){
    gl_FragColor = vec4( 1, 1, 1, 1 );//texture2D( tex, frag_uv );
}