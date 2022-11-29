/**
 * 
 * @param {*} length 
 * @param {*} width 
 * @param {*} dX 
 * @param {*} dY 
 * @returns vertices of a floor
 */
function floor(length, width, dX, dY)
{
    const layFlat = mat4.create();
    mat4.rotateX(layFlat, layFlat, Math.PI/2);

    const center = mat4.create();
    mat4.translate(center, center, [-length/2, 0, -width/2]);

    const z = 0;
    allVertices = [];
    for(let x = 0; x < length; x+=dX)
    {
        for(let y = 0; y < width; y+=dY)
        {
            let x1 = x;
            let y1 = y;
            let z1 = z;

            let x2 = x + dX;
            let y2 = y + dY;
            let z2 = z;

            let x3 = x + dX;
            let y3 = y;
            let z3 = z;

            let x5 = x;
            let y5 = y + dY;
            let z5 = z;

            allVertices.push(x1, y1, z1);
            allVertices.push(x2, y2, z2);
            allVertices.push(x3, y3, z3);
            allVertices.push(x1, y1, z1);
            allVertices.push(x5, y5, z5);
            allVertices.push(x2, y2, z2);
        }
    }


    let holder = [];

    for(let i=0; i<allVertices.length; i+=3)
    {
        let temp = vec3.fromValues(allVertices[i], allVertices[i+1], allVertices[i+2]);

        vec3.transformMat4(temp, temp, layFlat);
        vec3.transformMat4(temp, temp, center);
        holder.push(temp[0], temp[1], temp[2]);

    }
    allVertices = holder;

    return allVertices;
}


/**
 * 
 * @param {*} radius 
 * @param {*} height 
 * @param {*} dTheta 
 * @param {*} dHeight 
 * @returns vertices of a cylinder
 */
function cylinder(radius, height, dTheta, dHeight)
{
    const down = mat4.create();
    mat4.translate(down, down, [0,-dHeight,0]);

    allVertices = [];
    // first add the caps
    for(let i = 0; i < 2; i++)
    {
        let mod = i > 0 ? -1 : 1;
        for(let theta = 0; theta < 2*Math.PI; theta+=dTheta)
        {
            let x1 = radius*Math.cos(theta);
            let y1 = (height/2) * mod;
            let z1 = radius*Math.sin(theta);

            let x2 = radius*Math.cos(theta+dTheta);
            let y2 = (height/2) * mod;
            let z2 = radius*Math.sin(theta+dTheta);

            let x3 = radius*Math.cos(theta+dTheta);
            let y3 = (height/2 - dHeight) * mod;
            let z3 = radius*Math.sin(theta+dTheta);

            let x6 = radius*Math.cos(theta);
            let y6 = (height/2 - dHeight) * mod;
            let z6 = radius*Math.sin(theta);

            let x8 = 0;
            let y8 = (height/2) * mod;
            let z8 = 0;

            allVertices.push(x1, y1, z1);
            allVertices.push(x2, y2, z2);
            allVertices.push(x3, y3, z3);
            allVertices.push(x1, y1, z1);
            allVertices.push(x3, y3, z3);
            allVertices.push(x6, y6, z6);
            allVertices.push(x1, y1, z1);
            allVertices.push(x8, y8, z8);
            allVertices.push(x2, y2, z2);
        
        }

    }


    let vertices = [];
    for(let theta = 0; theta < 2*Math.PI; theta+=dTheta)
        {
            let x1 = radius*Math.cos(theta);
            let y1 = height/2 - dHeight;
            let z1 = radius*Math.sin(theta);

            let x2 = radius*Math.cos(theta+dTheta);
            let y2 = height/2 - dHeight;
            let z2 = radius*Math.sin(theta+dTheta);

            let x3 = radius*Math.cos(theta+dTheta);
            let y3 = height/2 - 2*dHeight;
            let z3 = radius*Math.sin(theta+dTheta);

            let x6 = radius*Math.cos(theta);
            let y6 = height/2 - 2*dHeight;
            let z6 = radius*Math.sin(theta);

            vertices.push(x1, y1, z1);
            vertices.push(x2, y2, z2);
            vertices.push(x3, y3, z3);
            vertices.push(x1, y1, z1);
            vertices.push(x3, y3, z3);
            vertices.push(x6, y6, z6);
        
            allVertices.push(x1, y1, z1);
            allVertices.push(x2, y2, z2);
            allVertices.push(x3, y3, z3);
            allVertices.push(x1, y1, z1);
            allVertices.push(x3, y3, z3);
            allVertices.push(x6, y6, z6);


        }
    for(let j=0; j<(height - 3*dHeight); j+=dHeight)
    {
    let holder = [];

    for(let i=0; i<vertices.length; i+=3)
    {
        let temp = vec3.fromValues(vertices[i], vertices[i+1], vertices[i+2]);

        vec3.transformMat4(temp, temp, down);
        holder.push(temp[0], temp[1], temp[2]);
        allVertices.push(temp[0], temp[1], temp[2]);

    }
    vertices = holder;

    }

    
    return allVertices;
}




