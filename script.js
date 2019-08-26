var emojiList = ['🐰', '🐰', '🐼', '🐼',
'🐱', '🐱', '🐭', '🐭',
'🐹', '🐹', '🐻', '🐻'];

function cardRotating(clickedElement) {
  if (clickedElement.dataset.isOpen === '0') {
    clickedElement.classList.add('openedCard');
    clickedElement.dataset.isOpen = '1';
  }
  else {
    clickedElement.classList.remove('openedCard');
    clickedElement.dataset.isOpen = '0';
    clickedElement.lastElementChild.classList.remove('wrongChoice');
    clickedElement.lastElementChild.classList.remove('rightChoice');
  }
}

function cardClickHandler(event) {
  let clickedElement = event.currentTarget;
  if (game.isFirstClick) {
    game.startTimer();
  }
  if (clickedElement.dataset.isOpen === '0') {
    game.chosenCards.push(clickedElement);
    if (game.chosenCards.length === 1) {
      cardRotating(clickedElement);
    }
    else if (game.chosenCards.length === 2) {
      if (game.chosenCards[0].lastElementChild.innerHTML ===
        clickedElement.lastElementChild.innerHTML) {
        game.chosenCards[0].lastElementChild.classList.add('rightChoice');
        clickedElement.lastElementChild.classList.add('rightChoice');
        cardRotating(clickedElement);
        game.openedCardCounter++;
        if (game.openedCardCounter === 6) {
          game.gameOverStatus = "Win";
          game.stopGame();
        }
        game.chosenCards = [];
      }
      else {
        game.chosenCards[0].lastElementChild.classList.add('wrongChoice');
        clickedElement.lastElementChild.classList.add('wrongChoice');
        cardRotating(clickedElement);
      }
    }
    else if (game.chosenCards.length === 3) {
      game.chosenCards.forEach(item => {cardRotating(item)});
      game.chosenCards = [clickedElement];
    }
  }
}

function Game() {
  this.chosenCards = [];
  this.isFirstClick = true;
  this.openedCardCounter = 0;
  this.gameOverStatus = "Lose";
  this.timer = 60;
  this.timerId;
  this.timerTimeout;
  this.cards = Array.from(document.getElementsByClassName('emojiCard'));
  this.fieldGenerator = function () {
    document.getElementById('timer').innerHTML = '1:00';
    emojiList.sort((a,b) => {
      return Math.random() - 0.5;
    });
    this.cards.forEach(function(item, i, arr){
      if (item.dataset.isOpen === '1') {
        cardRotating(item);
      }
      item.lastElementChild.innerHTML = emojiList[i];
      item.addEventListener('click', cardClickHandler);
    });
    return undefined;
  }
  this.startGame = function() {
    this.fieldGenerator();
  }
  this.startTimer = function() {
    let toFinishGame = this.stopGame.bind(this);
    this.isFirstClick = false;
    this.timerId = setInterval(function() {
      game.timer--;
      if (game.timer >= 0) {
        if (game.timer >= 10) document.getElementById('timer').innerHTML = '0:' + game.timer;
        else document.getElementById('timer').innerHTML = '0:0' + game.timer;
      }
    }, 1000);
    this.timerTimeout = setTimeout(toFinishGame, 60000);
  }

  this.stopGame = function() {
    let gameOverStatusForHTML = this.finalWindowHeaderGenerator(this.gameOverStatus);
    if (this.gameOverStatus === "Win") clearTimeout(this.timerTimeout);
    clearInterval(this.timerId);
    document.getElementById('finalWindowHeader').innerHTML = gameOverStatusForHTML;
    document.getElementById('finalWindowContainer').classList.add('gameOver');
  }

  this.finalWindowHeaderGenerator = function(gameOverStatus) {
    let newGameOverStatus = "";
    for (let i = 0; i < gameOverStatus.length; i++) {
      newGameOverStatus += "<span>" + gameOverStatus[i] +"</span>";
    }
    return newGameOverStatus;
  }
}

var game = new Game();
game.startGame();
var tryAgain = document.getElementById('tryAgain');
tryAgain.addEventListener('click', function() {
  document.getElementById('finalWindowContainer').classList.remove('gameOver');
  game = new Game();
  game.startGame();
});
