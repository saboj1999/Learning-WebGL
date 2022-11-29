/**
 * vertex data = [...]
 * create buffer
 * load vertexdata into buffer
 * 
 * create vertex shader
 * create fragment shader
 * create shader program
 * attach shaders to program
 * 
 * enable vertex attributes
 * 
 * draw arrays
 * 
 * */
const { mat2, mat2d, mat3, mat4, quat, quat2, vec2, vec3, vec4 } = glMatrix; // needed for newer versions of webGL


const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');

if (!gl) {
    throw new Error('WebGL not supported');
}

// Construct an Array by repeating `pattern` n times
function repeat(n, pattern) {
    return [...Array(n)].reduce(sum => sum.concat(pattern), []);
}

// Load Resources
function loadTexture(url) {
    const texture = gl.createTexture();
    const image = new Image();

    image.onload = e => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        gl.generateMipmap(gl.TEXTURE_2D);
    };

    image.src = url;
    return texture;
}

const brick = loadTexture(`textures/default_brick.png`);
gl.activeTexture(gl.TEXTURE0);
gl.bindTexture(gl.TEXTURE_2D, brick);

const bubble = loadTexture('textures/bubble.png');
gl.activeTexture(gl.TEXTURE0+1);
gl.bindTexture(gl.TEXTURE_2D, bubble);

const stone = loadTexture('textures/default_stone.png');
gl.activeTexture(gl.TEXTURE0+2);
gl.bindTexture(gl.TEXTURE_2D, stone);

const grass = loadTexture('textures/default_grass.png');
gl.activeTexture(gl.TEXTURE0+3);
gl.bindTexture(gl.TEXTURE_2D, grass);




let vertexData = [];

// vertexData = torus(10, 6, 2*Math.PI/24.5, 2*Math.PI/24.5);

let vertexData2 = sphere(5, 2*Math.PI/60, 2*Math.PI/40);

// let vertexData2 = cylinder(7.24, 15, 2*Math.PI/50, .7);

vertexData2 = mirrorAllAxes(vertexData2, 20);
// vertexData2 = mirrorAllAxes(vertexData2, 40);


vertexData = floor(1000, 401, 10, 10);

const uvData = repeat(vertexData.length/(3*6), [
    0, 0,
    1, 0,
    0, 1,
    0, 0,
    1, 1, 
    1, 0
]);
const uvData2 = repeat(vertexData2.length/(3*6), [
    0, 0,
    1, 0,
    0, 1,
    0, 0,
    0, 1, 
    1, 1
]);

// F|L|B|R|T|U
const normalData = [
    ...repeat(vertexData.length/(3*6), [0, 0, 1]),    // Z+
    ...repeat(vertexData.length/(3*6), [-1, 0, 0]),   // X-
    ...repeat(vertexData.length/(3*6), [0, 0, -1]),   // Z-
    ...repeat(vertexData.length/(3*6), [1, 0, 0]),    // X+
    ...repeat(vertexData.length/(3*6), [0, 1, 0]),    // Y+
    ...repeat(vertexData.length/(3*6), [0, -1, 0]),   // Y-
]

const colorData = getColorData(vertexData, 12, [0, .75, 0], [0, .5, 0]); // only needed for createColorView()
const colorData2 = getColorData(vertexData2, 12, randomColor(), randomColor());


const worldMatrix = mat4.create();
const cameraMatrix = mat4.create();
let eye = vec4.fromValues(0, 0, 1e-4, 1);


// mat4.translate(matrix, matrix, [.2, .5, 0]);

// mat4.scale(matrix, matrix, [0.12/12, 0.12/12, 0.12/12]);

//mat4.rotateZ(matrix, matrix, Math.PI/2);

/**
 * 
 * @param {*} direction a vec4 object
 * translates the world matrix in a give direction
 * that direction is respective to the camera matrix
 */
function perpendicularDirection(direction)
{
    var cmt = mat4.create();
    mat4.transpose(cmt, cameraMatrix);
    vec4.transformMat4(direction, direction, cmt);
    mat4.translate(worldMatrix, worldMatrix, direction);
}