/**
 * 
 * @param {*} radius 
 * @param {*} dTheta 
 * @param {*} dPhi 
 * @returns vertices of a sphere
 */
function sphere(radius, dTheta, dPhi)
{
    const left = mat4.create();
    mat4.rotateX(left, left, dPhi);

    allVertices = [];
    vertices = [];

    for(let theta = 0; theta < Math.PI; theta+=dTheta)
    {
    let x1 = radius*Math.cos(theta);
    let y1 = radius*Math.sin(theta);
    let z1 = (2*Math.PI*radius)/(dPhi)/510;

    let x2 = radius*Math.cos(theta);
    let y2 = radius*Math.sin(theta);
    let z2 = -(2*Math.PI*radius)/(dPhi)/510;

    let x3 = radius*Math.cos(theta+dTheta);
    let y3 = radius*Math.sin(theta+dTheta);
    let z3 = -(2*Math.PI*radius)/(dPhi)/510;

    let x6 = radius*Math.cos(theta+dTheta);
    let y6 = radius*Math.sin(theta+dTheta);
    let z6 = (2*Math.PI*radius)/(dPhi)/510;

    vertices.push(x1, y1, z1);
    vertices.push(x2, y2, z2);
    vertices.push(x3, y3, z3);
    vertices.push(x1, y1, z1);
    vertices.push(x3, y3, z3);
    vertices.push(x6, y6, z6);

    allVertices.push(x1, y1, z1);
    allVertices.push(x2, y2, z2);
    allVertices.push(x3, y3, z3);
    allVertices.push(x1, y1, z1);
    allVertices.push(x3, y3, z3);
    allVertices.push(x6, y6, z6);
    }


    for(let j=0; j<2*Math.PI; j+=dPhi)
    {
    let holder = [];

    for(let i=0; i<vertices.length; i+=3)
    {
        let temp = vec3.fromValues(vertices[i], vertices[i+1], vertices[i+2]);

        vec3.transformMat4(temp, temp, left);
        holder.push(temp[0], temp[1], temp[2]);
        allVertices.push(temp[0], temp[1], temp[2]);

    }
    vertices = holder;

    }
    return allVertices;


}

/**
 * 
 * @param {*} R 
 * @param {*} r 
 * @param {*} dTheta 
 * @param {*} dPhi 
 * @returns the correct vertices of a torus
 */
