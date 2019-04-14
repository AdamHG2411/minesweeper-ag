//Global Variables
let allRows = document.querySelector('.rows')
let numRows = 25;
let numColumns = 40;
let time = document.querySelector('#time')
let squaresCleared = 0;
let allMarkers = Math.floor(numRows * numColumns * 0.2)
let firstSquare;
let values = [];
let finalValues = [];

//Functions:
//To do: Set board size


//Setup gameboard
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

//Clear a square with left click
function clear(evt) {
  evt.preventDefault();
  if (squaresCleared < 1) {
    firstSquare = evt.target
    placeMines()
    checkNeighbors(evt.target)
    squaresCleared += 1;
  } else {
    squaresCleared += 1;
    evt.target.removeAttribute('class')
    evt.target.removeEventListener('click', clear)
    checkNeighbors(evt.target)
  }
}

//On first click, set mine locations
function placeMines() {
  console.log(firstSquare)
  let firstSquareId = parseInt(firstSquare.getAttribute('id').substr(2),10)
  firstSquare.removeAttribute('class')
  let mineCount = allMarkers;
  while (mineCount === allMarkers) {
    let seedVal = Math.floor(Math.random() * 8)
    switch(seedVal){
      case 0:
        if ((firstSquareId >= numColumns) && (firstSquareId % numColumns !== 1)) {
          firstMine = (firstSquareId - numColumns - 1);
          console.log('first mine is top left')
          mineCount -= 1;
        }
        break;
      case 1:
        if (firstSquareId >= numColumns) {
          firstMine = (firstSquareId - numColumns);
          console.log('first mine is top center')
          mineCount -= 1;
        }
        break;
      case 2:
        if ((firstSquareId >= numColumns) && (firstSquareId % numColumns !== 0)) {
          firstMine = (firstSquareId - numColumns + 1);
          console.log('first mine is top right')
          mineCount -= 1;
        }
        break;
      case 3:
        if (firstSquareId % numColumns !== 1) {
          firstMine = (firstSquareId - 1);
          console.log('first mine is left center')
          mineCount -= 1;
        }
        break;
      case 4:
        if (firstSquareId % numColumns !== 0) {
          firstMine = (firstSquareId + 1);
          console.log('first mine is right center')
          mineCount -= 1;
        }
        break;
      case 5:
        if ((firstSquareId % numColumns !== 1) && (firstSquareId <= ((numRows - 1) * numColumns))) {
          firstMine = (firstSquareId + numColumns - 1);
          console.log('first mine is bottom left')
          mineCount -= 1;
        }
        break;
      case 6:
        if (firstSquareId <= ((numRows - 1) * numColumns)) {
          firstMine = (firstSquareId + numColumns);
          console.log('first mine is bottom center')
          mineCount -= 1;
        }
        break;
      case 7 || 8:
        if ((firstSquareId <= ((numRows - 1) * numColumns)) && (firstSquareId % numColumns !== 0)) {
          firstMine = (firstSquareId + numColumns + 1);
          console.log('first mine is bottom right')
          mineCount -= 1;
        }
        break;
      default:
        console.log('a random number led to an invalid setup - trying again')
    }
  }
  for (i = 1; i <= (allMarkers - 1); i++) {
    values.push("mine")
    mineCount -= 1
  }
  console.log(`The array has ${values.length} mines other than the first one`)
  for (i = (allMarkers + 2); i <= (numColumns * numRows); i++) {
    values.push("tbd")
  }
  console.log(`The array has ${values.length} values`)

  //shuffle the array
  let currentIndex = values.length, temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = values[currentIndex];
    values[currentIndex] = values[randomIndex];
    values[randomIndex] = temporaryValue;
  }
  //push shuffled values to array and recombine, mixing in the first click ("tbd") and  first mine ("mine")
  console.log(`The first square clicked was ${firstSquareId}`)
  console.log(`The first mine generated was ${firstMine}`)
  console.log(values.slice(0,(Math.min(firstSquareId,firstMine) - 1)))
  finalValues.push(values.slice(0,(Math.min(firstSquareId,firstMine) - 1)))
  if (firstSquareId < firstMine) {
    finalValues.push(["tbd"])
} else {
    finalValues.push(["mine"])
}
  console.log(values.slice((Math.min(firstSquareId,firstMine) - 1), (Math.max(firstSquareId, firstMine) - 2)))
  finalValues.push(values.slice((Math.min(firstSquareId, firstMine) - 1), (Math.max(firstSquareId,firstMine) - 2)))
  if (firstSquareId > firstMine) {
    finalValues.push(["tbd"])
  } else {
    finalValues.push(["mine"])
  }
  console.log(values.slice((Math.max(firstSquareId, firstMine) - 2)))
  finalValues.push(values.slice(Math.max(firstSquareId,firstMine) - 2))
  values = finalValues[0].concat(finalValues[1],finalValues[2],finalValues[3],finalValues[4])
  console.log(values)

