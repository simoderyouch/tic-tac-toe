const markSelection = document.querySelectorAll(".mark");
const cells = document.querySelectorAll("[data-cell]");
const startBtn = document.querySelector(".start-game");
const gameModes = document.querySelectorAll(".new-game");
const gameContainer = document.querySelector(".game-main");
const board = document.querySelector(".board");
const restartBtn = document.querySelector(".restart-game");
const X_icon = `<svg class="gameplay__turn"> <use xlink:href="images/SVG/icon-x.svg#icon-x"></use> </svg>`;
const O_icon = `<svg class="gameplay__turn"> <use xlink:href="images/SVG/icon-o.svg#icon-o"></use> </svg>`;
let isWinner = false;
const modal = document.querySelector(".modalEl");
const backdrop = document.querySelector(".backdrop");
let cpuMark = "x";
const scoreDisplays = document.querySelectorAll(".score");
let currentClass;
const header = document.querySelector(".heading-lg");
const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];
let selectedMark = "o";
let scorePlayer1 = 0;
let scorePlayer2 = 0;
let [a, b, c] = [0, 0, 0];
const X_class = "x";
const O_class = "o";
let O_turn = false;
let X, O;
let gameMode;

let ties = 0;

markSelection.forEach((markOption) => {
  markOption.addEventListener("click", function () {
    this.classList.add("active");
    if (this.nextElementSibling)
      this.nextElementSibling.classList.remove("active");
    else this.previousElementSibling.classList.remove("active");
    selectedMark = markOption.dataset.mark;
    if (selectedMark === "x") {
      cpuMark = "o"
    }
    else {
      cpuMark = "x"
    }
  });
});
gameModes.forEach((mode) => {
  mode.addEventListener("click", function () {
    gameMode = mode.value;
    scoreCalc()
    startGame();

  });
});

function startGame() {
  gameContainer.classList.add("hide");
  startBtn.classList.remove("hide");
  setTurn()
  if (gameMode === "vscpu" && selectedMark === "o") {
    setTimeout(() => {
      getCPUMove();
    }, 500);


  }
  cells.forEach(cell => {
    cell.addEventListener('click', handleClick, { once: true })
  })

  setBoardHoverClass()
}
function scoreCalc() {
  scoreState();
  if (gameMode === "vsplayer") {
    scoreDisplays[0].innerHTML = ` <h5>X (P1)</h5>
    <h1>${scorePlayer1}</h1>`;
    scoreDisplays[1].innerHTML = ` <h5>TIES</h5>
    <h1>${ties}</h1>`;
    scoreDisplays[2].innerHTML = ` <h5>O (P2)</h5>
    <h1>${scorePlayer2}</h1>`;
  } else {
    selectedMark === "x" ? (X = "YOU") : (X = "CPU");
    X === "YOU" ? (O = "CPU") : (O = "YOU");

    scoreDisplays[0].innerHTML = ` <h5>X (${X})</h5>
    <h1>${scorePlayer1}</h1>`;
    scoreDisplays[1].innerHTML = ` <h5>TIES</h5>
    <h1>${ties}</h1>`;
    scoreDisplays[2].innerHTML = ` <h5>O (${O})</h5>
    <h1>${scorePlayer2}</h1>`;
  }
}
function scoreState() {
  isWinner = winnerCalc();
  if (isWinner) {
    cells[a].dataset.cel === "o" ? (scorePlayer2 += 1) : (scorePlayer1 += 1);
  }
  if (!isWinner && isDraw()) {
    ties += 1;
  }
}
function winnerCalc() {
  for (let i = 0; i < winningCombinations.length; i++) {
    [a, b, c] = winningCombinations[i];
    if (
      cells[a].dataset.cel &&
      cells[a].dataset.cel === cells[b].dataset.cel &&
      cells[a].dataset.cel === cells[c].dataset.cel
    ) {
      return true;
    }
  }
  return false
}


function handleClick(e) {
  const cell = e.target;
  if (gameMode === "vscpu") {
    if (cell.dataset.cel !== cpuMark) {
      placeMark(cell, selectedMark);
      swapTurn()
      setTurn()
      setBoardHoverClass()
      if (winnerCalc()) {
        scoreCalc()
        classWin()
        setTimeout(() => {
          endGame()
        }, 500);
      }
      else if (isDraw()) {
        scoreCalc()

        setTimeout(() => {
          tiedGame()
        }, 500);
      }
      if (!winnerCalc()) {
        setTimeout(() => {
          getCPUMove();

        }, 500);
      }


    }
  }
  else {

    placeMark(cell, O_turn ? O_class : X_class);

    if (winnerCalc()) {
      scoreCalc()
      classWin()
      setTimeout(() => {
        endGame()
      }, 500);

    }
    else if (isDraw()) {
      scoreCalc()
      setTimeout(() => {
        tiedGame()
      }, 500);

    }
    else {
      swapTurn()
      setTurn()
      setBoardHoverClass()
    }
  }
}


