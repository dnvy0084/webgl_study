
attribute vec2 pos;
attribute vec2 uv;

uniform mat4 mat;
uniform vec2 stage;

varying vec2 frag_uv;

void main(){

    frag_uv = uv;

    vec2 p = ( mat * vec4(pos, 0, 1) ).xy;
    p = p / stage * 2.0 - 1.0;

    gl_Position = vec4(p.x, -p.y, 0, 1);
}