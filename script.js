const allCards = [
    'aycabron', 'cat_o_O', 'cat_smoke', 'cat_w_',
    'catlol', 'catZzz', 'esqueleto', 'ommmm',
    'pensamiento', 'rock', 'Silly_Dog', 'swag'
];

// Elementos
let gameBoard = document.getElementById('gameBoard');
let attemptsDisplay = document.getElementById('attempts');
let timerDisplay = document.getElementById('timer');
let startBtn = document.getElementById('startBtn');
let difficultySelect = document.getElementById('difficulty');

// Variables del juego
let attempts = 0;
let flippedCards = [];
let matchedPairs = 0;
let timer;
let seconds = 0;
let gameCards = [];
let maxTime = 120;

// Sonidos
const soundStart = new Audio('audio/sound-gamestart.mp3');
const soundMatch = new Audio('audio/sound-acertado.mp3');
const soundWin = new Audio('audio/sound-gamewin.mp3');
const soundLose = new Audio('audio/sound-gamelose.mp3');

// Iniciar juego
function startGame() {
    soundStart.play();

    let difficulty = difficultySelect.value;
    let pairCount;

    if (difficulty === 'facil') {
        pairCount = 6;
        maxTime = 50;
    } else if (difficulty === 'medio') {
        pairCount = 8;
        maxTime = 50;
    } else {
        pairCount = 12;
        maxTime = 60;
    }

    let selectedCards = shuffleArray(allCards).slice(0, pairCount);
    gameCards = [...selectedCards, ...selectedCards].sort(() => Math.random() - 0.5);

    createBoard();
    resetStats();
}

// tablero
function createBoard() {
    gameBoard.innerHTML = '';
    gameCards.forEach((imgName, index) => {
        let card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;

        let img = document.createElement('img');
        img.src = `/Imagenes/${imgName}.jpg`;
        img.alt = imgName;
        img.style.display = 'none';
        card.appendChild(img);

        card.addEventListener('click', flipCard);
        gameBoard.appendChild(card);
    });
}

// Voltear carta
function flipCard() {
    if (flippedCards.length === 2 || this.classList.contains('flipped')) return;

    this.classList.add('flipped');
    this.querySelector('img').style.display = 'block';
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        attempts++;
        attemptsDisplay.textContent = attempts;
        checkForMatch();
    }
}

// coincidencia
function checkForMatch() {
    let [card1, card2] = flippedCards;
    let img1 = card1.querySelector('img').src;
    let img2 = card2.querySelector('img').src;

    if (img1 === img2) {
        matchedPairs++;
        soundMatch.play();

        if (matchedPairs === gameCards.length / 2) {
            clearInterval(timer);
            soundWin.play();
            setTimeout(() => {
                alert(`¡Ganaste en ${attempts} intentos y ${seconds} segundos!`);
            }, 500);
        }
    } else {
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            card1.querySelector('img').style.display = 'none';
            card2.querySelector('img').style.display = 'none';
        }, 1000);
    }

    flippedCards = [];
}

// contador
function startTimer() {
    clearInterval(timer);
    seconds = 0;
    timerDisplay.textContent = seconds;

    timer = setInterval(() => {
        seconds++;
        timerDisplay.textContent = seconds;

        if (seconds >= maxTime) {
            clearInterval(timer);
            soundLose.play();
            setTimeout(() => {
                alert('¡Se acabó el tiempo! Debes mejorar...');
            }, 500);
        }
    }, 1000);
}

// Reiniciar estadísticas
function resetStats() {
    attempts = 0;
    matchedPairs = 0;
    seconds = 0;
    attemptsDisplay.textContent = attempts;
    timerDisplay.textContent = seconds;
    startTimer();
}

function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

// Evento
startBtn.addEventListener('click', startGame);