function getCPUMove() {
  const unmarkedCells = [...cells].filter((cell) => !cell.classList.contains(X_class) && !cell.classList.contains(O_class));
  const randomIndex = Math.floor(Math.random() * unmarkedCells.length);
  const cell = unmarkedCells[randomIndex];
  placeMark(cell, cpuMark);
  if (winnerCalc()) {
    scoreCalc();
    classWin()
    setTimeout(() => {
      endGame()
    }, 500);
  }
  else if (isDraw()) {
    scoreCalc();

    setTimeout(() => {
      tiedGame()
    }, 500);
  } else {
    swapTurn()
    setTurn()
    setBoardHoverClass()
  }

}
function isDraw() {
  return [...cells].every((cell) => {
    return cell.dataset.cel === "o" || cell.dataset.cel === "x";
  });
}
function placeMark(cell, currentClass) {
  cell.classList.add(currentClass)
  cell.setAttribute("data-cel", currentClass);
}
function setTurn() {
  const mark = O_turn ? O_class : X_class;

  const turnEl = document.querySelector(".turn");

  turnEl.innerHTML = `<svg class="gameplay__turn-icon">
                      <use xlink:href="images/SVG/icon-${mark}-default.svg#icon-${mark}-default"></use>
                      </svg>  
                      <h4>TURN</h4> `;
}
function swapTurn() {
  O_turn = !O_turn

}

function setBoardHoverClass() {
  board.classList.remove(O_class)
  board.classList.remove(X_class)


  if (O_turn) {
    board.classList.add(O_class)
  } else {
    board.classList.add(X_class)
  }


}
function tiedGame() {
  modal.style.opacity = "1";
  modal.style.zIndex = "1";

  backdrop.classList.remove("hide");
  modal.innerHTML = `
  <h2 class="heading bg">ROUND TIED </h2>

 

  <div class="modal__buttons">
    <button id="quit" class="quit" onclick="quitRound()">QUIT</button>
    <button id="next-round" class="next-round" onclick="nextRoundBtn()">NEXT ROUND</button>
  </div>
  `;
}
function classWin() {
  cells[a].classList.add("win");
  cells[c].classList.add("win");
  cells[b].classList.add("win");

}
function endGame() {
  let setting = {
    M: cells[a].dataset.cel === "o" ? O_icon : X_icon,
    color:
      cells[a].dataset.cel === "o"
        ? "--color-light-yellow"
        : "--color-light-blue",
    player: cells[a].dataset.cel === "o" ? "2" : "1",
    cpuWin:
      (cells[a].dataset.cel === "x" && X === "YOU") ||
        (cells[a].dataset.cel === "o" && O === "YOU")
        ? "YOU WON!"
        : "OH NO, YOU LOST...",
  };

  modal.style.opacity = "1";
  modal.style.zIndex = "1";

  backdrop.classList.remove("hide");
  if (gameMode === "vsplayer") {
    modal.innerHTML = `
    <h2 class="heading">PLAYER ${setting.player} WINS!</h2>
  
    <h4 class="heading-lg" style="color : var(${setting.color})">${setting.M} TAKES THE ROUND</h4>
  
    <div class="modal__buttons">
      <button id="quit" class="quit" onclick="quitRound()">QUIT</button>
      <button id="next-round" class="next-round" onclick="nextRoundBtn()">NEXT ROUND</button>
    </div>
    `;
  } else {
    modal.innerHTML = `
    <h2 class="heading">${setting.cpuWin}</h2>
  
    <h4 class="heading-lg" style="color : var(${setting.color})">${setting.M} TAKES THE ROUND</h4>
  
    <div class="modal__buttons">
      <button id="quit" class="quit" onclick="quitRound()">QUIT</button>
      <button id="next-round" class="next-round" onclick="nextRoundBtn()">NEXT ROUND</button>
    </div>
    `;
  }
}

function clean() {
  cells.forEach((clss) => {
    clss.classList.remove(O_class)
    clss.classList.remove(X_class)
    clss.dataset.cel = "";
    clss.classList.remove("win");
  });
  setTurn();
  isWinner = false;
  O_turn = false;
  scoreState()
  winnerCalc()
}
function cancel() {
  backdrop.classList.add("hide");
  modal.style.opacity = "0";
  modal.style.zIndex = "-1";
}
function nextRoundBtn() {
  cancel();
  startGame()
  clean();

}
function restartGame() {
  cancel()
  gameContainer.classList.remove("hide");
  startBtn.classList.add("hide");
  scorePlayer1 = 0;
  scorePlayer2 = 0;
  ties = 0;
  clean();

}
function quitRound() {
  restartGame();
}
restartBtn.addEventListener("click", function () {
  modal.style.opacity = "1";
  modal.style.zIndex = "1";

  backdrop.classList.remove("hide");
  modal.innerHTML = `
  <h2 class="heading bg">RESTART GAME?</h2>

 

  <div class="modal__buttons">
    <button id="quit" class="quit" onclick="cancel()">NO, CANCEL</button>
    <button id="next-round" class="next-round" onclick="restartGame()">YES, RESTART</button>
  </div>
  `;
});