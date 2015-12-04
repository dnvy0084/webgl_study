
attribute vec2 pos;
attribute vec2 uv;

uniform vec2 stage;
uniform mat3 mat;

varying vec2 frag_uv;

void main(){

    frag_uv = uv;

    vec2 p = ( mat * vec3( pos, 1 ) ).xy;
    p = p / stage * 2.0 - 1.0;

    gl_Position = vec4( p.x, -p.y, 0, 1 );
}