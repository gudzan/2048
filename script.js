class Cell {
  constructor(number, locationX, locationY) {
    this.number = number ?? "Undefined number";
    this.locationX = locationX.toString();
    this.locationY = locationY.toString();
  }
  setNumber(number) {
    this.number = number;
  }
  getLocation() {
    return this.locationX.toString() + this.locationY.toString();
  }
}
let cells = [];
start();

function start() {
  createTable();
  let cell1 = cells[getRandomStartNumber()].setNumber(getRandomNumber());
  let cell2 = cells[getRandomStartNumber()].setNumber(getRandomNumber());
  console.log(cells);
  addNumberToCells()
}

function getRandomStartNumber() {
  // случайное число от min до (max+1)
  let rand = Math.random() * 16;
  return Math.floor(rand);
}

function addNumberToCells(){
  cells.forEach(cell => {
    if(cell.number!==0){
      let cellElement = document.getElementById(cell.getLocation());
      cellElement.classList.add("cell_number_" + cell.number);
      cellElement.classList.add("cell_number");
    }
  });
}

function getRandomNumber() {
  return Math.round(Math.random()) === 0 ? 2 : 4;
}

function getRandomLocation() {
  return Math.floor(Math.random() * 4);
}

function createTable() {
  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 4; y++) {
      const cell = new Cell(0, x, y);
      cells.push(cell);
    }
  }
}

function toHTML(cell) {
  return `
    <td id = "${cell.getLocation()}"></td>">${user.name}</li>
  `;
}
