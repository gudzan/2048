class Cell {
    number;
    locationX;
    locationY;
    cellElement;
    constructor(number, locationX, locationY) {
        this.number = number;
        this.locationX = locationX.toString();
        this.locationY = locationY.toString();
    }
    setCell(cellElement) {
        this.cellElement = cellElement;
    }
    getNumber() {
        return this.number;
    }
    changeNumberAndStyle(number) {
        this.cellElement.classList.remove(`cell_number_${this.number}`);
        this.cellElement.classList.add(`cell_number_${number}`);
        this.number = number;
        this.cellElement.innerHTML = number;
    }
    deleteNumber() {
        this.number = 0;
        document.getElementById(this.getLocation()).remove();
        this.cellElement = undefined;
    }
    setNumber(number) {
        this.number = number;
    }
    changeCellElement() {
        this.cellElement.style.setProperty("--x", this.locationX);
        this.cellElement.style.setProperty("--y", this.locationY);
        this.cellElement.id = this.getLocation();
    }
    changeCell(cell) {
        this.number = cell.number;
        this.locationX = cell.locationX;
        this.locationY = cell.locationY;
    }
    getLocation() {
        return this.locationX.toString() + this.locationY.toString();
    }
    remoteCellElement() {
        this.cellElement = undefined;
    }
}

let cells = [];
let pastСells = [];
let win = false;
let score = 0;
let pastScore = 0;
let bestScore = 0;
let squareSide = 4;

const overlay = document.querySelector(".overlay");
const endBoxBlock = document.querySelector(".endBox");
const winBoxBlock = document.querySelector(".winBox");
const currentScoreBox = document.querySelector(".current-score-numbers");
const bestScoreBox = document.querySelector(".best-score-numbers");
const modalCurrentScoreBox = document.querySelectorAll(
    ".modalBox__current-score-numbers"
);
const modalBestScoreBox = document.querySelectorAll(
    ".modalBox__best-score-numbers"
);
const goBackButton = document.querySelector(".goBack__button");
const modalBoxClose = document.querySelectorAll(".modalBox__close");
const newGameButton = document.querySelectorAll(".modalBox__new-game-button");
const continueGameButton = document.querySelector(
    ".modalBox__continue-game-button"
);

goBackButton.addEventListener("click", goBack);
continueGameButton.addEventListener("click", closeModalBox);
modalBoxClose.forEach((item) => {
    item.addEventListener("click", closeModalBox);
});
newGameButton.forEach((item) => {
    item.addEventListener("click", newGame);
});
window.addEventListener("load", () => {
    newGame();
});

function newGame() {
    closeModalBox();
    cells = [];
    pastСells = [];
    score = 0;
    currentScoreBox.innerHTML = score;
    bestScore = localStorage.getItem("bestScore")
        ? localStorage.getItem("bestScore")
        : 0;
    bestScoreBox.innerHTML = bestScore;
    colorBest();
    const allCellsElement = document.querySelectorAll(".cell_number");
    allCellsElement.forEach((e) => e.remove());
    createStartCells();
    addNumberToCells();
    win = false;
}

function theEnd() {
    endBoxBlock.classList.add("endBox--open");
    overlay.classList.add("overlay--open");
    fillScore();
}

function fillScore() {
    modalCurrentScoreBox.forEach((item) => {
        item.innerHTML = score;
    });
    modalBestScoreBox.forEach((item) => {
        item.innerHTML = bestScore;
    });
}

function victory() {
    if (win !== true) {
        winBoxBlock.classList.add("winBox--open");
        overlay.classList.add("overlay--open");
        fillScore();
        win = true;
    }
}

function goBack() {
    if (pastСells.length === 0) return;

    for (let x = 0; x < squareSide; x++) {
        for (let y = 0; y < squareSide; y++) {
            if (pastСells[x][y] !== cells[x][y].getNumber()) {
                if (pastСells[x][y] === 0) {
                    cells[x][y].deleteNumber();
                } else {
                    if (cells[x][y].cellElement) {
                        cells[x][y].changeNumberAndStyle(pastСells[x][y]);
                    } else {
                        cells[x][y].setNumber(pastСells[x][y]);
                        createCell(cells[x][y]);
                    }
                }
            }
        }
    }
    score = pastScore;
    currentScoreBox.innerHTML = score;
}

function colorBest() {
    currentScoreBox.classList.remove("best-color");
    bestScoreBox.classList.remove("best-color");
    if (score >= bestScore && score > 0) {
        currentScoreBox.classList.add("best-color");
    }
    if (bestScore > 0) {
        bestScoreBox.classList.add("best-color");
    }
}

function closeModalBox() {
    endBoxBlock.classList.remove("endBox--open");
    winBoxBlock.classList.remove("winBox--open");
    overlay.classList.remove("overlay--open");
}

function copyCells(cells) {
    let array = [];
    for (let x = 0; x < squareSide; x++) {
        let rowCell = [];
        for (let y = 0; y < squareSide; y++) {
            rowCell.push(cells[x][y].getNumber());
        }
        array.push(rowCell);
    }
    return array;
}

