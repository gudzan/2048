class Cell {
  constructor(number, locationX, locationY) {
    this.number = number ?? "Undefined number";
    this.locationX = locationX.toString();
    this.locationY = locationY.toString();
  }
  getNumber() {
    return this.number;
  }
  setNumber(number) {
    this.number = number;
  }
  getLocation() {
    return this.locationX.toString() + this.locationY.toString();
  }
}

let cells = [];

window.addEventListener("load", () => {
  createStartCells();
  addNumberToCells();
  console.log(cells);
});

document.addEventListener("keydown", (event) => {
  const key = event.key;
  switch (key) {
    case "ArrowUp":
      moveToUp();
      break;
    case "ArrowDown":
      moveToDown();
      break;
    case "ArrowLeft":
      console.log('Нажата клавиша "Влево"!');
      break;
    case "ArrowRight":
      console.log('Нажата клавиша "Вправо"!');
      break;
  }
});

function moveToDown() {
  if (canMove()) {
    for (let y = 0; y < 4; y++) {
      columnMoveDown(y);
    }
  }
  console.log(cells);
  addNumberToCells();
}

function moveToUp() {
  if (canMove()) {
    for (let y = 0; y < 4; y++) {
      columnMoveUp(y);
    }
  }
  console.log(cells);
  addNumberToCells();
}

function canMove() {
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      if (cells[x][y].getNumber() === 0) {
        console.log(true);
        return true;
      }
    }
  }
  return false;
}

function addNumberToCells() {
  cells.forEach((row) => {
    row.forEach((cell) => {
      let cellElement = document.getElementById(cell.getLocation());
      cellElement.removeAttribute("class");
      if (cell.number === 0) {
        cellElement.innerHTML = ``;
      } else {
        cellElement.classList.add("cell_number");
        cellElement.classList.add("cell_number_" + cell.number);
        cellElement.innerHTML = `${cell.number}`;
      }
    });
  });
}

function columnMoveUp(y) {
  let numbers = getColumnWithoutZero(y)
  for (let x = 0; x < 4; x++) {
    if (x < numbers.length) {
      cells[x][y].setNumber(numbers[x]);
    }
    else {
      cells[x][y].setNumber(0);
    }
  }
}

function getColumnWithoutZero(y){
  let numbers = [];
  for (let x = 0; x < 4; x++) {
    if (cells[x][y].number !== 0) {
      numbers.push(cells[x][y].number);
    }
  }
  return numbers
}

function columnMoveDown(y) {
  let numbers = getColumnWithoutZero(y).toReversed()
  for (let x = 3, i=0; x >= 0; x--,i++) {
    if (i < numbers.length) {
      cells[x][y].setNumber(numbers[i]);
    }
    else {
      cells[x][y].setNumber(0);
    }
  }
}

function createStartCells() {
  for (let x = 0; x < 4; x++) {
    let rowCell = [];
    for (let y = 0; y < 4; y++) {
      const cell = new Cell(getRandomStartLocation(), x, y);
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