document.addEventListener('keydown', function(event) {
    let speed = 1;
    if (event.code == 'KeyD') { // right
        var direction = [-speed, 0, 0, 1];
        perpendicularDirection(direction);

    } else if (event.code == 'KeyA') { // left
        var direction = [speed, 0, 0, 1];
        perpendicularDirection(direction);
  
    } else if (event.code == 'KeyW') { // forward
        var direction = [0, 0, speed, 1];
        perpendicularDirection(direction);

    } else if (event.code == 'KeyS') { // backward
        var direction = [0, 0, -speed, 1];
        perpendicularDirection(direction);

    } else if (event.code == 'Space') { // up
        var direction = [0, -speed, 0];
        mat4.translate(worldMatrix, worldMatrix, direction);
        // vec4.transformMat4(eye, eye, zoomOut);
        // mat4.lookAt(cameraMatrix, eye, [0,0,0,1], [0,1,0,1]);

    } else if (event.keyCode == 16) { // down -->left shift
        var direction = [0, speed, 0];
        mat4.translate(worldMatrix, worldMatrix, direction);
    } 
    
    else if (event.keyCode == 38) { // look down --> up arrow

        // let up = [0,0,0,1]; // these two should be updated on WASD????
        // let look = [0,1,0,1];
        mat4.rotateX(cameraMatrix, cameraMatrix, 2*Math.PI/64);
        // var cmt = mat4.create();
        // mat4.transpose(cmt, cameraMatrix);
        // vec4.transformMat4(up, up, cmt);
        // vec4.transformMat4(look, look, cmt); // cameraMatrix works but only on one axis
        // mat4.lookAt(cmt, eye, up, look);

    } else if (event.keyCode == 40) { // look up --> down arrow

        mat4.rotateX(cameraMatrix, cameraMatrix, -2*Math.PI/64);

    } else if (event.keyCode == 39) { // look right --> right arrow

        mat4.rotateY(cameraMatrix, cameraMatrix, 2*Math.PI/64); // camera matrix works right-left OR up-down

    } else if (event.keyCode == 37) { // look left --> left arrow

        mat4.rotateY(cameraMatrix, cameraMatrix, -2*Math.PI/64);
    }

  });

  mat4.lookAt(cameraMatrix, eye, [0,0,0,1], [0,1,0,1]); 

const projectionMatrix = mat4.create();
mat4.perspective(projectionMatrix, 
      90 * Math.PI/180, // vertical field-of-view (angle, radians)
      canvas.width/canvas.height, // aspect W/H
      1e-4, // near cull distance
      1e4 // far cull distance
);

  
  mat4.translate(worldMatrix, worldMatrix, [0, -10, -30]);

  mat4.invert(cameraMatrix, cameraMatrix);

  const normalMatrix = mat4.create();
  const mvMatrix = mat4.create();

  const object1 = createTextureView(vertexData, uvData);
  gl.uniform1i(object1.textureID, 3);

  const object2 = createTextureView(vertexData2, uvData2);
  gl.uniform1i(object2.textureID, 2); // setting the texture for object2 to the texture at ID 0 "currently brick"

  //   mat4.translate(object2.locMatrix, object2.locMatrix, [0, 10, 0]);
//   mat4.multiply(worldMatrix, worldMatrix, object2.locMatrix);

function bindObject(object) {
    gl.useProgram(object.program);
    gl.bindVertexArray(object.vao);
    gl.uniformMatrix4fv(object.matrix, false, worldMatrix); // loading the matrices onto the GPU
    gl.uniformMatrix4fv(object.cameraMatrix, false, cameraMatrix);
    gl.uniformMatrix4fv(object.projectionMatrix, false, projectionMatrix);
}


function animate() {
    requestAnimationFrame(animate);

    // add rotations here
    // mat4.rotateZ(worldMatrix, worldMatrix, Math.PI/4 / 60);
    // mat4.rotateX(worldMatrix, worldMatrix, -Math.PI/4 / 50);
    // mat4.rotateY(worldMatrix, worldMatrix, -Math.PI/4 / 40);

    mat4.invert(normalMatrix, mat4.multiply(mvMatrix, cameraMatrix, worldMatrix));
    mat4.transpose(normalMatrix, normalMatrix);


    bindObject(object1);
    // gl.uniformMatrix4fv(object1.normalMatrix, false, normalMatrix); // needed for normals
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);

    bindObject(object2);
    gl.drawArrays(gl.TRIANGLES, 0, vertexData2.length / 3);

    gl.bindVertexArray(null);

    // send new matrix
    //draw new arrays
}

animate(); 