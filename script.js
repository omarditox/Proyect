const isGitHubPages = window.location.hostname.includes('github.io');
const basePath = isGitHubPages ? '/Proyect/' : './';

// Cartas
const allCards = [
    'aycabron', 'cat_o_O', 'cat_smoke', 'cat_w_',
    'catlol', 'catZzz', 'esqueleto', 'ommmm',
    'pensamiento', 'rock', 'Silly_Dog', 'swag'
];

// Elementos
const gameBoard = document.getElementById('gameBoard');
const attemptsDisplay = document.getElementById('attempts');
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const difficultySelect = document.getElementById('difficulty');

// Variables del juego
let attempts = 0;
let flippedCards = [];
let matchedPairs = 0;
let timer;
let seconds = 0;
let gameCards = [];
let maxTime = 120;

// Sonidos
const soundStart = new Audio('Audio/sound-gamestart.mp3');
const soundMatch = new Audio('Audio/sound-acertado.mp3');
const soundWin = new Audio('Audio/sound-gamewin.mp3');
const soundLose = new Audio('Audio/sound-gamelose.mp3');

// Iniciar juego
function startGame() {
    soundStart.play().catch(e => console.log("No se pudo reproducir sonido:", e));

    const difficulty = difficultySelect.value;
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

    const selectedCards = shuffleArray(allCards).slice(0, pairCount);
    gameCards = [...selectedCards, ...selectedCards].sort(() => Math.random() - 0.5);

    createBoard();
    resetStats();
}

// Crear tablero
function createBoard() {
    gameBoard.innerHTML = '';
    gameCards.forEach((imgName, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.index = index;

        const img = document.createElement('img');
        img.src = `${basePath}Imagenes/${imgName}.jpg`;
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
    const [card1, card2] = flippedCards;
    const img1 = card1.querySelector('img').src;
    const img2 = card2.querySelector('img').src;

    if (img1 === img2) {
        matchedPairs++;
        soundMatch.play().catch(e => console.log("No se pudo reproducir sonido:", e));

        if (matchedPairs === gameCards.length / 2) {
            clearInterval(timer);
            soundWin.play().catch(e => console.log("No se pudo reproducir sonido:", e));
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

// Temporizador
function startTimer() {
    clearInterval(timer);
    seconds = 0;
    timerDisplay.textContent = seconds;

    timer = setInterval(() => {
        seconds++;
        timerDisplay.textContent = seconds;

        if (seconds >= maxTime) {
            clearInterval(timer);
            soundLose.play().catch(e => console.log("No se pudo reproducir sonido:", e));
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

startBtn.addEventListener('click', startGame);
