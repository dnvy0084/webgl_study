
attribute vec2 pos;

uniform vec2 stage;

void main(){

    vec2 p = pos / stage * 2.0 - 1.0;

    gl_Position = vec4( p.x, -p.y, 0, 1 );
}