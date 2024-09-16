// © 2024 ThMrCode (Misael Fernández Prada). Todos los derechos reservados.
import {Box,Img} from "./graphics.js"
import { Data } from "./data.js" 
const ctx = document.getElementById('gameCanvas').getContext('2d');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const sound = new Audio("../resources/sound.mp3"); sound.loop=true;
const data = new Data("../resources/blocks.json");

class Utils {
    static verify_range(num,min,max) {
        // Verifica si un numero se encuentra en un rango (inclusivo)
        if(num > max || num < min) return false;
        else return true;
    }
    static index(element,array) {
        // Verifica si un pot se encuentra en un array y devuelve su posicion
        for (let i = 0; i < array.length; i++) {
            if(element.x == array[i].x && element.y == array[i].y) return i;
        }
        return -1;
    }
    static pop_mul(pots,array) {
        // Metodo que elimina varios elementos de un array segun su posicion
    }
    static spawn_img(id, grid) {
        // Spawnea una imagen aleatoria de las opciones en data, (type, rotate, color)
        // La coloca en el grid (Boxs), y tambien retorna esta imagen
        let img_type = Math.floor(Math.random()*data.n_type);
        let img_rotate = Math.floor(Math.random()*data.n_rotate);
        let img_color = data.colors[Math.floor(Math.random()*data.n_color)];
        let img_x = Math.floor(Math.random()*(data.grid_w-3));
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if(data.images[img_type][img_rotate][i][j] == 1) {
                    grid[i][img_x + j] = new Box(id,img_color);
                }
            }
        }
        return new Img(img_x, 0, data.images[img_type][img_rotate], id, img_color,img_type,img_rotate);
    }
    static verify_move_img(img, grid, dx, dy) {
        // Funcion que se encarga de ver si una imagen (solida) puede moverse 
        // (segun limites del mapa y no chocar con otros bloques que lo impidan)
        // Devuelve el valor de si puede moverse o no
        let move = true;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if(img.shape[i][j] == 1) {
                    let new_y = img.y + i + dy;
                    let new_x = img.x + j + dx;
                    if(this.verify_range(new_x,0,(data.grid_w-1)) && this.verify_range(new_y,0,(data.grid_h-1))) {
                        if(grid[new_y][new_x].id != 0 && grid[new_y][new_x].id != img.id) {
                            move = false;
                            break;
                        }
                    }
                    else {
                        move = false;
                        break;
                    }
                }
            }
        }
        return move;
    }
    static move_img(img, grid, dx, dy) {
        // Funcion que mueve una imagen (su x, y) y tambien sus Boxs en el grid
        let pots = [];
        let pots_delete = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if(img.shape[i][j] == 1) {
                    pots.push({ y: (img.y + i + dy), x: (img.x + j + dx)});
                }
            }
        }
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if(img.shape[i][j] == 1) {
                    let pot = {y: (img.y + i),x: (img.x + j)};
                    let index = this.index(pot,pots);
                    if(index == -1) {
                        pots_delete.push(pot);
                    }
                }
            }
        }
        for (let i = 0; i < pots.length; i++) {
            grid[pots[i].y][pots[i].x] = new Box(img.id,img.color);
        }
        for (let i = 0; i < pots_delete.length; i++) {
            grid[pots_delete[i].y][pots_delete[i].x] = new Box(0,data.bg_color);
        }
        img.x = img.x + dx;
        img.y = img.y + dy;
    }
    static verify_rotate_img(img, grid, rotate) {
        // Funcion que verifica si una imagen puede rotar
        let new_rotate = (img.rotate + rotate) % data.n_rotate;
        let new_shape = data.images[img.type][new_rotate];
        let move = true;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if(new_shape[i][j] == 1) {
                    let new_y = img.y + i;
                    let new_x = img.x + j;
                    if(this.verify_range(new_x,0,(data.grid_w-1)) && this.verify_range(new_y,0,(data.grid_h-1))) {
                        if(grid[new_y][new_x].id != 0 && grid[new_y][new_x].id != img.id) {
                            move = false;
                            break;
                        }
                    }
                    else {
                        move = false;
                        break;
                    }
                }
            }
        }
        return move;
    }
    static rotate_img(img, grid, rotate) {
        // Funcion que rota la imagen (su shape) y sus Boxs en la grid
        let new_rotate = (img.rotate + rotate) % data.n_rotate;
        let new_shape = data.images[img.type][new_rotate];
        let pots = [];
        let pots_delete = [];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if(new_shape[i][j] == 1) {
                    pots.push({ y: (img.y + i), x: (img.x + j)});
                }
            }
        }
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if(img.shape[i][j] == 1) {
                    let pot = {y: (img.y + i),x: (img.x + j)};
                    let index = this.index(pot,pots);
                    if(index == -1) {
                        pots_delete.push(pot);
                    }
                }
            }
        }
        for (let i = 0; i < pots.length; i++) {
            grid[pots[i].y][pots[i].x] = new Box(img.id,img.color);
        }
        for (let i = 0; i < pots_delete.length; i++) {
            grid[pots_delete[i].y][pots_delete[i].x] = new Box(0,data.bg_color);
        }
        img.rotate = new_rotate;
        img.shape = new_shape;
    }
    static move_sands(grid) {
        for (let i = (data.grid_h-2); i >= 0; i--) {
            for (let j = 0; j < data.grid_w; j++) {
                if(grid[i][j].id != 0 && grid[i][j].sand && grid[i+1][j].id == 0) {
                    grid[i+1][j] = grid[i][j];
                    grid[i][j] = new Box(0,data.bg_color);
                }
            }
        }
    }
    static pop_row(grid,i) {
        for (let j = 0; j < data.grid_w; j++) {
            // Actualizar id sans de todos los cuadrados y de las imagenes
            grid[i][j].id
            grid[i][j] = new Box(0,data.bg_color);
        }
    }
    static verify_row(grid) {
        let same_color = true;
        for (let i = (data.grid_h-1); i >= 0; i--) {
            for (let j = 0; j < data.grid_w; j++) {
                if(grid[i][j].id != 0) {
                    this.draw(i,j,this.grid[i][j].color);
                }
            }
        }
    }
}

