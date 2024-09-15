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
        .then(data => {this.images = data})
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
    static is_in_range(num,min,max) {
        if(num > max || num < min) return false;
        else return true;
    }
    static spawn_img(id_, grid_) {
        let img_type = Math.floor(Math.random()*data.n_type);
        let img_rotate = Math.floor(Math.random()*data.n_rotate);
        let img_color = data.colors[Math.floor(Math.random()*data.n_color)];
        let img_x = Math.floor(Math.random()*(data.grid_w-3));
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if(data.images[img_type][img_rotate][i][j] == 1) {
                    grid_[i][img_x + j] = new Box(id_,img_color);
                }
            }
        }
        return new Img(img_x,0,data.images[img_type][img_rotate],id_);
    }
    static move_img(img, grid, dx, dy) {
        let move = true;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if(img.shape[i][j] == 1) {
                    let new_y = img.y + i + dy;
                    let new_x = img.x + j + dx;
                    if(this.is_in_range(new_x,0,(data.grid_w-1)) && this.is_in_range(new_y,0,(data.grid_h-1))) {
                        if(grid[new_y][new_x].id != 0) {
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
        if(move) {
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if(img.shape[i][j] == 1) {
                        let last_y = img.y + i;
                        let last_x = img.x + j;
                        let new_y = last_y + dy;
                        let new_x = last_x + dx;
                        grid[new_y][new_x] = grid[last_y][last_x];
                        grid[last_y][last_x] = new Box(0,data.bg_color);
                    }
                }
            }
            img.x += dx;
            img.y += dy;
        }
        return move;
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
        /*
        this.grid_base = new Array(data.grid_h);
        for (let i = 0; i < data.grid_h; i++) { this.grid_base[i] = new Array(data.grid_w).fill(new Box(0,data.bg_color)); }*/
    }
    draw(i,j,color) {
        let y = (i - 4)*data.box_h;
        let x = j*data.box_w;
        ctx.fillStyle = color;
        ctx.lineWidth = 1;  ctx.strokeStyle = line_color;
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
        this.counter = 0;
        this.life = true;
    }
    loop() {
        this.grid_controler.clearAll();
        if(this.imageStop) {
            this.images.push(Utils.spawn_img(this.counter,this.grid_controler.grid));
        }
        this.counter++;
        
    }
    
}

// Event Listeners
let game = new Game();

startButton.addEventListener('click', () => {game.grid_controler.clearAll();});
//resetButton.addEventListener('click', resetGame);
