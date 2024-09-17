// © 2024 ThMrCode (Misael Fernández Prada). Todos los derechos reservados.
import { Data } from "./data.js" 
import { Box, Img, Grid } from "./graphics.js"
import { Utils, Logic } from "./logics.js";
const ctx = document.getElementById('gameCanvas').getContext('2d');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
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
        this.reset();
    }
    reset() {
        this.grid_controler.reset();
        this.grid_controler.clearAll();
        this.imageStop = true;
        this.images = [];
        this.counter = 1;
        this.life = true;
        this.score = 0;
    }
    frame() {
        this.grid_controler.drawClearAll();
    }
    frameDead() {
        this.grid_controler.clearAll();
    }
    move(key) {
        if(this.counter != 1) {
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
            else if(key == "KeyR") {
                if(this.logic.verify_rotate_img(this.images[this.images.length-1],-1)) {
                    this.logic.rotate_img(this.images[this.images.length-1],-1);
                }
            }
            else if(key == "Escape") {
                // Button Music
                if(sound.paused()) {
                    sound.play();
                }
                else {
                    sound.pause();
                    sound.currentTime = 0; 
                } 
            }
        }
    }
    loop() {
        if(this.life) {
            if(this.imageStop) {
                this.images.push(this.logic.spawn_img(this.counter));
                this.imageStop = false;
            }
            this.logic.move_sands();
            for (let i = 0; i < this.images.length; i++) {
                if(this.logic.verify_move_img(this.images[i],0,1)) {
                    this.logic.move_img(this.images[i],0,1);
                }
                else if(i == (this.images.length-1)) {
                    if(this.images[i].y < 4) this.life = false;
                    this.imageStop = true;
                }
            }
            game.frame();
            this.counter++; 
        } 
        else {
            this.frameDead();
        } 
    }
    
}

const speed = 200;
let loop;
let game;

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
    sound.play();
    loop = setInterval(() => {
        game.loop();
    }, speed);
});
resetButton.addEventListener('click', () => {
    clearInterval(loop);
    sound.pause();
    sound.currentTime = 0;
    game.reset();
});
