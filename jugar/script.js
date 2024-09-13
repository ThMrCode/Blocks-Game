// Referencias
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');

// Recuerda, la ejecucion de una funcion asincrona es hacer su parte sincrona y añadir su parte asincrona como una microtarea a la cola una vez añadida, termina su ejecucion
// Recuerda, cuando se termina una promesa, la ultima linea de esta es añadir su then o catch a la cola de microtareas

fetch("../resources/blocks.json")
    .then(response => {
        if(!response.ok) throw new Error("Error al cargar bloques");
        return response.json();
    })
    .then(data => {
        console.log(data)
    })
    .catch(err => {
        throw new Error("Error al leer bloques");
    })
    
function startGame() {
    console.log("Juego Iniciado");
}

function resetGame() {
    console.log("Juego Reiniciado");
}

// Event Listeners
startButton.addEventListener('click', startGame);
resetButton.addEventListener('click', resetGame);
