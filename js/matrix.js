'use strict'

// TODO implement these and other potentially missing matrix functions here
// The below functions are just two examples you'll definitely need to implement
// A complete example function is given above

/**
 * Gives the perspective camera projection matrix
 * @returns { Array.<Number> } The perspective camera projection matrix as a list
 */
function perspectiveProjectionMatrix( fovy, aspect, near, far )
{
    const f = 1.0 / Math.tan(fovy / 2);
    const nf = 1 / (near - far);

    return [
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far + near) * nf, -1,
        0, 0, 2 * far * near * nf, 0
    ]

}

/**
 * Gives the orthographic camera projection matrix
 * @returns { Array.<Number> } The orthographic camera projection matrix as a list
 */
function orthographicProjectionMatrix( left, right, bottom, top, near, far )
{

    const lr = 1 / (left - right);
    const bt = 1 / (bottom - top);
    const nf = 1 / (near - far);

    return [ 
        -2 * lr, 0, 0, 0,
        0, -2 * bt, 0, 0,
        0, 0, 2 * nf, 0,
        (left + right) * lr, (top + bottom) * bt, (far + near) * nf, 1
    ]

}

export
{
    perspectiveProjectionMatrix,
    orthographicProjectionMatrix
}
