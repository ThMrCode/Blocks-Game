// © 2024 ThMrCode (Misael Fernández Prada). Todos los derechos reservados.
import { Data } from "./data.js" 
import { Box, Img, Grid } from "./graphics.js"
import { Utils, Logic } from "./logics.js";
const ctx = document.getElementById('gameCanvas').getContext('2d');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const score = document.getElementById("score");
const lines = document.getElementById("lines");
const level = document.getElementById("level");
const sound = new Audio("../resources/sound.mp3"); sound.loop=true;


class Game {
    constructor(data_,ctx_) {
        this.data = data_;
        this.grid_controler = new Grid(data_,ctx_);
        this.logic = new Logic(data_,this.grid_controler);
        this.imageStop = true;
        this.images = [];
        this.counter = 1;
        this.life = true;
        this.score = 0;
        this.lines = 0;
        this.reset();
    }
    reset() {
        // Reset de grid y de variables
        this.grid_controler.reset();
        this.grid_controler.clearAll();
        this.imageStop = true;
        this.images = [];
        this.counter = 1;
        this.life = true;
        this.score = 0;
        this.lines = 0;
    }
    frame() {
        this.grid_controler.drawClearAll();
    }
    frameDead() {
        // Frame Game Over
        this.grid_controler.clearAll();
        this.grid_controler.drawDead(this.score);
    }
    move(key) {
        // Funcion traductora de teclas a acciones (uso de logic, grid y sound)
        if(this.counter != 1 && this.life) {
            if(key == "KeyA") {
                if(this.logic.verify_move_img(this.images[this.images.length-1],-1,0)) {
                    this.logic.move_img(this.images[this.images.length-1],-1,0);
                    this.frame();
                }
            }
            else if(key == "KeyD"){
                if(this.logic.verify_move_img(this.images[this.images.length-1],1,0)) {
                    this.logic.move_img(this.images[this.images.length-1],1,0);
                    this.frame();
                }
            }
            else if(key == "KeyW"){
                if(this.logic.verify_move_img(this.images[this.images.length-1],0,-1)) {
                    this.logic.move_img(this.images[this.images.length-1],0,-1);
                    this.frame();
                }
            }
            else if(key == "KeyS"){
                if(this.logic.verify_move_img(this.images[this.images.length-1],0,1)) {
                    this.logic.move_img(this.images[this.images.length-1],0,1);
                    this.frame();
                }
            }
            else if(key == "Space") {
                if(this.logic.verify_rotate_img(this.images[this.images.length-1],1)) {
                    this.logic.rotate_img(this.images[this.images.length-1],1);
                }
            }
            else if(key == "KeyE") {
                if(this.logic.verify_rotate_img(this.images[this.images.length-1],1)) {
                    this.logic.rotate_img(this.images[this.images.length-1],1);
                }
            }
            else if(key == "KeyQ") {
                if(this.logic.verify_rotate_img(this.images[this.images.length-1],-1)) {
                    this.logic.rotate_img(this.images[this.images.length-1],-1);
                }
            }
            else if(key == "Escape") {
                // Button Music
                if(sound.paused) {
                    sound.play();
                }
                else {
                    sound.pause();
                    sound.currentTime = 0; 
                } 
            }
        }
    }
    logic_sands() {
            // Logica de sands
            let verify = this.logic.verify_rows();
            this.score += verify.score;
            this.lines += verify.rows.length;
            this.logic.move_sands(); 
            let total_ids = new Set();
            for (let i = 0; i < verify.rows.length; i++) {
                let ids = this.logic.pop_row(verify.rows[i]);
                total_ids = new Set([...total_ids,...ids])
            }
            // Actualizar Box Sands
            this.logic.acctually_sands(total_ids);
            // Quitar Imagenes Sands de Images
            this.images = this.images.filter(obj => !total_ids.has(obj.id));
    }
    logic_move() {
        // Mover imagenes, verificar Life
        for (let i = 0; i < this.images.length; i++) {
            if(this.logic.verify_move_img(this.images[i],0,1)) {
                this.logic.move_img(this.images[i],0,1);
            }
            else if(i == (this.images.length-1)) {
                if(this.images[i].y < 4) {
                    this.life = false;
                    this.counter = 0;
                }
                this.imageStop = true;
            }
        }
    }
    loop() {
        // Bucle Principal del Juego
        if(this.life) {
            // Generar Imagen
            if(this.imageStop || this.images.length == 0) {
                // A veces sera 0 el length por bugs entre sands y move 
                this.images.push(this.logic.spawn_img(this.counter));
                this.imageStop = false;
            }
            // Logica de sands
            this.logic_sands();
            // Mover imagenes, verificar Life
            this.logic_move();
            // Actualizar Frame
            this.frame();
            this.counter++; 
            console.log(this.images);
        } 
    }
    
}

const speed = 200;
let loop;
let game;

// Start Variables
async function start(params) {
    let response = await fetch("../resources/blocks.json");
    let json = await response.json();
    let data = new Data(json);
    game = new Game(data,ctx);
}
start();

// Event Listeners
document.addEventListener("keydown", (e)=>{
    game.move(e.code);
});
startButton.addEventListener('click', () => {
    game.reset();
    sound.play();
    loop = setInterval(() => {
        score.textContent = game.score;
        lines.textContent = game.lines;
        level.textContent = 1;
        if(game.life) game.loop();
        else {
            game.frameDead(game.score);
            clearInterval(loop);
        }
    }, speed);
});
resetButton.addEventListener('click', () => {
    clearInterval(loop);
    sound.pause();
    sound.currentTime = 0;
    game.reset();
});
