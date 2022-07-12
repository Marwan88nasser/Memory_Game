// catch element
const startBtn = document.querySelector(".main-startBtn");
const playerNameInp = document.getElementById("player-name");
const splashScreen = document.querySelector(".splash-screen");
const wrongingMessage = document.querySelector(".wrong-message");
const gameStats = document.querySelector(".game-stats");
const playerNameContainer = document.querySelector(".player-name span");
const playerTriesContainer = document.querySelector(".player-tries span");
const gameTimerContainer = document.querySelector(".game-time span");
const blocksContainer = document.querySelector(".memory-blocks");
const memoryBlocks = document.querySelectorAll(".memory-box");
const flipDuration = 1000;
const orderRange = [...Array(memoryBlocks.length).keys()];
let playersStatsArray = [];

window.addEventListener("scroll", () => {
  window.scrollY >= blocksContainer.offsetTop
    ? gameStats.classList.add("spread")
    : gameStats.classList.remove("spread");
});

// check there are players Stats in localStorage to update with playersArr
if (localStorage.getItem("players-stats")) {
  playersStatsArray = JSON.parse(localStorage.getItem("players-stats"));
}

// get data form localStorage
getDataInLocalStorage();

// display splash Screen & reset page to top
window.onload = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
  setTimeout(() => (splashScreen.style.opacity = "1"), 290);
};

// scroll into leaderBored section on click show-leaderBoredBtn
document
  .querySelector(".show-leaderBoredBtn")
  .addEventListener("click", (e) => {
    if (localStorage.getItem("players-stats")) {
      document.querySelector(`.${e.target.dataset.section}`).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      Swal.fire({
        icon: "error",
        text: "There's No Player To Show LeaderBored",
        showConfirmButton: false,
        timer: 2100,
      });
    }
  });

// show leaderBoard if player click on show leaderBoard btn
document
  .querySelector(".splashBtn-leaderBored")
  .addEventListener("click", () => {
    if (localStorage.getItem("players-stats")) {
      startBtn.parentElement.style.visibility = "hidden";
      // scroll into leaderBoard
      document.querySelector(".leader-board").scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      // create start btn game
      const beginGame = document.createElement("button");
      beginGame.className = "startPlay-btn btn btn-danger";
      beginGame.textContent = "Start The Game";
      document.body.prepend(beginGame);
      // start the game if player click on start game btn
      beginGame.addEventListener("click", () => {
        startBtn.parentElement.style.visibility = "visible";
        startGame();
      });
    } else {
      Swal.fire({
        icon: "error",
        text: "There's No Player To Show LeaderBored",
        showConfirmButton: false,
        timer: 2100,
      });
    }
  });

// if player press enter key start the action game
playerNameInp.addEventListener("keyup", (e) => {
  if (e.key == "Enter") {
    // action to start game
    startGame();
  }
});

startBtn.addEventListener("click", () => {
  // action to start game
  startGame();
});

// action to start game
function startGame() {
  const playerName = playerNameInp.value;
  // check if playerName has value
  if (playerName) {
    window.scrollTo({
      top: blocksContainer.offsetTop,
      left: 0,
      behavior: "smooth",
    });
    // check of player don't write name
    if (playerName == " ") {
      playerNameContainer.innerHTML = "Unknown";
      // remove the start screen
      startBtn.parentElement.remove();
      // run show blocks screen
      showBlocks(200);
      // start timer
      countdownTimer();
      // reset scrolling of page
      document.body.style.overflow = "auto";
    } else {
      // set the playerName value
      playerNameContainer.innerHTML = playerName;
      // remove the start screen
      startBtn.parentElement.remove();
      // run show blocks screen
      showBlocks(200);
      // start timer
      countdownTimer();
      // reset scrolling of page
      document.body.style.overflow = "auto";
    }
  } else {
    // if player don't set has name show wronging message
    wrongingMessage.style.opacity = "1";
    // undisplayed wronging message
    setTimeout(() => (wrongingMessage.style.opacity = "0"), 3700);
  }
}

// shuffle order Range
shuffle(orderRange);

