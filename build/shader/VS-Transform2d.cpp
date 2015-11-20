
attribute vec2 pos;
attribute vec3 col;

uniform vec2 stage;
uniform mat4 transform;

varying vec3 color;

void main(){
    vec2 m = ( transform * vec4(pos, 0, 1) ).xy;
    vec2 p = m / stage * 2.0 - 1.0;

    color = col;//vec3( vec2( pos / stage ).yx, 1 );

    gl_Position = vec4(p.x, -p.y, 0, 1 );
}

