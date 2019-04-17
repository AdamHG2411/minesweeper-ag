//Global Variables & starting values
let allRows = document.querySelector('.rows')
let numRows = 8;
let numColumns = 8;
let time = document.querySelector('#time')
let squaresCleared = 0;
let markersPlaced = document.querySelector('#markersPlaced')
let numMarkers = document.querySelector('#numMarkers')
let allMarkers = Math.floor(numRows * numColumns * 0.2)
numMarkers.innerHTML = allMarkers
let firstSquare;
let values = [];
let finalValues = [];
let gridSelector = document.querySelector('#gridSelector')
gridSelector.addEventListener('change',gridBuilder)
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
let clickActions = document.querySelector('#clickActions')
clickActions.addEventListener('click',clickAction)

//Functions:
//Select grid size (custom still needs some debugging)
function gridBuilder(evt) {
  evt.preventDefault()
  for (i = 0; i < numRows; i++) {
    allRows.removeChild(allRows.firstChild)
  }
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
      createBoard();
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
      createBoard();
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
      createBoard();
      break;
    case 'Custom':
      presetRows.style.display = 'none';
      customRows.style.display = 'block';
      presetColumns.style.display = 'none';
      customColumns.style.display = 'block';
      customButton.style.display = 'inline';
      gridSelector.addEventListener('change', function() {
        gridBuilder()
      })
      customButton.addEventListener('click', function(evt) {
        evt.preventDefault()
        numRows = customRows.value;
        numColumns = customColumns.value;
        createBoard();
      })
  }
}

//Setup gameboard
function createBoard() {
  time.innerHTML = parseInt(0,10)
  allMarkers = Math.floor(numRows * numColumns * 0.2)
  markersPlaced = 0;
  let markedStr = document.querySelector('#marked')
  markedStr.innerHTML = `${markersPlaced} / ${allMarkers}`
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

//Reset with button
function resetBoard(evt) {
  evt.preventDefault();
  for (i = 0; i < numRows; i++) {
    allRows.removeChild(allRows.firstChild)
  }
  createBoard();
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

//To do: Auto clear empty squares - currently too much for chrome to process - debug
// function clearEmpties(clicked) {
//   if ((clicked >= numColumns) && (clicked % numColumns !== 1)) {
//     checkNeighbors(document.querySelector(`#sq${clicked - numColumns - 1}`))
//   }
//   if (clicked >= numColumns) {
//     checkNeighbors(document.querySelector(`#sq${clicked - numColumns}`))
//   }
//   if ((clicked >= numColumns) && (clicked % numColumns !== 0)) {
//     checkNeighbors(document.querySelector(`#sq${clicked - numColumns + 1}`))
//   }
//   if (clicked % numColumns !== 1) {
//     checkNeighbors(document.querySelector(`#sq${clicked - 1}`))
//   }
//   if (clicked % numColumns !== 0) {
//     checkNeighbors(document.querySelector(`#sq${clicked + 1}`))
//   }
//   if ((clicked % numColumns !== 1) && (clicked <= ((numRows - 1) * numColumns))) {
//     checkNeighbors(document.querySelector(`#sq${clicked + numColumns - 1}`))
//   }
//   if (clicked <= ((numRows - 1) * numColumns)) {
//     checkNeighbors(document.querySelector(`#sq${clicked + numColumns}`))
//   }
//   if ((clicked <= ((numRows - 1) * numColumns)) && (clicked % numColumns !== 0)) {
//     checkNeighbors(document.querySelector(`#sq${clicked + numColumns + 1}`))
//   }
// }
//On first click, set mine locations
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
  //push shuffled values to array and recombine, mixing in the first click
  console.log(`The first square clicked was ${firstSquareId}`)
  console.log(values.slice(0,(firstSquareId - 1)))
  finalValues.push(values.slice(0,(firstSquareId - 1)))
  finalValues.push(["tbd"])
  finalValues.push(values.slice((firstSquareId - 1)))
  values = finalValues[0].concat(finalValues[1],finalValues[2])
  console.log(values.length)

//Start timer
  setInterval(function() { time.innerHTML = parseInt(time.innerHTML, 10) + 1 }, 1000)
}

//count the mines around any clicked square
function checkNeighbors(input) {
  let clicked = (parseInt(input.getAttribute('id').substr(2),10) - 1)
  console.log(values[clicked])
  if (values[clicked] === 'mine') {
    console.log('boom!')
    input.removeAttribute('class');
    input.setAttribute('class','mine');
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

        //clearEmpties(clicked);
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

//Click Action Toggle
function clickAction(evt) {
  evt.preventDefault()
  if (indicatorArrow.class = 'clickReveal') {
    indicatorArrow.removeAttribute('class')
    indicatorArrow.setAttribute('class','clickMark')
  } else if (indicatorArrow.class = 'clickMark') {
    indicatorArrow.removeAttribute('class')
    indicatorArrow.setAttribute('class','clickReveal')
  } else {
    console.log('something is wrong')
  }
}

//Click handler function
function clickHandler(evt) {
  evt.preventDefault();
  if (indicatorArrow.class = 'clickReveal') {
    clear(evt)
  } else if (indicatorArrow.class = 'clickMark') {
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