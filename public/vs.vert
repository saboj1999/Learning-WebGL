precision mediump float;
attribute vec3 position;
attribute vec3 color;
varying vec3 vColor;
uniform mat4 matrix;
uniform mat4 locMatrix;
uniform mat4 cameraMatrix;
uniform mat4 projectionMatrix;
void main() {
    vColor = color;

    gl_Position = projectionMatrix * cameraMatrix * matrix * locMatrix * vec4(position, 1);
}