// window.addEventListener("keydown", (event) => {
//     const key = event.key;
//     if (canMove()) {
//         pastСells = copyCells(cells);
//         switch (key) {
//             case "ArrowUp":
//                 countToUp();
//                 moveToUp();
//                 newRandomCell();
//                 break;
//             case "ArrowDown":
//                 countToDown();
//                 moveToDown();
//                 newRandomCell();
//                 break;
//             case "ArrowLeft":
//                 countToLeft();
//                 moveToLeft();
//                 newRandomCell();
//                 break;
//             case "ArrowRight":
//                 countToRight();
//                 moveToRight();
//                 newRandomCell();
//                 break;
//         }
//     } else {
//         theEnd();
//     }
// });

window.addEventListener('swiped', function(e) {
    console.log(e.detail.dir); // swiped direction
    const key = e.detail.dir;
    if (canMove()) {
        pastСells = copyCells(cells);
        switch (key) {
            case "up":
                countToUp();
                moveToUp();
                newRandomCell();
                break;
            case "down":
                countToDown();
                moveToDown();
                newRandomCell();
                break;
            case "left":
                countToLeft();
                moveToLeft();
                newRandomCell();
                break;
            case "right":
                countToRight();
                moveToRight();
                newRandomCell();
                break;
        }
    } else {
        theEnd();
    }
});


function printCells(cells) {
    let string = "";
    for (let x = 0; x < cells.length; x++) {
        for (let y = 0; y < cells.length; y++) {
            string +=
                cells[x][y].number !== 0 ? cells[x][y].number + " " : "0" + " ";
        }
        string += `\n`;
    }
    console.log(string);
}