//Start timer
  setInterval(function() { time.innerHTML = parseInt(time.innerHTML, 10) + 1 }, 1000)
}

//count the mines around any clicked square
function checkNeighbors(input) {
  let clicked = parseInt(input.getAttribute('id').substr(2),10)
  console.log(values[clicked])
  if (values[clicked] === 'mine') {
    console.log('boom!')
  } else {
    let counter = 0;
    if ((clicked >= numColumns) && (clicked % numColumns !== 1)) {
      if ((values[clicked - numColumns - 1]) === "mine") {
        counter += 1;
      }
    }
    if (clicked >= numColumns) {
      if ((values[clicked - numColumns]) === "mine") {
        counter += 1;
      }
    }
    if ((clicked >= numColumns) && (clicked % numColumns !== 0)) {
      if ((values[clicked - numColumns + 1]) === "mine") {
        counter += 1;
      }
    }
    if (clicked % numColumns !== 1) {
      if ((values[clicked - 1]) === "mine") {
        counter += 1;
      }
    }
    if (clicked % numColumns !== 0) {
      if ((values[clicked + 1]) === "mine") {
        counter += 1;
      }
    }
    if ((clicked % numColumns !== 1) && (clicked <= ((numRows - 1) * numColumns))) {
      if ((values[clicked + numColumns - 1]) === "mine") {
        counter += 1;
      }
    }
    if (clicked <= ((numRows - 1) * numColumns)) {
      if ((values[clicked + numColumns]) === "mine") {
        counter += 1;
      }
    }
    if ((clicked <= ((numRows - 1) * numColumns)) && (clicked % numColumns !== 0)) {
      if ((values[clicked + numColumns + 1]) === "mine") {
        counter += 1;
      }
    }
    console.log(counter)
    let countVal = document.createElement('P')
    input.appendChild(countVal)
    switch (counter) {
      case 0:
        input.removeAttribute('class');
        input.setAttribute('class','zero');
        break;
      case 1:
        input.removeAttribute('class');
        input.setAttribute('class','one');
        break;
      case 2:
        input.removeAttribute('class');
        input.setAttribute('class','two');
        break;
      case 3:
        input.removeAttribute('class');
        input.setAttribute('class','three');
        break;
      case 4:
        input.removeAttribute('class');
        input.setAttribute('class','four');
        break;
      case 5:
        input.removeAttribute('class');
        input.setAttribute('class','five');
        break;
      case 6:
        input.removeAttribute('class');
        input.setAttribute('class','six');
        break;
      case 7:
        input.removeAttribute('class');
        input.setAttribute('class','seven');
        break;
      case 8:
        input.removeAttribute('class');
        input.setAttribute('class','eight');
        break;
    }
    countVal.innerHTML = counter;
  }
}

//To do: place mine markers on right click

//This will ultimately be automated as part of the setup function
createBoard();