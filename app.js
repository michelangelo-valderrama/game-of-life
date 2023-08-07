#!/home/tokyo/.nvm/versions/node/v20.3.1/bin/node

var CellState;
(function (CellState) {
    CellState["live"] = "[o]";
    CellState["dead"] = "[ ]";
})(CellState || (CellState = {}));
var board = [];
function main() {
    var rows = 20;
    var cols = 20;
    var initCells = 80;
    setupGame(rows, cols, initCells);
    runGame(rows, cols, initCells);
}
function setupGame(rows, cols, initCells) {
    createBoard(rows, cols);
    createLifeCells(rows, cols, initCells);
}
function runGame(rows, cols, liveCells) {
    printBoard(rows, cols);
    console.log(liveCells);
    var myInterval = setInterval(function () {
        liveCells = toggleCells(nextGeneration(rows, cols), liveCells);
        printBoard(rows, cols);
        console.log(liveCells);
        if (liveCells <= 0)
            clearInterval(myInterval);
    }, 1000);
}
function createBoard(rows, cols) {
    for (var i = 0; i < rows; i++) {
        var row = [];
        for (var j = 0; j < cols; j++) {
            row.push(CellState.dead);
        }
        board.push(row);
    }
}
function createLifeCells(rows, cols, initCells) {
    var totalCells = rows * cols;
    var lifeCellsPos = [];
    while (initCells > 0 && totalCells > 0) {
        var randomRow = Math.floor(Math.random() * rows);
        var randomCol = Math.floor(Math.random() * cols);
        if (board[randomRow][randomCol] === CellState.dead) {
            board[randomRow][randomCol] = CellState.live;
            lifeCellsPos.push({
                row: randomRow,
                col: randomCol,
            });
            initCells--;
        }
    }
}
function printBoard(rows, cols) {
    console.clear();
    var buff = '';
    for (var t = 2; t <= cols; t++) {
        buff = "".concat(buff, "----");
    }
    console.log("+".concat(buff, "---+"));
    for (var i = 0; i < rows; i++) {
        var row = '';
        for (var j = 0; j < cols; j++) {
            row = "".concat(row, " ").concat(board[i][j]);
        }
        console.log(row);
    }
    console.log("+".concat(buff, "---+"));
}
function nextGeneration(rows, cols) {
    var cellsToToggle = [];
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            var liveCells = 0;
            for (var m = -1; m < 2; m++) {
                for (var n = -1; n < 2; n++) {
                    if ((i + m) < 0 || (i + m) >= rows ||
                        (j + n) < 0 || (j + n) >= cols ||
                        (m == 0 && n == 0))
                        continue;
                    if (board[i + m][j + n] === CellState.live)
                        liveCells++;
                }
            }
            // console.log(board[i][j], liveCells);
            if ((board[i][j] === CellState.live && (liveCells <= 1 || liveCells > 3)) ||
                (board[i][j] === CellState.dead && liveCells === 3)) {
                cellsToToggle.push({ row: i, col: j });
                // console.log("^ toggle!");
            }
        }
    }
    return cellsToToggle;
}
function toggleCells(cells, liveCellsNum) {
    for (var _i = 0, cells_1 = cells; _i < cells_1.length; _i++) {
        var cell = cells_1[_i];
        if (board[cell.row][cell.col] === CellState.live) {
            board[cell.row][cell.col] = CellState.dead;
            liveCellsNum--;
        }
        else {
            board[cell.row][cell.col] = CellState.live;
            liveCellsNum++;
        }
    }
    return liveCellsNum;
}
main();
