
attribute vec2 pos;

uniform vec2 clipspace;

void main(){

    vec2 convert = pos / clipspace * 2.0 - 1.0;

    gl_Position = vec4( convert.x, -convert.y, 0.0, 1.0 );
}