memoryBlocks.forEach((box, index) => {
  // change order of blocks
  box.style.order = orderRange[index];
  // set flipBox function on all blocks
  box.addEventListener("click", () => flipBox(box));
});

function flipBox(SelectedBox) {
  // add flipped Box that clicked
  SelectedBox.classList.add("flipped");
  // collect All flipped box
  const allFlippedBlocks = Array.from(memoryBlocks).filter((flippedBox) =>
    flippedBox.classList.contains("flipped")
  );
  // check of two blocks flipped
  if (allFlippedBlocks.length === 2) {
    // stop clicking
    stopClick();
    // check matched block
    matchedBlocks(allFlippedBlocks[0], allFlippedBlocks[1]);
  }
}

// stop clicking
function stopClick() {
  // set stop clicking class
  blocksContainer.classList.add("stop-click");
  // remove stop clicking after flip duration
  setTimeout(
    () => blocksContainer.classList.remove("stop-click"),
    flipDuration
  );
}

// check matched block
function matchedBlocks(firstBlock, secondBlock) {
  if (firstBlock.dataset.game === secondBlock.dataset.game) {
    // remove flipped class
    firstBlock.classList.remove("flipped");
    secondBlock.classList.remove("flipped");

    // add matched class
    firstBlock.classList.add("matched");
    secondBlock.classList.add("matched");

    // check if game Completed
    checkCompleteGame();
    // set sound effect success
    document.getElementById("success").play();
  } else {
    // increase the tries
    playerTriesContainer.innerHTML++;
    setTimeout(() => {
      // remove flipped class
      firstBlock.classList.remove("flipped");
      secondBlock.classList.remove("flipped");
      // set sound effect error
      document.getElementById("error").play();
    }, flipDuration);
  }
}

// show blocks before start game
function showBlocks(extraTime) {
  setTimeout(() => {
    memoryBlocks.forEach((box) => {
      // add flipped class on all blocks
      box.classList.add("flipped");
      // remove flipped class
      setTimeout(() => {
        box.classList.remove("flipped");
      }, flipDuration + extraTime);
    });
  }, 500);
}

// check if game Completed
function checkCompleteGame() {
  // check if all blocks were complete
  if (checkBlocksMatched() === memoryBlocks.length) {
    Swal.fire({
      icon: "success",
      title: "Congratulations, You Finished The Game",
      text: "Do You Want To Play Again",
      showDenyButton: true,
      // check player want play another game
    }).then((answer) => {
      if (answer.isConfirmed) {
        // start another game
        startAnotherGame();
        // start timer
        countdownTimer();
      } else {
        // reset the game
        location.reload();
      }
    });
  }
}

// start another game
function startAnotherGame() {
  // reset the player Tries Container
  playerTriesContainer.innerHTML = "";
  // run shuffle order Range
  shuffle(orderRange);
  // restart game actions
  memoryBlocks.forEach((box, index) => {
    box.classList.remove("matched");
    // after part of second change order of blocks
    setTimeout(() => (box.style.order = orderRange[index]), 100);
  });
  // run show blocks function after part of seconds
  setTimeout(() => showBlocks(250), 400);
}

// start the timer
function countdownTimer() {
  // reset the timer
  gameTimerContainer.innerHTML = "0:00";
  // main timer min
  const timerMinutes = 2;
  // main timer sec according the main timer min
  let totalTimeSeconds = timerMinutes * 60;

  const handlerTimer = setInterval(() => {
    const minutes = Math.floor(totalTimeSeconds / 60); // Get number of min from the total number of sec
    const seconds = totalTimeSeconds % 60; // Get the remaining seconds from the total number of seconds
    // set time of the timer
    gameTimerContainer.innerHTML = `${minutes} : ${seconds}`;
    totalTimeSeconds--;

    // check if game Complete to stop the time
    if (checkBlocksMatched() === memoryBlocks.length) {
      clearInterval(handlerTimer);
      // collect players stats when game complete & timer stop
      collectData(
        playerNameContainer.innerHTML,
        gameTimerContainer.innerHTML,
        playerTriesContainer.innerHTML
      );
    }

    // check if time end
    if (minutes === 0 && seconds === 0) {
      // collect players stats
      collectData(
        playerNameContainer.innerHTML,
        "Full The Time",
        playerTriesContainer.innerHTML
      );
      // stop timer
      clearInterval(handlerTimer);
      // reset the game if the time end
      Swal.fire({
        icon: "error",
        title: "Oops..., Time's up, you lost the game",
        text: "Do You Want To Play Again",
        showDenyButton: true,
        // check player want play another game
      }).then((answer) => {
        if (answer.isConfirmed) {
          // start another game
          startAnotherGame();
          // start timer
          countdownTimer();
        } else {
          // reset the game
          location.reload();
        }
      });
    }
  }, 1000);
}

