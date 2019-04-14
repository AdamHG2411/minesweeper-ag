let allRows = document.querySelector('.rows')
let numRows = 25;
let numColumns = 40;
let time = document.querySelector('#time')
let squaresCleared = 0;
let allMarkers = Math.floor(numRows * numColumns * 0.2)
let firstSquare;
let values = [];
let finalValues = [];


//create function for user to set board size

function createBoard() {
  time.innerHTML = parseInt(0,10)
  let marked = 0;
  let markedStr = document.querySelector('#marked')
  markedStr.innerHTML = `${marked} / ${allMarkers}`
  for (i = 0; i < numRows; i++) {
    let newRow = document.createElement('div')
    allRows.appendChild(newRow)
    newRow.setAttribute('class',`row row-${i + 1}`)
    for (j = 0; j < numColumns; j++) {
      let newSquare = document.createElement('div')
      newRow.appendChild(newSquare)
      newSquare.setAttribute('class',`square`)
      newSquare.setAttribute('id', `sq${(i * numColumns) + j + 1}`)
      newSquare.addEventListener('click', clear)
    }
  }
}

function placeMines() {
  let firstSquareId = parseInt(firstSquare.getAttribute('id').substr(2),10)
  console.log(firstSquareId);
  firstSquare.removeAttribute('class')
  let mineCount = allMarkers;
  while (mineCount === allMarkers) {
    let seedVal = Math.floor(Math.random() * 8)
    switch(seedVal){
      case 0:
        if ((firstSquareId >= numColumns) && (firstSquareId % numColumns !== 1)) {
          firstMine = firstSquareId - numColumns - 1;
          console.log('first mine is top left')
          mineCount -= 1;
        }
        break;
      case 1:
        if (firstSquareId >= numColumns) {
          firstMine = firstSquareId - numColumns;
          console.log('first mine is top center')
          mineCount -= 1;
        }
        break;
      case 2:
        if ((firstSquareId >= numColumns) && (firstSquareId % numColumns !== 0)) {
          firstMine = firstSquareId - numColumns + 1;
          console.log('first mine is top right')
          mineCount -= 1;
        }
        break;
      case 3:
        if (firstSquareId % numColumns !== 1) {
          firstMine = firstSquareId - 1;
          console.log('first mine is left center')
          mineCount -= 1;
        }
        break;
      case 4:
        if (firstSquareId % numColumns !== 0) {
          firstMine = firstSquareId + 1;
          console.log('first mine is right center')
          mineCount -= 1;
        }
        break;
      case 5:
        if ((firstSquareId % numColumns !== 1) && (firstSquareId <= ((numRows - 1) * numColumns))) {
          firstMine = firstSquareId + numColumns - 1;
          console.log('first mine is bottom left')
          mineCount -= 1;
        }
        break;
      case 6:
        if (firstSquareId <= ((numRows - 1) * numColumns)) {
          firstMine = firstSquareId + numColumns;
          console.log('first mine is bottom center')
          mineCount -= 1;
        }
        break;
      case 7 || 8:
        if ((firstSquareId <= ((numRows - 1) * numColumns)) && (firstSquareId % numColumns !== 0)) {
          firstMine = firstSquareId + numColumns + 1;
          console.log('first mine is bottom right')
          mineCount -= 1;
        }
        break;
      default:
        console.log('something is broken - trying again')
    }
  }
  console.log(firstMine)
  for (i = 0; i < (allMarkers - 1); i++) {
    values.push("mine")
    mineCount -= 1
  }
  for (i = 0; i < ((numColumns * numRows) - allMarkers - 1); i++) {
    values.push("tbd")
  }
  //shuffle the array
  let currentIndex = values.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = values[currentIndex];
    values[currentIndex] = values[randomIndex];
    values[randomIndex] = temporaryValue;
  }
  finalValues.push(values.slice(0,(Math.min(firstSquareId,firstMine) - 1)))
  if (firstSquareId < firstMine) {
    finalValues.push(['tbd'])
} else {
    finalValues.push(['mine'])
}
  finalValues.push(values.slice((Math.min(firstSquareId, firstMine) - 1), (Math.max(firstSquareId,firstMine) - 1)))
  if (firstSquareId > firstMine) {
    finalValues.push(['tbd'])
  } else {
    finalValues.push(['mine'])
  }
  finalValues.push(values.slice(Math.max(firstSquareId,firstMine) - 1))
  values = finalValues[0].concat(finalValues[1],finalValues[2],finalValues[3],finalValues[4])
  console.log(values.length)
  console.log(values)
  setInterval(function() { time.innerHTML = parseInt(time.innerHTML, 10) + 1 }, 1000)
}

function clear(evt) {
  evt.preventDefault();
  if (squaresCleared < 1) {
    firstSquare = evt.target
    placeMines()
    squaresCleared += 1;
  } else {
    squaresCleared += 1;
    evt.target.removeAttribute('class')
    evt.target.removeEventListener('click', clear)
  }
}
createBoard();