function torus(R, r, dTheta, dPhi)
{
    const left = mat4.create();
    mat4.rotateY(left, left, dTheta/1.7);
    // goal --> create vertices for single ring section of torus and total vertices,  
    // then rotate around the y axis 2pi/dTheta times
    // each time adding those new vertices to the total vertices

    allVertices = [];
    vertices = [];
    let theta = 0;

    for(let phi = 0; phi < 2*Math.PI; phi+=dPhi)
    {
    let x1 = R*Math.cos(theta) - r*Math.cos(phi); 
    let y1 = r*Math.sin(phi); 
    let z1 = R*Math.sin(theta);

    let x2 = R*Math.cos(theta+dTheta) - r*Math.cos(phi);
    let y2 = r*Math.sin(phi);
    let z2 = R*Math.sin(theta+dTheta);

    let x3 = R*Math.cos(theta) - r*Math.cos(phi+dPhi);
    let y3 = r*Math.sin(phi+dPhi);
    let z3 = R*Math.sin(theta);

    let x6 = R*Math.cos(theta+dTheta) - r*Math.cos(phi+dPhi);
    let y6 = r*Math.sin(phi+dPhi);
    let z6 = R*Math.sin(theta+dTheta);

    vertices.push(x1, y1, z1);
    vertices.push(x2, y2, z2);
    vertices.push(x3, y3, z3);
    vertices.push(x3, y3, z3);
    vertices.push(x2, y2, z2);
    vertices.push(x6, y6, z6);

    allVertices.push(x1, y1, z1);
    allVertices.push(x2, y2, z2);
    allVertices.push(x3, y3, z3);
    allVertices.push(x3, y3, z3);
    allVertices.push(x2, y2, z2);
    allVertices.push(x6, y6, z6);
    }


    for(let j=0; j<4*Math.PI; j+=dTheta)
    {
    let holder = [];

    for(let i=0; i<vertices.length; i+=3)
    {
        let temp = vec3.fromValues(vertices[i], vertices[i+1], vertices[i+2]);

        vec3.transformMat4(temp, temp, left);
        holder.push(temp[0], temp[1], temp[2]);
        allVertices.push(temp[0], temp[1], temp[2]);

    }
    vertices = holder;

    }
    return allVertices;

}


/**
 * 
 * @param {*} donutRadius 
 * @param {*} ringRadius 
 * @param {*} dTheta 
 * @param {*} dPhi 
 * @returns failed attempt at torus vertices
 */
function torusOLD(donutRadius, ringRadius, dTheta, dPhi)
{
    vertices = [];

    for(let theta = 0; theta < 2*Math.PI; theta+=dTheta)
    {
        for(let phi = 0; phi < 2*Math.PI; phi+=dPhi)
        {
            let x1 = donutRadius*Math.cos(theta) - ringRadius*Math.cos(phi); 
            let y1 = ringRadius*Math.sin(phi); 
            let z1 = donutRadius*Math.sin(theta);

            let x2 = donutRadius*Math.cos(theta+dTheta) - ringRadius*Math.cos(phi);
            let y2 = ringRadius*Math.sin(phi);
            let z2 = donutRadius*Math.sin(theta+dTheta);

            let x3 = donutRadius*Math.cos(theta) - ringRadius*Math.cos(phi+dPhi);
            let y3 = ringRadius*Math.sin(phi+dPhi);
            let z3 = donutRadius*Math.sin(theta);

            let x6 = donutRadius*Math.cos(theta+dTheta) - ringRadius*Math.cos(phi+dPhi);
            let y6 = ringRadius*Math.sin(phi+dPhi);
            let z6 = donutRadius*Math.sin(theta+dTheta);

            vertices.push(x1, y1, z1);
            vertices.push(x2, y2, z2);
            vertices.push(x3, y3, z3);
            vertices.push(x3, y3, z3);
            vertices.push(x2, y2, z2);
            vertices.push(x6, y6, z6);
        }
    }
    return vertices;
}


/**
 * This functions takes some vertexdata and transforms it from the origin to 6 versions of itself
 * that are symmetrical across every axis. This data is then returned and can be treated like
 * a single set of vertexdata
 * @param {*} vertexData 
 * @param {*} seperation 
 * @returns 
 */