// check if all Blocks contains Matched class
function checkBlocksMatched() {
  const matchedBlocksArr = [];
  memoryBlocks.forEach((box) => {
    // check if every single blocks contains matched class
    if (box.classList.contains("matched")) {
      // push box that contains matched class
      matchedBlocksArr.push(box);
    }
  });
  return matchedBlocksArr.length;
}

// collect players stats
function collectData(name, time, wrongTries) {
  const playerStats = {
    playerName: name,
    playerTimeTaken: time,
    playerWrongTries: wrongTries,
    gameDate: new Date().toLocaleString(),
  };
  // push player Stats into the array
  playersStatsArray.push(playerStats);
  // add Data to localStorage
  setDataInLocalStorage(playersStatsArray);
}

// add Data to localStorage
function setDataInLocalStorage(playerStatsArray) {
  localStorage.setItem("players-stats", JSON.stringify(playerStatsArray));
}

// get data from local storage and stor it
function getDataInLocalStorage() {
  const savedPlayersStats = localStorage.getItem("players-stats");
  if (savedPlayersStats) {
    const allData = JSON.parse(localStorage.getItem("players-stats"));
    // view players Stats
    viewPlayersStats(allData);
  }
}

function viewPlayersStats(allData) {
  // start create leader board
  const lbContainer = document.createElement("div");
  const leaderBoardTitle = document.createElement("h3");
  leaderBoardTitle.className = "leaderBoard-Title p-3 text-center mb-4";
  leaderBoardTitle.textContent = "leaderBoard List";
  lbContainer.className = "leader-board text-white p-3 mt-4";
  // loop on ever player in localStorage
  allData.forEach((player) => {
    editDate(player.gameDate);
    const playerStats = document.createElement("div");
    playerStats.className =
      "player-stats p-2 mb-3 d-flex flex-wrap align-items-center justify-content-between";
    playerStats.innerHTML = `
    <div class= "py-1 px-2 m-1 rounded-3">Player Name : <span>${
      player.playerName
    } </span></div>
    <div class= "py-1 px-2 m-1 rounded-3">Time Taken : <span>${
      player.playerTimeTaken
    } </span></div>  
    <div class= "py-1 px-2 m-1 rounded-3">Wrong Tries : <span>${
      player.playerWrongTries
    } </span></div>  
    <div class= "py-1 px-2 m-1 rounded-3">Game Date : <span>${editDate(
      player.gameDate
    )}</span></div>
    `;
    // append to leader board
    lbContainer.appendChild(playerStats);
  });
  // append to the page
  blocksContainer.after(lbContainer);
  lbContainer.prepend(leaderBoardTitle);
  // hidden timer & wrong tries
  window.addEventListener("scroll", () => {
    window.scrollY >= lbContainer.offsetTop - 115
      ? gameStats.classList.remove("spread")
      : "";
  });
}

// shuffle order Range
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
  return array;
}

function editDate(gameDate) {
  const compDate = `${gameDate
    .split(" ")[0]
    .slice(0, gameDate.split(" ")[0].lastIndexOf("/"))} ${gameDate
    .split(" ")[1]
    .slice(0, gameDate.split(" ")[1].lastIndexOf(":"))} ${
    gameDate.split(" ")[2]
  }`;
  return compDate;
}
