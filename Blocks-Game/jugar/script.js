// © 2024 ThMrCode (Misael Fernández Prada). Todos los derechos reservados.

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');

class Data {
    constructor() {
        this.resources = "https://thmrcode.com/Blocks-Game/resources/blocks.json";
        fetch(this.resources)
        .then(response => { if(!response.ok) throw new Error("Error Blocks"); return response.json();})
        .then(data => {this.images = data.images})
        this.colors = ['#FF4500', '#00FF00', '#1E90FF', '#FFD700', '#FF69B4'];
        this.n_color = this.colors.length; this.n_type = 5; this.n_rotate = 4;
        this.bg_color = "#000"; this.line_color = "#fff";
        this.h = 400;  this.w = 300;
        this.box_h = 20;   this.box_w = 20;
        this.grid_h = 24; this.grid_w = 15;
    }
}

const data = new Data();

class Box {
    constructor(id_, color_) {
        this.id = id_;
        this.color = color_;
        this.sand = false;
    }
}
class Img {
    constructor(x_,y_,shape_,id_) {
        this.x = x_;
        this.y = y_;
        this.shape = shape_;
        this.id = id_;
        this.sand = false;
    }
}
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
    static spawn_img(id, grid) {
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
        return new Img(img_x,0,data.images[img_type][img_rotate],id);
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
                    if(index != -1) {
                        pots_delete.push(pot);
                        pots.pop(index);
                    }
                }
            }
        }
        for (let i = 0; i < pots.length; i++) {
            grid[pots[i].y][pots[i].x] = new Box(img.id,)
        }
        img.x = img.x + dx;
        img.y = img.y + dy;
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
}

class Grid {
    constructor() {
        this.grid = new Array(data.grid_h);
        for (let i = 0; i < data.grid_h; i++) { this.grid[i] = new Array(data.grid_w).fill(new Box(0,data.bg_color)); }
    }
    draw(i,j,color) {
        let y = (i - 4)*data.box_h;
        let x = j*data.box_w;
        ctx.fillStyle = color;
        ctx.lineWidth = 1;  ctx.strokeStyle = data.line_color;
        ctx.strokeRect(x,y,data.box_w,data.box_h);
    }
    clear(i,j) {
        this.draw(i,j,data.bg_color);
    }
    drawAll() {
        for (let i = 0; i < data.grid_h; i++) {
            for (let j = 0; j < data.grid_w; j++) {
                if(this.grid[i][j].id != 0) this.draw(i,j,this.grid[i][j].color);
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
        // solo para ids con sands falses
        // Primero hacer caer los sands y luego los images
        this.imageStop = true;
        this.images = [];
        this.counter = 1;
        this.life = true;
    }
    reset() {
        game.grid_controler.clearAll();
        this.imageStop = true;
        this.images = [];
        this.counter = 1;
        this.life = true;
    }
    loop() {
        //this.grid_controler.clearAll();
        if(this.imageStop) {
            this.images.push(Utils.spawn_img(this.counter,this.grid_controler.grid));
            this.imageStop = false;
        }
        //Utils.move_sands(this.grid_controler.grid);
        console.log(this.grid_controler.grid);
        for (let i = 0; i < this.images.length; i++) {
            //console.log(this.images[i].y);
            console.log(Utils.move_img(this.images[i],this.grid_controler.grid,0,1));
        }
        //this.grid_controler.drawAll();
        this.counter++;     
    }
    
}

// Event Listeners
let game = new Game();
let loop = 0; let speed = 100;
game.reset();
startButton.addEventListener('click', () => {
    game.loop();
    /*
    loop = setInterval(() => {
        game.loop();
    }, speed);*/
});
//resetButton.addEventListener('click', resetGame);
