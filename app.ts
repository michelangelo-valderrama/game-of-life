import * as cowsay from "cowsay";

type LiveCell = "[o]";
type DeadCell = "[ ]";
type Cell = LiveCell | DeadCell;
enum CellState {
    live = "[o]",
    dead = "[ ]",
}
type CellPos = {
    row: number;
    col: number;
};
let board: Cell[][] = [];

async function main() {
    const config = getConfig();
    await printStartGame();
    setupGame(config.rows, config.cols, config.initCells);
    runGame(config.rows, config.cols, config.initCells);
}

function getConfig() {
    const rows = Number(prompt("Number of rows      : "));
    const cols = Number(prompt("Number of cols      : "));
    const initCells = Number(prompt("Initial live cells  : "));
    return validateInputs(rows, cols, initCells);
}

function validateInputs(rows: number, cols: number, initCells: number) {
    if (Number.isNaN(rows) || Number.isNaN(cols) || Number.isNaN(initCells)) {
        throw new Error("Invalid Inputs").message;
    } else {
        return {
            rows,
            cols,
            initCells,
        };
    }
}

async function printStartGame() {
    const message = cowsay.say({
        text: "Game Start!",
        e: "oO",
        T: "U ",
    });
    console.log(message);
    await delay(1000)
}

function delay(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
}

function setupGame(rows: number, cols: number, initCells: number) {
    createBoard(rows, cols);
    createLifeCells(rows, cols, initCells);
}

function createBoard(rows: number, cols: number) {
    for (let i = 0; i < rows; i++) {
        const row: Cell[] = [];
        for (let j = 0; j < cols; j++) {
            row.push(CellState.dead);
        }
        board.push(row);
    }
}

function createLifeCells(rows: number, cols: number, initCells: number) {
    const totalCells = rows * cols;
    const lifeCellsPos: CellPos[] = [];
    let numCells: number = initCells;
    while (numCells > 0 && totalCells > 0) {
        const randomRow = Math.floor(Math.random() * rows);
        const randomCol = Math.floor(Math.random() * cols);

        if (board[randomRow][randomCol] === CellState.dead) {
            board[randomRow][randomCol] = CellState.live;
            lifeCellsPos.push({
                row: randomRow,
                col: randomCol,
            });
            numCells--;
        }
    }
}

function runGame(rows: number, cols: number, liveCells: number) {
    printGame(rows, cols, liveCells);
    const myInterval = setInterval(() => {
        liveCells = toggleCells(nextGeneration(rows, cols), liveCells);
        printGame(rows, cols, liveCells);
        if (liveCells <= 0) clearInterval(myInterval);
    }, 1000);
}

function printGame(rows: number, cols: number, liveCells: number) {
    printBoard(rows, cols);
    printLifeCells(liveCells);
}

function printBoard(rows: number, cols: number) {
    console.clear();
    let buff = "+" + "----".repeat(cols - 1) + "---+";
    console.log(buff);
    for (let i = 0; i < rows; i++) {
        let row = "";
        for (let j = 0; j < cols; j++) {
            row = `${row} ${board[i][j]}`;
        }
        console.log(row);
    }
    console.log(buff);
}

function printLifeCells(liveCells: number) {
    console.log("Live cells:", liveCells);
}

function nextGeneration(rows: number, cols: number) {
    // foreach map reduce
    const cellsToToggle: CellPos[] = [];
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            let liveCells = 0;
            for (let m = -1; m < 2; m++) {
                for (let n = -1; n < 2; n++) {
                    if (
                        i + m < 0 ||
                        i + m >= rows ||
                        j + n < 0 ||
                        j + n >= cols ||
                        (m == 0 && n == 0)
                    )
                        continue;
                    if (board[i + m][j + n] === CellState.live) liveCells++;
                }
            }
            if (
                (board[i][j] === CellState.live &&
                    (liveCells <= 1 || liveCells > 3)) ||
                (board[i][j] === CellState.dead && liveCells === 3)
            ) {
                cellsToToggle.push({ row: i, col: j });
            }
        }
    }
    return cellsToToggle;
}

function toggleCells(cells: CellPos[], liveCellsNum: number) {
    cells.map((cell) => {
        if (board[cell.row][cell.col] === CellState.live) {
            board[cell.row][cell.col] = CellState.dead;
            liveCellsNum--;
        } else {
            board[cell.row][cell.col] = CellState.live;
            liveCellsNum++;
        }
    });
    return liveCellsNum;
}

main();
