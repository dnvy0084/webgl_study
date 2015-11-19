
attribute vec2 pos;

uniform vec2 stage;
uniform mat4 transform;

void main(){
    vec2 m = ( transform * vec4(pos, 0, 1) ).xy;
    vec2 p = m / stage * 2.0 - 1.0;

    gl_Position = vec4(p.x, -p.y, 0, 1 );
}

