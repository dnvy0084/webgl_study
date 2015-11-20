
attribute vec2 pos;
attribute vec2 uv;

varying vec2 frag_uv;

uniform vec2 stage;
uniform mat4 mat;

void main(){

    frag_uv = uv;

    vec2 p = vec4( mat * vec4( pos, 0, 1 ) ).xy;
    p = p / stage * 2.0 - 1.0;

    gl_Position = vec4( p.x, -p.y, 0, 1 );
}