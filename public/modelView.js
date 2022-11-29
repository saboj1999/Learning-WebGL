


/**
 * 
 * @param {*} vertexData 
 * @param {*} colorData 
 * @returns the uniform locations of the related model, view and projection matrices 
 * with their appropriate shaders on the GPU
 */
function createColorView(vertexData, colorData) 
// will later have to add textureData, 
//option for which vertexShader / fragmentShader
{

const locMatrix = mat4.create();
// gl.uniformMatrix4fv(locMatrix, false, locMatrix);


const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
precision mediump float;
attribute vec3 position;
attribute vec3 color;
varying vec3 vColor;
uniform mat4 matrix;
uniform mat4 cameraMatrix;
uniform mat4 projectionMatrix;
void main() {
    vColor = color;

    gl_Position = projectionMatrix * cameraMatrix * matrix * vec4(position, 1);
}
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
precision mediump float;
varying vec3 vColor;
void main() {
    gl_FragColor = vec4(vColor, 1);
}
`);
gl.compileShader(fragmentShader);
//console.log(gl.getShaderInfoLog(fragmentShader));

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);  // needs to be in animate
gl.enable(gl.DEPTH_TEST);

let vao = gl.createVertexArray();
gl.bindVertexArray(vao);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW); // very expensive - moving from cpu to gpu
const positionLocation = gl.getAttribLocation(program, `position`);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionLocation);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);  // needs to be in animate
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);
const colorLocation = gl.getAttribLocation(program, `color`);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(colorLocation);

gl.bindVertexArray(null);
gl.bindBuffer(gl.ARRAY_BUFFER, null);

const object = {
    program: program,
    vao: vao,
    locMatrix: locMatrix,
    matrix: gl.getUniformLocation(program, 'matrix'),
    cameraMatrix: gl.getUniformLocation(program, 'cameraMatrix'),
    projectionMatrix: gl.getUniformLocation(program, 'projectionMatrix') 
};

return object;
}




// ======================================================================================================
// ======================================================================================================
// ======================================================================================================





/**
 * 
 * @param {*} vertexData 
 * @param {*} uvData 
 * @returns the uniform locations of the related model, view and projection matrices 
 * with their appropriate shaders on the GPU
 */
 function createTextureView(vertexData, uvData) 
 {
 
 const locMatrix = mat4.create();
 // gl.uniformMatrix4fv(locMatrix, false, locMatrix);
 
 
 const vertexShader = gl.createShader(gl.VERTEX_SHADER);
 gl.shaderSource(vertexShader, `
 precision mediump float;

 attribute vec3 position;
 attribute vec2 uv;

 varying vec2 vUV;

 uniform mat4 matrix;
 uniform mat4 cameraMatrix;
 uniform mat4 projectionMatrix;
 void main() {
     vUV = uv;
 
     gl_Position = projectionMatrix * cameraMatrix * matrix * vec4(position, 1);
 }
 `);
 gl.compileShader(vertexShader);
 
 const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
 gl.shaderSource(fragmentShader, `
 precision mediump float;
 varying vec2 vUV;
 uniform sampler2D textureID;

 void main() {
     gl_FragColor = texture2D(textureID, vUV);
 }
 `);
 gl.compileShader(fragmentShader);
 //console.log(gl.getShaderInfoLog(fragmentShader));
 
 const program = gl.createProgram();
 gl.attachShader(program, vertexShader);
 gl.attachShader(program, fragmentShader);
 gl.linkProgram(program);
 gl.useProgram(program);  // needs to be in animate
 gl.enable(gl.DEPTH_TEST);
 
 let vao = gl.createVertexArray();
 gl.bindVertexArray(vao);
 
 const positionBuffer = gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW); // very expensive - moving from cpu to gpu
 const positionLocation = gl.getAttribLocation(program, `position`);
 gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
 gl.enableVertexAttribArray(positionLocation);
 
 const uvBuffer = gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);  // needs to be in animate
 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvData), gl.STATIC_DRAW);
 const uvLocation = gl.getAttribLocation(program, `uv`);
 gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);
 gl.enableVertexAttribArray(uvLocation);
 
 gl.bindVertexArray(null);
 gl.bindBuffer(gl.ARRAY_BUFFER, null);
 
 const object = {
     program: program,
     vao: vao,
     locMatrix: locMatrix,
     textureID: gl.getUniformLocation(program, 'textureID'),
     matrix: gl.getUniformLocation(program, 'matrix'),
     cameraMatrix: gl.getUniformLocation(program, 'cameraMatrix'),
     projectionMatrix: gl.getUniformLocation(program, 'projectionMatrix') 
 };
 
 return object;
 }






 // ======================================================================================================
// ======================================================================================================
// ======================================================================================================





/**
 * 
 * @param {*} vertexData 
 * @param {*} uvData 
 * @param {*} normalData
 * @returns the uniform locations of the related model, view and projection matrices 
 * with their appropriate shaders on the GPU
 */
 function createTextureNormalView(vertexData, uvData, normalData) 
 {
 
 const locMatrix = mat4.create();
 // gl.uniformMatrix4fv(locMatrix, false, locMatrix);
 
 
 const vertexShader = gl.createShader(gl.VERTEX_SHADER);
 gl.shaderSource(vertexShader, `
 precision mediump float;

 const vec3 lightDirection = normalize(vec3(0, 1.0, 1.0));
 const float ambient = 0.1;

 attribute vec3 position;
 attribute vec2 uv;
 attribute vec3 normal;

 varying vec2 vUV;
 varying float vBrightness;

 uniform mat4 matrix;
 uniform mat4 cameraMatrix;
 uniform mat4 projectionMatrix;

 uniform mat4 normalMatrix;

 void main() {
     vec3 worldNormal = (normalMatrix * vec4(normal, 1)).xyz;
     float diffuse = max(0.0, dot(worldNormal, lightDirection));
     vUV = uv;
     vBrightness = ambient + diffuse;
 
     gl_Position = projectionMatrix * cameraMatrix * matrix * vec4(position, 1);
 }
 `);
 gl.compileShader(vertexShader);
 
 const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
 gl.shaderSource(fragmentShader, `
 precision mediump float;

 varying vec2 vUV;
 varying float vBrightness;

 uniform sampler2D textureID;

 void main() {
     vec4 texel = texture2D(textureID, vUV);
     texel.xyz *= vBrightness;
     gl_FragColor = texel;
 }
 `);
 gl.compileShader(fragmentShader);
 //console.log(gl.getShaderInfoLog(fragmentShader));
 
 const program = gl.createProgram();
 gl.attachShader(program, vertexShader);
 gl.attachShader(program, fragmentShader);
 gl.linkProgram(program);
 gl.useProgram(program);  // needs to be in animate
 gl.enable(gl.DEPTH_TEST);
 
 let vao = gl.createVertexArray();
 gl.bindVertexArray(vao);
 
 const positionBuffer = gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW); // very expensive - moving from cpu to gpu
 const positionLocation = gl.getAttribLocation(program, `position`);
 gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
 gl.enableVertexAttribArray(positionLocation);
 
 const uvBuffer = gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);  // needs to be in animate
 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvData), gl.STATIC_DRAW);
 const uvLocation = gl.getAttribLocation(program, `uv`);
 gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);
 gl.enableVertexAttribArray(uvLocation);

 const normalBuffer = gl.createBuffer();
 gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);  // needs to be in animate
 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalData), gl.STATIC_DRAW);
 const normalLocation = gl.getAttribLocation(program, `normal`);
 gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
 gl.enableVertexAttribArray(normalLocation);
 
 gl.bindVertexArray(null);
 gl.bindBuffer(gl.ARRAY_BUFFER, null);
 
 const object = {
     program: program,
     vao: vao,
     locMatrix: locMatrix,
     textureID: gl.getUniformLocation(program, 'textureID'),
     normalMatrix: gl.getUniformLocation(program, `normalMatrix`),
     matrix: gl.getUniformLocation(program, 'matrix'),
     cameraMatrix: gl.getUniformLocation(program, 'cameraMatrix'),
     projectionMatrix: gl.getUniformLocation(program, 'projectionMatrix') 
 };
 
 return object;
 }