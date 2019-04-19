// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../js/main.js":[function(require,module,exports) {
//Global Variables & starting values
var allRows = document.querySelector('.rows');
var numRows = 8;
var numColumns = 8;
var time = document.querySelector('#time');
var recordTime = document.querySelector('#record-time');
recordTime.innerHTML = 'not set';
var squaresCleared = 0;
var numMarked = document.querySelector('#marked');
var markersPlaced = NaN;
var allMarkers = NaN;
var firstSquare;
var values = [];
var finalValues = [];
var gridSelector = document.querySelector('#gridSelector');
gridSelector.addEventListener('change', createBoard);
var presetRows = document.querySelector('#numRowsText');
presetRows.innerHTML = numRows;
var customRows = document.querySelector('#numRowsInput');
var presetColumns = document.querySelector('#numColumnsText');
presetColumns.innerHTML = numColumns;
var customColumns = document.querySelector('#numColumnsInput');
var customButton = document.querySelector('#createCustom');
var reset = document.querySelector('#reset');
reset.addEventListener('click', resetBoard);
var indicatorArrow = document.querySelector('#indicatorArrow');
var clickActions = document.querySelector('#clickActions');
clickActions.addEventListener('click', clickAction);
var currentTime;
var clearQueue = []; //Functions:
//Setup gameboard

function createBoard() {
  while (allRows.firstChild) {
    while (allRows.firstChild.firstChild) {
      allRows.firstChild.removeChild(allRows.firstChild.firstChild);
    }

    allRows.removeChild(allRows.firstChild);
  }

  document.querySelector('#winMessage').style.display = "none";
  document.querySelector('#lossMessage').style.display = "none";
  values = [];
  finalValues = [];
  squaresCleared = 0;
  indicatorArrow.removeAttribute('class');
  indicatorArrow.setAttribute('class', 'clickReveal');

  switch (gridSelector.value) {
    case 'Small':
      if (localStorage.getItem("smallScore") !== null) {
        recordTime.innerHTML = localStorage.getItem("smallScore");
      }

      presetRows.style.display = 'inline';
      presetRows.innerHTML = '8';
      presetColumns.style.display = 'inline';
      presetColumns.innerHTML = '8';
      customRows.style.display = 'none';
      customColumns.style.display = 'none';
      customButton.style.display = 'none';
      numRows = 8;
      numColumns = 8;
      break;

    case 'Medium':
      if (localStorage.getItem("medScore") !== null) {
        recordTime.innerHTML = localStorage.getItem("medScore");
      } else {
        recordTime.innerHTML = 'not set';
      }

      presetRows.style.display = 'inline';
      presetRows.innerHTML = '16';
      presetColumns.style.display = 'inline';
      presetColumns.innerHTML = '16';
      customRows.style.display = 'none';
      customColumns.style.display = 'none';
      customButton.style.display = 'none';
      numRows = 16;
      numColumns = 16;
      break;

    case 'Large':
      if (localStorage.getItem("largeScore") !== null) {
        recordTime.innerHTML = localStorage.getItem("largeScore");
      } else {
        recordTime.innerHTML = "not set";
      }

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
      //To do: Custom sizing not working via customButton; only resetButton
      recordTime.innerHTML = "N/A";
      presetRows.style.display = 'none';
      customRows.style.display = 'block';
      presetColumns.style.display = 'none';
      customColumns.style.display = 'block';
      customButton.style.display = 'inline';
      gridSelector.addEventListener('change', createBoard);
      customButton.addEventListener('click', function (evt) {
        evt.preventDefault();
        numRows = customRows.value;
        numColumns = customColumns.value;
      });
  }

  time.innerHTML = parseInt(0, 10);
  allMarkers = Math.floor(numRows * numColumns * 0.2);
  markersPlaced = 0;
  numMarked.innerHTML = "".concat(markersPlaced, " / ").concat(allMarkers);

  for (i = 0; i < numRows; i++) {
    var newRow = document.createElement('div');
    allRows.appendChild(newRow);
    newRow.setAttribute('class', 'row');
    newRow.setAttribute('id', "row-".concat(i + 1));

    for (j = 0; j < numColumns; j++) {
      var newSquare = document.createElement('div');
      newRow.appendChild(newSquare);
      newSquare.setAttribute('class', "square");
      newSquare.setAttribute('id', "sq".concat(i * numColumns + j + 1));
      newSquare.addEventListener('click', clickHandler);
    }
  }
} //Start/Stop timer


