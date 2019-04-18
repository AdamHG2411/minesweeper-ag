//This is unused - couldn't get it working as I wanted in time for the project - redesigned with a simpler version
function explode(bomb) {
  let topVal = ((bomb - 1) % numColumns)
  let rowsAbove = Math.floor(((bomb - 1) - topVal) / numColumns)
  console.log(rowsAbove)
  let rowsBelow = (numRows - rowsAbove - 1)
  let thisSquare;
  let columnsOut
  for (i = 1; i <= Math.max(rowsAbove, rowsBelow); i++) {
    //if row startVal > 0 || row endVal < finalSquare
      //On row (i squares up) from center-i to center+i
      for (j=0; j <= i; j++) {
        //if first row of explosion is positive && left edge of explosion is on same row as directly above bomb
        if (((bomb - (i * numColumns)) > 0) && Math.floor((bomb - 1 - (i * numColumns) - j) / numColumns) === Math.floor((bomb - 1 - (i * numColumns)) / numColumns)) {
          thisSquare = document.querySelector(`#sq${(bomb - (i * numColumns) - j)}`)
          console.log(thisSquare)
          thisSquare.setAttribute('class','explosion')
        }
        if (((bomb - (i * numColumns)) > 0) && Math.floor((bomb - 1 - (i * numColumns) + j) / numColumns) === Math.floor((bomb - 1 - (i * numColumns)) / numColumns)) {
          thisSquare = document.querySelector(`#sq${(bomb - (i * numColumns) + j)}`)
          console.log(thisSquare)
          thisSquare.setAttribute('class','explosion')
        }
        //From rows (i rows up - 1) to (i rows down - 1) on bomb - i && bomb + i
        if ((Math.floor((bomb - 1 - j) / numColumns) === Math.floor((bomb - 1) / numColumns)) && ((bomb - j - (numColumns * j)) > 0) && ((i > 1) || (j > 0))) {
          columnsOut = j
          thisSquare = document.querySelector(`#sq${bomb - columnsOut - (j * numColumns)}`)
          console.log(thisSquare)
          thisSquare.setAttribute('class','explosion')
        }
        if ((Math.floor((bomb - 1 + j) / numColumns) === Math.floor(bomb - 1 / numColumns)) && ((bomb + j - (numColumns * j)) > 0) && ((i > 1) || (j > 0))) {
          columnsOut = j
          thisSquare = document.querySelector(`#sq${bomb + columnsOut - (j * numColumns)}`)
          console.log(thisSquare)
          thisSquare.setAttribute('class','explosion')
        }
        if ((Math.floor((bomb - 1 - j) / numColumns) === Math.floor((bomb - 1) / numColumns)) && ((bomb - j + (numColumns * j)) <= (numRows * numColumns)) && ((i > 1) || (j > 0))) {
          columnsOut = j
          thisSquare = document.querySelector(`#sq${bomb - columnsOut + (j * numColumns)}`)
          console.log(thisSquare)
          thisSquare.setAttribute('class','explosion')
        }
        if ((Math.floor((bomb - 1 + j) / numColumns) === Math.floor((bomb - 1) / numColumns)) && ((bomb + j + (numColumns * j)) <= (numRows * numColumns)) && ((i > 1) || (j > 0))) {
          columnsOut = j
          thisSquare = document.querySelector(`#sq${bomb + columnsOut + (j * numColumns)}`)
          console.log(thisSquare)
          thisSquare.setAttribute('class','explosion')
          thisSquare.innerHTML = ""
        }
      }
      //On row (i squares down) from center-i to center+i
      if (((bomb + (i * numColumns)) <= (numColumns * numRows)) && Math.floor((bomb - 1 + (i * numColumns) - j) / numColumns) === Math.floor((bomb - 1 + (i * numColumns)) / numColumns)) {
        thisSquare = document.querySelector(`#sq${(bomb + (i * numColumns) - j)}`)
        console.log(thisSquare)
        thisSquare.removeAttribute('class')
        thisSquare.setAttribute('class','explosion')
        thisSquare.innerHTML = ""
      }
      if (((bomb - (i * numColumns)) > 0) && Math.floor((bomb - 1 - (i * numColumns) + j) / numColumns) === Math.floor((bomb - 1 - (i * numColumns)) / numColumns)) {
        thisSquare = document.querySelector(`#sq${(bomb + (i * numColumns) + j)}`)
        console.log(thisSquare)
        thisSquare.removeAttribute('class')
        thisSquare.setAttribute('class','explosion')
        thisSquare.innerHTML = ""
      }
  }
  for (i = 1; i <= (numRows * numColumns); i++) {
    thisSquare = document.querySelector(`#sq${i}`)
    if (thisSquare.classList.contains('explosion')) {
      //do nothing
    } else {
      thisSquare.removeAttribute('class')
      thisSquare.setAttribute('class','aflame')
      thisSquare.innerHTML = ""
    }
  }
}