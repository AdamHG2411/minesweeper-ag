//Global Variables & starting values
let allRows = document.querySelector('.rows')
let numRows = 8;
let numColumns = 8;
let time = document.querySelector('#time')
let squaresCleared = 0;
let marked = document.querySelector('#marked')
let markersPlaced = NaN;
let allMarkers = NaN;
let firstSquare;
let values = [];
let finalValues = [];
let gridSelector = document.querySelector('#gridSelector')
gridSelector.addEventListener('change',createBoard)
let presetRows = document.querySelector('#numRowsText')
presetRows.innerHTML = numRows;
let customRows = document.querySelector('#numRowsInput')
let presetColumns = document.querySelector('#numColumnsText')
presetColumns.innerHTML = numColumns;
let customColumns = document.querySelector('#numColumnsInput')
let customButton = document.querySelector('#createCustom')
let reset = document.querySelector('#reset')
reset.addEventListener('click', resetBoard)
let indicatorArrow = document.querySelector('#indicatorArrow')
indicatorArrow.setAttribute('class','clickReveal')
let clickActions = document.querySelector('#clickActions')
clickActions.addEventListener('click',clickAction)
let currentTime;
let clearQueue = [];

//Functions:
//Setup gameboard
function createBoard() {
  if (allRows.childElementCount > 0) {
    for (i = 0; i < numRows; i++) {
      allRows.removeChild(allRows.firstChild)
    }
  }
  values = [];
  finalValues = [];
  squaresCleared = 0;
  switch (gridSelector.value) {
    case 'Small':
      presetRows.style.display = 'inline';
      presetRows.innerHTML = '8'
      presetColumns.style.display = 'inline';
      presetColumns.innerHTML = '8'
      customRows.style.display = 'none';
      customColumns.style.display = 'none';
      customButton.style.display = 'none';
      numRows = 8;
      numColumns = 8;
      break;
    case 'Medium':
      presetRows.style.display = 'inline';
      presetRows.innerHTML = '16'
      presetColumns.style.display = 'inline';
      presetColumns.innerHTML = '16';
      customRows.style.display = 'none';
      customColumns.style.display = 'none';
      customButton.style.display = 'none';
      numRows = 16;
      numColumns = 16;
      break;
    case 'Large':
      presetRows.style.display = 'inline';
      presetRows.innerHTML = '24';
      presetColumns.style.display = 'inline';
      presetColumns.innerHTML = '24';
      customRows.style.display = 'none';
      customColumns.style.display = 'none';
      customButton.style.display = 'none';
      numRows = 24;
      numColumns = 24;
      break;
    case 'Custom':
    //To do: Custom sizing not working quite right anymore
      presetRows.style.display = 'none';
      customRows.style.display = 'block';
      presetColumns.style.display = 'none';
      customColumns.style.display = 'block';
      customButton.style.display = 'inline';
      gridSelector.addEventListener('change', createBoard)
      customButton.addEventListener('click', function(evt) {
        evt.preventDefault()
        numRows = customRows.value;
        numColumns = customColumns.value;
      })
  }
  time.innerHTML = parseInt(0,10)
  allMarkers = Math.floor(numRows * numColumns * 0.2)
  markersPlaced = 0;
  marked.innerHTML = `${markersPlaced} / ${allMarkers}`
  for (i = 0; i < numRows; i++) {
    let newRow = document.createElement('div')
    allRows.appendChild(newRow)
    newRow.setAttribute('class',`row row-${i + 1}`)
    for (j = 0; j < numColumns; j++) {
      let newSquare = document.createElement('div')
      newRow.appendChild(newSquare)
      newSquare.setAttribute('class',`square`)
      newSquare.setAttribute('id', `sq${(i * numColumns) + j + 1}`)
      newSquare.addEventListener('click', clickHandler);

    }
  }
}

//Start/Stop timer
function startTimer() {
  time.innerHTML = 0
  currentTime = setInterval(function() { time.innerHTML = parseInt(time.innerHTML, 10) + 1 }, 1000)
}
function stopTimer() {
  clearInterval(currentTime)
}

//Reset with button
function resetBoard(evt) {
  evt.preventDefault();
  createBoard();
}

//Clear a square with left click
function clear(evt) {
  evt.preventDefault();
  let clickVal = parseInt(evt.target.id.substr(2),10)
  clearQueue.push(clickVal)
  if (squaresCleared < 1) {
    firstSquare = evt.target
    placeMines()
    checkNeighbors()
    squaresCleared += 1;
  } else {
    squaresCleared += 1;
    evt.target.removeAttribute('class')
    evt.target.removeEventListener('click',clickAction)
    checkNeighbors()
  }
}

//On first square clicked, set mine locations
function placeMines() {
  console.log(firstSquare)
  let firstSquareId = parseInt(firstSquare.getAttribute('id').substr(2),10)
  for (i = 0; i < allMarkers; i++) {
    values.push("mine")
  }
  console.log(`The array has ${values.length} mines`)
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
  //push shuffled values to array and recombine, mixing in the first click
  console.log(`The first square clicked was ${firstSquareId}`)
  console.log(values.slice(0,(firstSquareId - 1)))
  finalValues.push(values.slice(0,(firstSquareId - 1)))
  console.log(finalValues[0].length)
  finalValues.push(["tbd"])
  finalValues.push(values.slice((firstSquareId - 1)))
  values = finalValues[0].concat(finalValues[1],finalValues[2])
  console.log(`The array has ${values.length} values`)
  console.log(values)
  startTimer()
}