function startTimer() {
  time.innerHTML = 0;
  currentTime = setInterval(function () {
    time.innerHTML = parseInt(time.innerHTML, 10) + 1;
  }, 1000);
}

function stopTimer() {
  clearInterval(currentTime);
} //Reset with button


function resetBoard(evt) {
  evt.preventDefault();
  stopTimer();
  createBoard();
} //Clear a square with left click


function clear(evt) {
  evt.preventDefault();
  var clickVal = parseInt(evt.target.id.substr(2), 10);
  clearQueue.push(clickVal);

  if (squaresCleared < 1) {
    firstSquare = evt.target;
    placeMines();
    checkNeighbors();
    squaresCleared += 1;
  } else {
    squaresCleared += 1;
    evt.target.removeAttribute('class');
    evt.target.removeEventListener('click', clickAction);
    checkNeighbors();
  }
} //On first square clicked, set mine locations


function placeMines() {
  console.log(firstSquare);
  var firstSquareId = parseInt(firstSquare.getAttribute('id').substr(2), 10);

  for (i = 0; i < allMarkers; i++) {
    values.push("mine");
  }

  console.log("The array has ".concat(values.length, " mines"));

  for (i = 0; i < numColumns * numRows - allMarkers - 1; i++) {
    values.push("tbd");
  } //shuffle the array


  var currentIndex = values.length,
      temporaryValue,
      randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = values[currentIndex];
    values[currentIndex] = values[randomIndex];
    values[randomIndex] = temporaryValue;
  } //push shuffled values to array and recombine, mixing in the first click


  console.log("The first square clicked was ".concat(firstSquareId));
  console.log(values.slice(0, firstSquareId - 1));
  finalValues.push(values.slice(0, firstSquareId - 1));
  console.log(finalValues[0].length);
  finalValues.push(["tbd"]);
  finalValues.push(values.slice(firstSquareId - 1));
  values = finalValues[0].concat(finalValues[1], finalValues[2]);
  console.log("The array has ".concat(values.length, " values"));
  console.log(values);
  startTimer();
} //count the mines around any clicked square


