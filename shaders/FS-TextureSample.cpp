
precision mediump float;

varying vec2 frag_uv;

uniform sampler2D image;

void main(){

    vec4 p = texture2D( image, frag_uv );

    p = p * 1.5;

    gl_FragColor = vec4( p );
}