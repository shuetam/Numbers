export function getBoardMatrix(w, h) {

    var matrix = new Array(h);

    for (var i = 0; i < h; i++) {
        matrix[i] = new Array(w);
    }

    do {
        fillMatrix(matrix);
    }
    while (!checkMatrix(matrix))


    return prepareMatrixObject(matrix, w, h);
}


function prepareMatrixObject(matrix, w, h) {

    var matrixObject = new Array(h);

    for (var i = 0; i < h; i++) {
        matrixObject[i] = new Array(w);
    }

    let id = 1;
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            matrixObject[i][j] = { value:  matrix[i][j], i: i, j: j, id: id }
            id++;
        }
    }

    return matrixObject;
}



function fillMatrix(matrix) {

    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            matrix[i][j] =  Math.floor(Math.random() * 9) + 1;
        }
    }
    matrix[0][0] = 0;

}


function checkMatrix(matrix) {
    var sum = 0;
    var mArray = new Array(matrix.length * matrix[0].length);
    var v = 0;
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            sum += matrix[i][j];
            mArray[v] = matrix[i][j];
            ++v;
        }
    }

    if (sum % 2 === 0) {
        return checkMatrixSum(mArray, sum / 2);
    }
    return false;

}


function checkMatrixSum(mArray, half) { //this should be revision

    if (mArray.some(x => x == half)) {
        return true;
    }

    for (var i = 1; i < mArray.length; i++) {
        half = half - mArray[i];
        if (mArray.some(x => x == half)) {
            return true;
        }
    }
    return false
}