class Grid {
    constructor() {
        this.grid = new Array(data.grid_h);
        for (let i = 0; i < data.grid_h; i++) { this.grid[i] = new Array(data.grid_w).fill(new Box(0,data.bg_color)); }
    }
    reset() {
        this.grid = new Array(data.grid_h);
        for (let i = 0; i < data.grid_h; i++) { this.grid[i] = new Array(data.grid_w).fill(new Box(0,data.bg_color)); }
    }
    draw(i,j,color) {
        let y = (i - 4)*data.box_h;
        let x = j*data.box_w;
        ctx.fillStyle = color;
        ctx.fillRect(x,y,data.box_w,data.box_h);
    }
    clear(i,j) {
        this.draw(i,j,data.bg_color);
    }
    drawAll() {
        for (let i = 0; i < data.grid_h; i++) {
            for (let j = 0; j < data.grid_w; j++) {
                if(this.grid[i][j].id != 0) {
                    this.draw(i,j,this.grid[i][j].color);
                }
            }
        }
    }
    clearAll() {
        for (let i = 0; i < data.grid_h; i++) {
            for (let j = 0; j < data.grid_w; j++) {
                this.clear(i,j);
            }
        }
    }
}

class Game {
    constructor() {
        this.grid_controler = new Grid();
        this.imageStop = true;
        this.images = [];
        this.counter = 1;
        this.life = true;
        this.score = 0;
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
        this.grid_controler.clearAll();
        this.grid_controler.drawAll();
    }
    frameDead() {
        this.grid_controler.clearAll();
    }
    move(key) {
        if(this.counter != 1) {
            if(key == "KeyA") {
                if(Utils.verify_move_img(this.images[this.images.length-1],this.grid_controler.grid,-1,0)) {
                    Utils.move_img(this.images[this.images.length-1],this.grid_controler.grid,-1,0);
                    this.frame();
                }
            }
            else if(key == "KeyD"){
                if(Utils.verify_move_img(this.images[this.images.length-1],this.grid_controler.grid,1,0)) {
                    Utils.move_img(this.images[this.images.length-1],this.grid_controler.grid,1,0);
                    this.frame();
                }
            }
            else if(key == "KeyW"){
                if(Utils.verify_move_img(this.images[this.images.length-1],this.grid_controler.grid,0,-1)) {
                    Utils.move_img(this.images[this.images.length-1],this.grid_controler.grid,0,-1);
                    this.frame();
                }
            }
            else if(key == "KeyS"){
                if(Utils.verify_move_img(this.images[this.images.length-1],this.grid_controler.grid,0,1)) {
                    Utils.move_img(this.images[this.images.length-1],this.grid_controler.grid,0,1);
                    this.frame();
                }
            }
            else if(key == "Space") {
                if(Utils.verify_rotate_img(this.images[this.images.length-1],this.grid_controler.grid,1)) {
                    Utils.rotate_img(this.images[this.images.length-1],this.grid_controler.grid,1);
                }
            }
            else if(key == "KeyE") {
                if(Utils.verify_rotate_img(this.images[this.images.length-1],this.grid_controler.grid,1)) {
                    Utils.rotate_img(this.images[this.images.length-1],this.grid_controler.grid,1);
                }
            }
            else if(key == "KeyR") {
                if(Utils.verify_rotate_img(this.images[this.images.length-1],this.grid_controler.grid,-1)) {
                    Utils.rotate_img(this.images[this.images.length-1],this.grid_controler.grid,-1);
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
                this.images.push(Utils.spawn_img(this.counter,this.grid_controler.grid));
                this.imageStop = false;
            }
            Utils.move_sands(this.grid_controler.grid);
            for (let i = 0; i < this.images.length; i++) {
                if(Utils.verify_move_img(this.images[i],this.grid_controler.grid,0,1)) {
                    Utils.move_img(this.images[i],this.grid_controler.grid,0,1);
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


// Event Listeners
let game = new Game();
let loop = 0;
let speed = 200;
game.reset();
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
