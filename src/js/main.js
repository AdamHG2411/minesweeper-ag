let allRows = document.querySelector('.rows')
let numRows = 25;
let numColumns = 40;

//create function for user to set board size

function createBoard() {
  for (i = 0; i < numRows; i++) {
    let newRow = document.createElement('div')
    allRows.appendChild(newRow)
    newRow.setAttribute('class',`row row-${i}`)
    for (j = 0; j < numColumns; j++) {
      let newSquare = document.createElement('div')
      newRow.appendChild(newSquare)
      newSquare.setAttribute('class',`square square-r${i}-c${j} square-${(i-1) * numColumns + j}`)
    }
  }
}

function firstSelection() {
  
}
createBoard();