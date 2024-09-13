// Referencias
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');

function startGame() {
    console.log("Juego Iniciado");
}

function resetGame() {
    console.log("Juego Reiniciado");
}

// Event Listeners
startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);