function countToLeft() {
    for (let x = 0; x < cells.length; x++) {
        for (let y = 0; y < cells.length - 1; y++) {
            for (let i = y + 1; i < cells.length; i++) {
                if (cells[x][y].number !== 0 && cells[x][i].number !== 0) {
                    if (cells[x][y].number === cells[x][i].number) {
                        countCell(cells[x][y], cells[x][i]);
                        y++;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
}

function countToRight() {
    for (let x = cells.length - 1; x >= 0; x--) {
        for (let y = cells.length - 1; y >= 0; y--) {
            for (let i = y - 1; i >= 0; i--) {
                if (cells[x][y].number !== 0 && cells[x][i].number !== 0) {
                    if (cells[x][y].number === cells[x][i].number) {
                        countCell(cells[x][y], cells[x][i]);
                        y--;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
}

function countToUp() {
    for (let y = 0; y < cells.length; y++) {
        for (let x = 0; x < cells.length - 1; x++) {
            for (let i = x + 1; i < cells.length; i++) {
                if (cells[x][y].number !== 0 && cells[i][y].number !== 0) {
                    if (cells[x][y].number === cells[i][y].number) {
                        countCell(cells[x][y], cells[i][y]);
                        x++;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
}

function countToDown() {
    for (let y = cells.length - 1; y >= 0; y--) {
        for (let x = cells.length - 1; x >= 0; x--) {
            for (let i = x - 1; i >= 0; i--) {
                if (cells[x][y].number !== 0 && cells[i][y].number !== 0) {
                    if (cells[x][y].number === cells[i][y].number) {
                        countCell(cells[x][y], cells[i][y]);
                        x--;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
}

function moveToDown() {
    for (let y = 0; y < squareSide; y++) {
        columnMoveDown(y);
    }
}

function moveToUp() {
    for (let y = 0; y < squareSide; y++) {
        columnMoveUp(y);
    }
}

function moveToLeft() {
    for (let x = 0; x < squareSide; x++) {
        let numbers = getRowWithoutZero(x);
        if (numbers.length === squareSide) {
            return;
        }
        for (let y = 0; y < squareSide; y++) {
            if (y < numbers.length) {
                moveCell(numbers[y], cells[x][y]);
            } else {
                cells[x][y].setNumber(0);
            }
        }
    }
}

function moveToRight() {
    for (let x = 0; x < squareSide; x++) {
        rowMoveRight(x);
    }
}

function existEmpty() {
    for (let y = 0; y < squareSide; y++) {
        for (let x = 0; x < squareSide; x++) {
            if (cells[x][y].getNumber() === 0) {
                return true;
            }
        }
    }
    return false;
}

function canMove() {
    const hasZero = existEmpty();
    if (!hasZero) {
        const newCells = [];
        for (let x = 0; x < 6; x++) {
            let rowCell = [];
            for (let y = 0; y < 6; y++) {
                let cell = -1;
                if (y !== 0 && x !== 0 && y !== 5 && x !== 5) {
                    cell = cells[x - 1][y - 1].getNumber();
                }
                rowCell.push(cell);
            }
            newCells.push(rowCell);
        }

        for (let y = 1; y < 5; y++) {
            for (let x = 1; x < 5; x++) {
                let cellNumber = newCells[x][y];
                if (
                    cellNumber === newCells[x - 1][y] ||
                    cellNumber === newCells[x + 1][y] ||
                    cellNumber === newCells[x][y - 1] ||
                    cellNumber === newCells[x][y + 1]
                ) {
                    return true;
                }
            }
        }
        return false;
    } else {
        return true;
    }
}

function newRandomCell() {
    let emptyLocations = [];
    for (let y = 0; y < squareSide; y++) {
        for (let x = 0; x < squareSide; x++) {
            if (cells[x][y].getNumber() === 0) {
                emptyLocations.push(cells[x][y].getLocation());
            }
        }
    }
    if (emptyLocations.length !== 0) {
        const newLocation =
            emptyLocations[randomInteger(emptyLocations.length)];
        const newCell = new Cell(
            getRandomStartNumber(),
            newLocation[0],
            newLocation[1]
        );
        cells[newCell.locationX][newCell.locationY].setNumber(newCell.number);
        createCell(cells[newCell.locationX][newCell.locationY]);
    }
}

function randomInteger(max) {
    return Math.floor(Math.random() * max);
}

function addNumberToCells() {
    cells.forEach((row) => {
        row.forEach((cell) => {
            createCell(cell);
        });
    });
}

function createCell(cell) {
    if (cell.number !== 0) {
        table.insertAdjacentHTML(
            "beforeend",
            `<div id="${cell.getLocation()}" class="cell_number cell_number_${
                cell.number
            }" style="--x: ${cell.locationX}; --y: ${cell.locationY};">${
                cell.number
            }</div>`
        );
        cell.setCell(document.getElementById(cell.getLocation()));
    }
}

function moveCell(cellFrom, cellTo) {
    if (cellFrom.getLocation() !== cellTo.getLocation()) {
        cellTo.setNumber(cellFrom.number);
        cellTo.cellElement = cellFrom.cellElement;
        cellFrom.remoteCellElement();
        cellTo.changeCellElement();
    }
}

function countCell(currentCell, nextCell) {
    let sum = currentCell.number + nextCell.number;
    pastScore = score;
    score += sum;
    currentScoreBox.innerHTML = score;
    if (score >= bestScore) {
        bestScore = score;
        localStorage.setItem("bestScore", bestScore);
        bestScoreBox.innerHTML = bestScore;
        colorBest();
    }
    if (sum === 2048) {
        victory();
    }
    currentCell.changeNumberAndStyle(sum);
    nextCell.deleteNumber();
}

function columnMoveUp(y) {
    let numbers = getColumnWithoutZero(y);
    if (numbers.length === squareSide) {
        return;
    }
    for (let x = 0; x < squareSide; x++) {
        if (x < numbers.length) {
            moveCell(numbers[x], cells[x][y]);
        } else {
            cells[x][y].setNumber(0);
        }
    }
}

function columnMoveDown(y) {
    let numbers = getColumnWithoutZero(y).toReversed();
    if (numbers.length === squareSide) {
        return;
    }
    for (let x = 3, i = 0; x >= 0; x--, i++) {
        if (i < numbers.length) {
            moveCell(numbers[i], cells[x][y]);
        } else {
            cells[x][y].setNumber(0);
        }
    }
}

function rowMoveRight(x) {
    let numbers = getRowWithoutZero(x).toReversed();
    if (numbers.length === squareSide) {
        return;
    }
    for (let y = 3, i = 0; y >= 0; y--, i++) {
        if (i < numbers.length) {
            moveCell(numbers[i], cells[x][y]);
        } else {
            cells[x][y].setNumber(0);
        }
    }
}

function getRowWithoutZero(x) {
    let numbers = [];
    for (let y = 0; y < squareSide; y++) {
        if (cells[x][y].number !== 0) {
            numbers.push(cells[x][y]);
        }
    }
    return numbers;
}

function getColumnWithoutZero(y) {
    let numbers = [];
    for (let x = 0; x < squareSide; x++) {
        if (cells[x][y].number !== 0) {
            numbers.push(cells[x][y]);
        }
    }
    return numbers;
}

function createStartCells() {
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }
    for (let x = 0; x < squareSide; x++) {
        let rowCell = [];
        for (let y = 0; y < squareSide; y++) {
            const cell = new Cell(0, x, y);
            rowCell.push(cell);
            let startCell = document.createElement("div");
            startCell.className = "cell";
            startCell.innerHTML = "";
            table.append(startCell);
        }
        cells.push(rowCell);
    }
    cells[getRandomStartLocation()][getRandomStartLocation()].setNumber(
        getRandomStartNumber()
    );
    cells[getRandomStartLocation()][getRandomStartLocation()].setNumber(
        getRandomStartNumber()
    );
}

function getRandomStartLocation() {
    return Math.floor(Math.random() * 4);
}

function getRandomStartNumber() {
    return Math.round(Math.random()) === 0 ? 2 : 4;
}