function checkNeighbors() {
  var clickId = clearQueue[0];
  var clickVal = clickId - 1;
  console.log(clickId);
  var clicked = document.querySelector("#sq".concat(clickId));
  clicked.removeEventListener('click', clickHandler);

  if (values[clickVal] === 'mine') {
    console.log('boom!');
    stopTimer();
    clicked.removeAttribute('class');
    clicked.setAttribute('class', 'mine');
    explode(clickId);
  } else {
    var counter = 0;

    if (clickId > numColumns && clickId % numColumns !== 1) {
      if (values[clickVal - numColumns - 1] === "mine") {
        counter += 1;
      }
    }

    if (clickId > numColumns) {
      if (values[clickVal - numColumns] === "mine") {
        counter += 1;
      }
    }

    if (clickId > numColumns && clickId % numColumns !== 0) {
      if (values[clickVal - numColumns + 1] === "mine") {
        counter += 1;
      }
    }

    if (clickId % numColumns !== 1) {
      if (values[clickVal - 1] === "mine") {
        counter += 1;
      }
    }

    if (clickId % numColumns !== 0) {
      if (values[clickVal + 1] === "mine") {
        counter += 1;
      }
    }

    if (clickId % numColumns !== 1 && clickId <= (numRows - 1) * numColumns) {
      if (values[clickVal + numColumns - 1] === "mine") {
        counter += 1;
      }
    }

    if (clickId <= (numRows - 1) * numColumns) {
      if (values[clickVal + numColumns] === "mine") {
        counter += 1;
      }
    }

    if (clickId <= (numRows - 1) * numColumns && clickId % numColumns !== 0) {
      if (values[clickVal + numColumns + 1] === "mine") {
        counter += 1;
      }
    }

    console.log("Square ".concat(clickId, " has ").concat(counter, " mines around it"));
    var countText = document.createElement('P');
    clicked.appendChild(countText);

    switch (counter) {
      case 0:
        if (clickId > numColumns && clickId % numColumns !== 1) {
          clearQueue.push(clickId - numColumns - 1);
        }

        if (clickId > numColumns) {
          clearQueue.push(clickId - numColumns);
        }

        if (clickId > numColumns && clickId % numColumns !== 0) {
          clearQueue.push(clickId - numColumns + 1);
        }

        if (clickId % numColumns !== 1) {
          clearQueue.push(clickId - 1);
        }

        if (clickId % numColumns !== 0) {
          clearQueue.push(clickId + 1);
        }

        if (clickId % numColumns !== 1 && clickId <= (numRows - 1) * numColumns) {
          clearQueue.push(clickId + numColumns - 1);
        }

        if (clickId <= (numRows - 1) * numColumns) {
          clearQueue.push(clickId + numColumns);
        }

        if (clickId <= (numRows - 1) * numColumns && clickId % numColumns !== 0) {
          clearQueue.push(clickId + numColumns + 1);
        }

        clicked.removeAttribute('class');
        clicked.setAttribute('class', 'zero');
        break;

      case 1:
        clicked.removeAttribute('class');
        clicked.setAttribute('class', 'one');
        break;

      case 2:
        clicked.removeAttribute('class');
        clicked.setAttribute('class', 'two');
        break;

      case 3:
        clicked.removeAttribute('class');
        clicked.setAttribute('class', 'three');
        break;

      case 4:
        clicked.removeAttribute('class');
        clicked.setAttribute('class', 'four');
        break;

      case 5:
        clicked.removeAttribute('class');
        clicked.setAttribute('class', 'five');
        break;

      case 6:
        clicked.removeAttribute('class');
        clicked.setAttribute('class', 'six');
        break;

      case 7:
        clicked.removeAttribute('class');
        clicked.setAttribute('class', 'seven');
        break;

      case 8:
        clicked.removeAttribute('class');
        clicked.setAttribute('class', 'eight');
        break;
    }

    countText.innerHTML = counter;
  }

  clearQueue.shift();
  console.log(clearQueue);

  while (clearQueue.length > 0) {
    var nextSquare = document.querySelector("#sq".concat(clearQueue[0]));

    while (nextSquare.classList.contains('square') == false) {
      clearQueue.shift();
      nextSquare = document.querySelector("#sq".concat(clearQueue[0]));
    }

    if (clearQueue.length > 0) {
      checkNeighbors();
    }
  }
} //Click Action Toggle


function clickAction(evt) {
  evt.preventDefault();

  if (indicatorArrow.classList.contains('clickReveal')) {
    indicatorArrow.removeAttribute('class');
    indicatorArrow.setAttribute('class', 'clickMark');
  } else if (indicatorArrow.classList.contains('clickMark')) {
    indicatorArrow.removeAttribute('class');
    indicatorArrow.setAttribute('class', 'clickReveal');
  } else {
    console.log('something is wrong');
  }
} //Click handler function


function clickHandler(evt) {
  evt.preventDefault();

  if (indicatorArrow.classList.contains('clickReveal')) {
    clear(evt);
  } else if (indicatorArrow.classList.contains('clickMark')) {
    placeMarker(evt);
  } else {
    console.log('something is wrong');
  }
} //To do: place mine markers on right click