//count the mines around any clicked square
function checkNeighbors() {
  let clickVal = clearQueue[0]
  console.log(clickVal)
  let clicked = document.querySelector(`#sq${clickVal}`)
  if (values[clickVal] === 'mine') {
    console.log('boom!')
    stopTimer();
    clicked.removeAttribute('class');
    clicked.setAttribute('class','mine');
  } else {
    let counter = 0;
    if ((clickVal >= numColumns) && (clickVal % numColumns !== 1)) {
      if ((values[clickVal - numColumns - 1]) === "mine") {
        counter += 1;
      }
    }
    if (clickVal >= numColumns) {
      if ((values[clickVal - numColumns]) === "mine") {
        counter += 1;
      }
    }
    if ((clickVal >= numColumns) && (clickVal % numColumns !== 0)) {
      if ((values[clickVal - numColumns + 1]) === "mine") {
        counter += 1;
      }
    }
    if (clickVal % numColumns !== 1) {
      if ((values[clickVal - 1]) === "mine") {
        counter += 1;
      }
    }
    if (clickVal % numColumns !== 0) {
      if ((values[clickVal + 1]) === "mine") {
        counter += 1;
      }
    }
    if ((clickVal % numColumns !== 1) && (clickVal <= ((numRows - 1) * numColumns))) {
      if ((values[clickVal + numColumns - 1]) === "mine") {
        counter += 1;
      }
    }
    if (clickVal <= ((numRows - 1) * numColumns)) {
      if ((values[clickVal + numColumns]) === "mine") {
        counter += 1;
      }
    }
    if ((clickVal <= ((numRows - 1) * numColumns)) && (clickVal % numColumns !== 0)) {
      if ((values[clickVal + numColumns + 1]) === "mine") {
        counter += 1;
      }
    }
    console.log(`Square ${clickVal} has ${counter} mines around it`)
    let countText = document.createElement('P')
    clicked.appendChild(countText)
    switch (counter) {
      case 0:
        if ((clickVal >= numColumns) && (clickVal % numColumns !== 1)) {
          clearQueue.push(clickVal - numColumns - 1)
        }
        if (clickVal >= numColumns) {
          clearQueue.push(clickVal - numColumns)
        }
        if ((clickVal >= numColumns) && (clickVal % numColumns !== 0)) {
          clearQueue.push(clickVal - numColumns + 1)
        }
        if (clickVal % numColumns !== 1) {
          clearQueue.push(clickVal - 1)
        }
        if (clickVal % numColumns !== 0) {
          clearQueue.push(clickVal + 1)
        }
        if ((clickVal % numColumns !== 1) && (clickVal <= ((numRows - 1) * numColumns))) {
          clearQueue.push(clickVal + numColumns - 1)
        }
        if (clickVal <= ((numRows - 1) * numColumns)) {
          clearQueue.push(clickVal + numColumns)
        }
        if ((clickVal <= ((numRows - 1) * numColumns)) && (clickVal % numColumns !== 0)) {
          clearQueue.push(clickVal + numColumns + 1)
        }
        clicked.removeAttribute('class');
        clicked.setAttribute('class','zero');
        break;
      case 1:
        clicked.removeAttribute('class');
        clicked.setAttribute('class','one');
        break;
      case 2:
        clicked.removeAttribute('class');
        clicked.setAttribute('class','two');
        break;
      case 3:
        clicked.removeAttribute('class');
        clicked.setAttribute('class','three');
        break;
      case 4:
        clicked.removeAttribute('class');
        clicked.setAttribute('class','four');
        break;
      case 5:
        clicked.removeAttribute('class');
        clicked.setAttribute('class','five');
        break;
      case 6:
        clicked.removeAttribute('class');
        clicked.setAttribute('class','six');
        break;
      case 7:
        clicked.removeAttribute('class');
        clicked.setAttribute('class','seven');
        break;
      case 8:
        clicked.removeAttribute('class');
        clicked.setAttribute('class','eight');
        break;
    }
    countText.innerHTML = counter;
  }
  clearQueue.shift()
  console.log(clearQueue)
  while (clearQueue.length > 0) {
    let nextSquare = document.querySelector(`#sq${clearQueue[0]}`)
    while (nextSquare.classList.contains('square') == false) {
      clearQueue.shift();
      nextSquare = document.querySelector(`#sq${clearQueue[0]}`)
    }
    if (clearQueue.length > 0) {
      checkNeighbors();
    }
  }
}

//Click Action Toggle
function clickAction(evt) {
  evt.preventDefault()
  if (indicatorArrow.classList.contains('clickReveal')) {
    indicatorArrow.removeAttribute('class')
    indicatorArrow.setAttribute('class','clickMark')
  } else if (indicatorArrow.classList.contains('clickMark')) {
    indicatorArrow.removeAttribute('class')
    indicatorArrow.setAttribute('class','clickReveal')
  } else {
    console.log('something is wrong')
  }
}

//Click handler function
function clickHandler(evt) {
  evt.preventDefault();
  if (indicatorArrow.classList.contains('clickReveal')) {
    clear(evt)
  } else if (indicatorArrow.classList.contains('clickMark')) {
    placeMarker(evt)
  } else {
    console.log('something is wrong')
  }
}

//To do: place mine markers on right click
function placeMarker(evt) {
  evt.preventDefault()
  let marked = evt.target
  marked.removeAttribute('class')
  marked.setAttribute('class', 'mine-marker')
  markersPlaced += 1;
}

//To do: explosion function

//This will ultimately be automated as part of the setup function
createBoard();