class Cell {
    number;
    locationX;
    locationY;
    cellElement;
    constructor(number, locationX, locationY) {
        this.number = number
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
    setNumberAndStyle(number) {
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
let score = 0;
let pastScore = 0;
let bestScore = 0;

const overlay = document.querySelector(".overlay");
const endBoxClose = document.querySelector(".endBox__close");
const endBoxBlock = document.querySelector(".endBox");
const newGameButton = document.querySelector(".endBox__new-game-button");
const currentScoreBox = document.querySelector(".current-score-numbers");
const bestScoreBox = document.querySelector(".best-score-numbers");
const endCurrentScoreBox = document.querySelector(
    ".endBox__current-score-numbers"
);
const endBestScoreBox = document.querySelector(".endBox__best-score-numbers");
const goBackButton = document.querySelector(".goBack__button");

endBoxClose.addEventListener("click", closeEndBox);
newGameButton.addEventListener("click", newGame);
goBackButton.addEventListener("click", goBack);

window.addEventListener("load", () => {
    newGame();
});

function newGame() {
    closeEndBox();
    cells = [];
    pastСells = [];
    score = 0;
    currentScoreBox.innerHTML = score;
    bestScore = localStorage.getItem("bestScore")
        ? localStorage.getItem("bestScore")
        : 0;
    bestScoreBox.innerHTML = bestScore;
    currentScoreBox.classList.remove("best-color");
    bestScoreBox.classList.remove("best-color");
    colorBest();
    const allCellsElement = document.querySelectorAll(".cell_number");
    allCellsElement.forEach((e) => e.remove());
    createStartCells();
    addNumberToCells();
    //printCells(cells);
}

function endTheGame() {
    endBoxBlock.classList.add("endBox--open");
    overlay.classList.add("overlay--open");
    endCurrentScoreBox.innerHTML = score;
    endBestScoreBox.innerHTML = bestScore;
}

function goBack() {
    if (pastСells.length === 0) return;

    for (let x = 0; x < 4; x++) {
        for (let y = 0; y < 4; y++) {
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
    if (score >= bestScore && score > 0) {
        currentScoreBox.classList.add("best-color");
    }
    if (bestScore > 0) {
        bestScoreBox.classList.add("best-color");
    }
}

function closeEndBox() {
    endBoxBlock.classList.remove("endBox--open");
    overlay.classList.remove("overlay--open");
}

function copyCells(cells) {
    let array = [];
    for (let x = 0; x < 4; x++) {
        let rowCell = [];
        for (let y = 0; y < 4; y++) {
            rowCell.push(cells[x][y].getNumber());
        }
        array.push(rowCell);
    }
    return array;
}

document.addEventListener("keydown", (event) => {
    const key = event.key;
    if (canMove()) {
        pastСells = copyCells(cells);
        switch (key) {
            case "ArrowUp":
                //console.log("moveToUp");
                countToUp();
                moveToUp();
                newRandomCell();
                break;
            case "ArrowDown":
                //console.log("moveToDown");
                countToDown();
                moveToDown();
                newRandomCell();
                break;
            case "ArrowLeft":
                //console.log("moveToLeft");
                countToLeft();
                moveToLeft();
                newRandomCell();
                break;
            case "ArrowRight":
                //console.log("moveToRight");
                countToRight();
                moveToRight();
                newRandomCell();
                break;
        }
        if (!canMove()) endTheGame();
    } else {
        endTheGame();
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
    for (let y = 0; y < 4; y++) {
        columnMoveDown(y);
    }
}

function moveToUp() {
    for (let y = 0; y < 4; y++) {
        columnMoveUp(y);
    }
}

function moveToLeft() {
    for (let x = 0; x < 4; x++) {
        rowMoveLeft(x);
    }
}

function moveToRight() {
    for (let x = 0; x < 4; x++) {
        rowMoveRight(x);
    }
}

function existEmpty() {
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
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
    for (let y = 0; y < 4; y++) {
        for (let x = 0; x < 4; x++) {
            if (cells[x][y].getNumber() === 0) {
                emptyLocations.push(cells[x][y].getLocation());
            }
        }
    }
    //debugger
    if (emptyLocations.length !== 0) {
        const newLocation =
            emptyLocations[randomInteger(emptyLocations.length)];
        //console.log(newLocation);
        const newCell = new Cell(
            getRandomStartNumber(),
            newLocation[0],
            newLocation[1]
        );
        cells[newCell.locationX][newCell.locationY].setNumber(newCell.number);
        createCell(cells[newCell.locationX][newCell.locationY]);
        //printCells(cells);
        //console.log(cells[newCell.locationX][newCell.locationY]);
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
    pastScore = score;
    score += currentCell.number + nextCell.number;
    currentScoreBox.innerHTML = score;
    if (score >= bestScore) {
        bestScore = score;
        localStorage.setItem("bestScore", bestScore);
        bestScoreBox.innerHTML = bestScore;
        colorBest();
    }
    if(currentCell.number + nextCell.number === 8){
        console.log("You win!");
    }
    currentCell.changeNumberAndStyle(currentCell.number + nextCell.number);
    nextCell.deleteNumber();
}

function columnMoveUp(y) {
    let numbers = getColumnWithoutZero(y);
    if (numbers.length === 4) {
        return;
    }
    for (let x = 0; x < 4; x++) {
        if (x < numbers.length) {
            moveCell(numbers[x], cells[x][y]);
        } else {
            cells[x][y].setNumber(0);
        }
    }
}

function columnMoveDown(y) {
    let numbers = getColumnWithoutZero(y).toReversed();
    if (numbers.length === 4) {
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

function rowMoveLeft(x) {
    let numbers = getRowWithoutZero(x);
    if (numbers.length === 4) {
        return;
    }
    for (let y = 0; y < 4; y++) {
        if (y < numbers.length) {
            moveCell(numbers[y], cells[x][y]);
        } else {
            cells[x][y].setNumber(0);
        }
    }
}

function rowMoveRight(x) {
    let numbers = getRowWithoutZero(x).toReversed();
    if (numbers.length === 4) {
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
    for (let y = 0; y < 4; y++) {
        if (cells[x][y].number !== 0) {
            numbers.push(cells[x][y]);
        }
    }
    return numbers;
}

function getColumnWithoutZero(y) {
    let numbers = [];
    for (let x = 0; x < 4; x++) {
        if (cells[x][y].number !== 0) {
            numbers.push(cells[x][y]);
        }
    }
    return numbers;
}

function createStartCells() {
    for (let x = 0; x < 4; x++) {
        let rowCell = [];
        for (let y = 0; y < 4; y++) {
            const cell = new Cell(0, x, y);
            rowCell.push(cell);
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