function placeMarker(evt) {
  evt.preventDefault();

  if (squaresCleared > 0) {
    var squareMarked = evt.target;

    if (squareMarked.classList.contains('square')) {
      squareMarked.removeAttribute('class');
      squareMarked.setAttribute('class', 'mine-marker');
      markersPlaced += 1;
      numMarked.innerHTML = "".concat(markersPlaced, " / ").concat(allMarkers);

      if (markersPlaced === allMarkers) {
        stopTimer();

        for (i = 0; i < numRows * numColumns; i++) {
          if (document.querySelector("#sq".concat(i + 1)).classList.contains('square')) {
            clearQueue.push(i + 1);
            checkNeighbors();
          }
        }

        if (document.querySelector('.mine') == null) {
          console.log("Congratulations! You win!");
          document.querySelector('#winMessage').style.display = "block";

          if (recordTime.innerHTML === "not set" || recordTime.innerHTML === "N/A" || parseInt(time.innerHTML, 10) < parseInt(recordTime.innerHTML, 10)) {
            switch (gridSelector.value) {
              case 'Small':
                localStorage.setItem("smallScore", time.innerHTML);
                recordTime.innerHTML = localStorage.getItem("smallScore");
                break;

              case 'Medium':
                localStorage.setItem("mediumScore", time.innerHTML);
                recordTime.innerHTML = localStorage.getItem("mediumScore");
                break;

              case 'Large':
                localStorage.setItem("largeScore", time.innerHTML);
                recordTime.innerHTML = localStorage.getItem("largeScore");
                break;
            }
          }
        } else if (document.querySelector('.mine')) {
          console.log("Sorry! You didn't find all the mines. Better luck next time!");
          document.querySelector('#lossMessage').style.display = "block";
        }
      }
    } else if (squareMarked.classList.contains('mine-marker')) {
      squareMarked.removeAttribute('class');
      squareMarked.setAttribute('class', 'square');
      markersPlaced -= 1;
      numMarked.innerHTML = "".concat(markersPlaced, " / ").concat(allMarkers);
    }
  }
} //To do: explosion function


function explode(bomb) {
  var thisSquare;
  setTimeout(function explode() {
    for (i = -1; i < 2; i++) {
      thisSquare = document.querySelector("#sq".concat(bomb - numColumns + i));

      if (Math.floor((bomb - numColumns + i - 1) / numColumns) === Math.floor((bomb - numColumns - 1) / numColumns)) {
        thisSquare.setAttribute('class', 'explosion');
      }
    }

    for (i = -1; i < 2; i = i + 2) {
      thisSquare = document.querySelector("#sq".concat(bomb + i));

      if (Math.floor((bomb + i - 1) / numColumns) === Math.floor((bomb - 1) / numColumns)) {
        thisSquare.setAttribute('class', 'explosion');
      }
    }

    for (i = -1; i < 2; i++) {
      thisSquare = document.querySelector("#sq".concat(bomb + numColumns + i));

      if (Math.floor((bomb + numColumns + i - 1) / numColumns) === Math.floor((bomb + numColumns - 1) / numColumns)) {
        thisSquare.setAttribute('class', 'explosion');
      }
    }
  }, 333);
  setTimeout(function () {
    for (i = -1; i < 2; i++) {
      thisSquare = document.querySelector("#sq".concat(bomb - numColumns + i));

      if (Math.floor((bomb - numColumns + i - 1) / numColumns) === Math.floor((bomb - numColumns - 1) / numColumns)) {
        thisSquare.setAttribute('class', 'aflame');
      }
    }

    for (i = -1; i < 2; i = i + 2) {
      thisSquare = document.querySelector("#sq".concat(bomb + i));

      if (Math.floor((bomb + i - 1) / numColumns) === Math.floor((bomb - 1) / numColumns)) {
        thisSquare.setAttribute('class', 'aflame');
      }
    }

    for (i = -1; i < 2; i++) {
      thisSquare = document.querySelector("#sq".concat(bomb + numColumns + i));

      if (Math.floor((bomb + numColumns + i - 1) / numColumns) === Math.floor((bomb + numColumns - 1) / numColumns)) {
        thisSquare.setAttribute('class', 'aflame');
      }
    }
  }, 667);
  setTimeout(function () {
    for (i = 1; i <= numColumns * numRows; i++) {
      thisSquare = document.querySelector("#sq".concat(i));

      if (values[i - 1] === 'mine') {
        thisSquare.removeAttribute('class');
        thisSquare.setAttribute('class', 'mine');
      }
    }
  }, 1000);
  document.querySelector('#lossMessage').style.display = "block";
} //Initialize game on load


createBoard();
},{}],"../../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "64472" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","../js/main.js"], null)
//# sourceMappingURL=/main.8f75cf09.js.map