function mirrorAllAxes(data, seperation)
{
let vertexData = data;
const shiftLeft = mat4.create();
mat4.translate(shiftLeft, shiftLeft, [-seperation, 0, 0]);
const shiftRight = mat4.create();
mat4.translate(shiftRight, shiftRight, [seperation, 0, 0]);
const shiftUp = mat4.create();
mat4.translate(shiftUp, shiftUp, [0, seperation, 0]);
const shiftDown = mat4.create();
mat4.translate(shiftDown, shiftDown, [0, -seperation, 0]);
const shiftForward = mat4.create();
mat4.translate(shiftForward, shiftForward, [0, 0, seperation]);
const shiftBack = mat4.create();
mat4.translate(shiftBack, shiftBack, [0, 0, -seperation]);

let holder1 = [];
let holder2 = [];
let holder3 = [];
let holder4 = [];
let holder5 = [];
let holder6 = [];

    for(let i=0; i<vertexData.length; i+=3)
    {
        let temp1 = vec3.fromValues(vertexData[i], vertexData[i+1], vertexData[i+2]);
        vec3.transformMat4(temp1, temp1, shiftLeft);
        holder1.push(temp1[0], temp1[1], temp1[2]);

        let temp2 = vec3.fromValues(vertexData[i], vertexData[i+1], vertexData[i+2]);
        vec3.transformMat4(temp2, temp2, shiftRight);
        holder2.push(temp2[0], temp2[1], temp2[2]);

        let temp3 = vec3.fromValues(vertexData[i], vertexData[i+1], vertexData[i+2]);
        vec3.transformMat4(temp3, temp3, shiftUp);
        holder3.push(temp3[0], temp3[1], temp3[2]);

        let temp4 = vec3.fromValues(vertexData[i], vertexData[i+1], vertexData[i+2]);
        vec3.transformMat4(temp4, temp4, shiftDown);
        holder4.push(temp4[0], temp4[1], temp4[2]);

        let temp5 = vec3.fromValues(vertexData[i], vertexData[i+1], vertexData[i+2]);
        vec3.transformMat4(temp5, temp5, shiftForward);
        holder5.push(temp5[0], temp5[1], temp5[2]);

        let temp6 = vec3.fromValues(vertexData[i], vertexData[i+1], vertexData[i+2]);
        vec3.transformMat4(temp6, temp6, shiftBack);
        holder6.push(temp6[0], temp6[1], temp6[2]);
    }
vertexData = holder1;
for(let i = 0; i < holder2.length; i++)
{
    vertexData.push(holder2[i]);
}
for(let i = 0; i < holder3.length; i++)
{
    vertexData.push(holder3[i]);
}
for(let i = 0; i < holder4.length; i++)
{
    vertexData.push(holder4[i]);
}
for(let i = 0; i < holder5.length; i++)
{
    vertexData.push(holder5[i]);
}
for(let i = 0; i < holder6.length; i++)
{
    vertexData.push(holder6[i]);
}

return vertexData;
}

/**
 * 
 * @param {*} vertexData 
 * @param {*} colorNum 
 * @param {*} color1 
 * @param {*} color2 
 * @returns some color data
 */
function getColorData(vertexData, colorNum, color1, color2)
{
    let colorData = [];
    for (let face = 0; face < vertexData.length/colorNum; face++) {

        let faceColor = color1; //[55/255, 180/255, 250]; //[20/255, 75/255, 20/255];
        for (let vertex = 0; vertex < colorNum/2; vertex++) {
            colorData.push(...faceColor);
        }
    
        faceColor = color2; //[12/255, 100/255, 200/255]; //[20/255, 75/255, 20/255];
        for (let vertex = 0; vertex < colorNum/2; vertex++) {
            colorData.push(...faceColor);
        }
        // faceColor = [50/255, 170/255, 25/255];
        // colorData.push(...faceColor);
    }
    return colorData;
}

/**
 * 
 * @returns a random list of three values between 0 and 1
 */
function randomColor() {
    return [Math.random(), Math.random(), Math.random()];
}