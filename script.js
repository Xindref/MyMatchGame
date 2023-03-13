const gameContainer = document.getElementById("game");
let prevImg;
let canGuess = true;
let matchCount = 0;
let scoreText = document.querySelectorAll(".score");
let score = 0;
let imgArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];
let shuffledImgs = shuffle(imgArray);

if (!localStorage.getItem("Match Count")) {
  localStorage.setItem("Match Count", 12);
}


PlaySound = function (sound, loop) {
  var audio = new Audio(`sounds/${sound}.mp3`);
  audio.loop = loop;
  audio.play();
  return audio;
}

function squaresInPlay(count) {
  let newArray = [];
  while (newArray.length < count) {
    let randNum = Math.floor((Math.random() * 30) + 1);
    if (!newArray.includes(shuffledImgs[randNum])) {
      newArray.push(shuffledImgs[randNum]);
      newArray.push(shuffledImgs[randNum]);
    }
  }
  shuffle(newArray);
  for (let i = 0; i < newArray.length; i++) {
    // create a new div
    const newDiv = document.createElement("div");
    const newImg = document.createElement("img");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(newArray[i]);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    newDiv.append(newImg);
    gameContainer.append(newDiv);
  }
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

// TODO: Implement this function!
function handleCardClick(event) {
  // you can use event.target to see which element was clicked
  //console.log("you just clicked", event.target.getAttribute('class'));
  if (canGuess && !imgArray.includes(event.target.getAttribute("class"))) {
    event.target.children[0].src = `memes/${event.target.getAttribute("class")}.jpg`;
    PlaySound("cardFlip", false);
    if (prevImg === undefined) {
      prevImg = event.target;
    }
    else if (prevImg.getAttribute("class") === event.target.getAttribute("class")) {
      canGuess = false;
      prevImg = undefined;
      matchCount++;
      score += 100;
      PlaySound("matchMade", false);
      scoreText.forEach(function (e) {
        e.innerText = score;
      })
      setTimeout(function () {
        canGuess = true;
      }, 1000);

      if (matchCount === gameContainer.childElementCount / 2) {
        console.log("You Win!");
        if (score > parseInt(localStorage.getItem("Top Score")) || !localStorage.getItem("Top Score")) {
          localStorage.setItem("Top Score", score);
        }
        document.querySelectorAll(".topScore").forEach(function (item) {
          item.innerText = localStorage.getItem("Top Score");
        });
        document.querySelector("#winScreenContainer").style.zIndex = "10";
        document.querySelector("#winScreen").hidden = false;
        PlaySound("gameWin", false);
      }
    }
    else {
      event.target.children[0].src = `memes/${event.target.getAttribute("class")}.jpg`;
      canGuess = false;
      score -= 10;
      PlaySound("noMatch", false);
      scoreText.forEach(function (e) {
        e.innerText = score;
      })
      setTimeout(function () {
        event.target.children[0].src = "";
        prevImg.children[0].src = "";
        prevImg = undefined;
        canGuess = true;
      }, 1000);
    }
  }
}

// when the DOM loads
let menuMusic = PlaySound("mainMenuTheme", true);

document.getElementById("cardCount").value = localStorage.getItem("Match Count");
document.querySelector(".matchCount").innerText = `Match Count: ${localStorage.getItem("Match Count")}`;
document.querySelector("#mainMenuNewGame").addEventListener("click", function (e) {
  e.preventDefault();
  document.querySelector("#mainMenu").hidden = true;
  squaresInPlay(localStorage.getItem("Match Count"));
  menuMusic.pause();
  PlaySound("mainGameTheme", true);
});

document.getElementById("newGameBtn").addEventListener("click", function () {
  location.reload();
});

document.getElementById("playAgain").addEventListener("click", function () {
  gameContainer.innerHTML = "";
  score = 0;
  matchCount = 0;
  scoreText.forEach(function (e) {
    e.innerText = score;
  })
  document.getElementById("winScreen").hidden = true;
  document.querySelector("#winScreenContainer").style.zIndex = "-1";
  squaresInPlay(localStorage.getItem("Match Count"));
});

document.getElementById("goToMain").addEventListener("click", function () {
  location.reload();
});

document.querySelector("#cardCount").addEventListener("change", function () {
  document.querySelector(".matchCount").innerText = `Match Count: ${document.getElementById("cardCount").value}`;
  localStorage.setItem("Match Count", document.getElementById("cardCount").value);
});

if (!localStorage.getItem("Top Score")) {
  localStorage.setItem("Top Score", 0);
} else {
  document.querySelectorAll(".topScore").forEach(function (item) {
    item.innerText = localStorage.getItem("Top Score");
  });
}
