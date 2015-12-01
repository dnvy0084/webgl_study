
precision mediump float;

varying vec2 frag_uv;

uniform sampler2D tex;
uniform vec3 brightness;
uniform float contrast;

void main(){

    vec3 pixel = texture2D( tex, frag_uv ).rgb;
    pixel.rgb *= brightness;
    pixel = contrast * ( pixel - 0.5 ) + 0.5;

    gl_FragColor = vec4( pixel, 1 );
}