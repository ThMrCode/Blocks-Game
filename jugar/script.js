// Referencia
// Recuerda, la ejecucion de una funcion asincrona es hacer su parte sincrona y añadir su parte asincrona como una microtarea a la cola una vez añadida, termina su ejecucion
// Recuerda, cuando se termina una promesa, la ultima linea de esta es añadir su then o catch a la cola de microtareass

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const resetButton = document.getElementById('resetButton');
const resources = "https://thmrcode.github.io/Blocks-Game/resources/blocks.json";
const bg_color = "#000"; const line_color = "#fff";

// Conjunto controlador de datos -> conjunto de imagenes vivas () incluido su caracter sand
// Conjunto grid -> 
class Box {
    constructor(id_, color_) {
        this.id = id_;
        this.color = color_;
    }
}
class Image {
    constructor(type_,rotate_,color_,x_,y_,id_) {
        this.type = type_;
        this.rotate = rotate_;
        this.color = color_;
        this.x = x_;
        this.y = y_;
        this.id = id_;
        this.sand = false;
    }
}

class Grid {
    constructor() {
        ctx.fillStyle = '#FF4500';
        this.h = 400;  this.w = 300;
        this.box_h = 20;   this.box_w = 20;
        this.grid_h = 24; this.grid_w = 15;
        this.grid = new Array(this.grid_h);
        for (let i = 0; i < this.grid_h; i++) { this.grid[i] = new Array(this.grid_w).fill(new Box(0,"000")); }
        this.grid_move = new Array(this.grid_h);
        for (let i = 0; i < this.grid_h; i++) { this.grid_move[i] = new Array(this.grid_w).fill(new Box(0,"000")); }
    }
    draw(i,j,color) {
        let y = (i - 4)*this.box_h;
        let x = j*this.box_w;
        ctx.fillStyle = color;
        ctx.lineWidth = 1;  ctx.strokeStyle = line_color;
        ctx.strokeRect(x,y,this.box_w,this.box_h);
    }
    clear(i,j) {
        this.draw(i,j,bg_color);
    }
    drawAll() {
        for (let i = 0; i < this.grid_h; i++) {
            for (let j = 0; j < this.grid_w; j++) {
                if(this.grid[i][j].id != 0) this.draw(i,j,this.grid[i][j].color);
            }
        }
    }
    clearAll() {
        for (let i = 0; i < this.grid_h; i++) {
            for (let j = 0; j < this.grid_w; j++) {
                this.clear(i,j);
            }
        }
    }
}

class Game {
    constructor() {
        this.grid_controler = new Grid();
        fetch(resources)
        .then(response => { if(!response.ok) throw new Error("Error Blocks"); return response.json();})
        .then(data => {this.images = data})
        this.colors = ['#FF4500', '#00FF00', '#1E90FF', '#FFD700', '#FF69B4'];
        this.objects_id = [0];
        this.objects_count = 1;
    }
    create() {
        this.grid_controler.clearAll();
    }
    spawn_img() {

        this.image_type = Math.floor(Math.random()*5);
        this.image_rotate = Math.floor(Math.random()*4);
        this.image_pot_x = Math.floor(Math.random()*13);
        this.image_pot_y = 0;
    }
    
}

// Event Listeners
let game = new Game();

startButton.addEventListener('click', () => {game.grid_controler.clearAll();});
//resetButton.addEventListener('click', resetGame);



// Para un tablero de 400 por 300, cuadraditos de 20
class Tablero{
    constructor(){
        this.heigth = 400;  this.width = 300;
        this.heigth_box = 20;   this.width_box = 20;
        this.round = 0;
        this.score = 0;
        this.num_aux = 0;
        this.images = new Array();
        this.image = new Array();
        this.image_generate = true;
        this.image_type = 0;
        this.image_rotate = 0;
        this.image_pot_x = 0;
        this.image_pot_y = 0;
        this.image_id = 0;  
        this.container = ctx;
        this.filas_columnas = [];
        this.grid = [];
        this.grid_movement = [];
        // Los 4 primeros no se utilizan
        for (let index1 = 0; index1 < 24; index1++) {
            this.grid[index1] = [];
            this.grid_movement[index1] = [];
            for (let index2 = 0; index2 < 16; index2++) {
                this.grid[index1][index2] = 0;
                this.grid_movement[index1][index2] = 0;
            }
        }
        this.objects_sand = [];
        this.sand_count = 0;
        this.objects_id = [0];
        this.objects_count = 1;
    }
    create(){
        this.filas_columnas[0] = [];
        this.filas_columnas[1] = [];
        this.filas_columnas[2] = [];
        this.filas_columnas[3] = [];
        for (let index1 = 4; index1 < 24; index1++) {
            let fila = document.createElement("div");
            fila.className = "container__fila";
            fila.id = "fila-" + index1;
            this.filas_columnas[index1] = [];
            for (let index2 = 0; index2 < 16; index2++) {
                let fila_columna = document.createElement("div");
                fila_columna.className = "container__fila__columna";
                fila_columna.id = "box-" + index1 + "-" + index2;
                this.filas_columnas[index1][index2] = fila_columna;
                fila.appendChild(fila_columna);
            }
            this.container.appendChild(fila);
        }
    }
    generar_img(){
        this.image_type = Math.floor(Math.random()*5);
        this.image_rotate = Math.floor(Math.random()*4);
        this.image_pot_x = Math.floor(Math.random()*13);
        this.image_pot_y = 0;
        this.image =  this.images[this.image_type][this.image_rotate];
        this.objects_id[this.objects_count] = (Math.floor(Math.random()*7) + 1);
        this.image_id = this.objects_count;
        for (let index1 = 0; index1 < 4; index1++) {
            for (let index2 = 0; index2 < 4; index2++) {
                if(this.image[index1][index2]) this.grid[index1][this.image_pot_x + index2] = this.image_id;
            }
        }
        this.objects_count ++;
        this.image_generate = false;
    }
    mover_img(direction_x,direction_y){
        let value = true;
        for (let index1 = 0; index1 < 4; index1++) {
            for (let index2 = 0; index2 < 4; index2++) {
                if(this.image[index1][index2]){
                    if(index1 + this.image_pot_y + direction_y > 23) {value = false;break;}
                    if(index2 + this.image_pot_x + direction_x > 15) {value = false;break;}
                    if(index2 + this.image_pot_x + direction_x < 0) {value = false;break;}
                    let newpot = this.grid[index1+this.image_pot_y + direction_y][index2+this.image_pot_x + direction_x];
                    if(newpot != 0 && newpot != this.image_id) {value = false;break;}
                }
            }
        }
        if(value) {
            for (let index1 = 0; index1 < 4; index1++) {
                for (let index2 = 0; index2 < 4; index2++) {
                    if(this.image[index1][index2]){
                        this.grid[index1+this.image_pot_y][index2+this.image_pot_x] = 0;
                        this.grid_movement[index1+this.image_pot_y][index2+this.image_pot_x] = 0;
                    }
                }
            }
            for (let index1 = 0; index1 < 4; index1++) {
                for (let index2 = 0; index2 < 4; index2++) {
                    if(this.image[index1][index2]){
                        this.grid[index1+this.image_pot_y + direction_y][index2+this.image_pot_x + direction_x] = this.image_id;
                        this.grid_movement[index1+this.image_pot_y + direction_y][index2+this.image_pot_x + direction_x] = 1;
                    }
                }
            }
            this.image_pot_x += direction_x;
            this.image_pot_y += direction_y;
        }
    }
    mover_blocks(id_block) {
        this.num_aux = 0;
        let value_move = true;
        for (let index1 = 0; index1 < 24; index1++) {
            for (let index2 = 0; index2 < 16; index2++) {
                if(this.grid[index1][index2] == id_block) {
                    this.num_aux ++;
                    if(index1 == 23 || (this.grid[index1+1][index2] != id_block && this.grid[index1+1][index2] != 0)) {
                        value_move = false;
                    }
                }
            }
        }
        if(this.num_aux > 0){
            if(value_move){
                for (let index1 = 23; index1 > 0; index1--) {
                    for (let index2 = 0; index2 < 16; index2++) {
                        if(this.grid[index1-1][index2] == id_block && this.grid[index1][index2] == 0){
                            this.grid[index1][index2] = this.grid[index1-1][index2];
                            this.grid[index1-1][index2] = 0;
                            this.grid_movement[index1][index2] = 1;
                            this.grid_movement[index1-1][index2] = 0;
                        }
                    }      
                }
                if(this.image_id == id_block) this.image_pot_y += 1;
            }
            else {
                for (let index1 = 0; index1 < 24; index1++) {
                    for (let index2 = 0; index2 < 16; index2++) {
                        if(this.grid[index1][index2] == id_block) {
                            this.grid_movement[index1][index2] = 0;
                        }
                    }
                }
                if(id_block == this.image_id) this.image_generate = true;
            }
        }
    }
    mover_sands() {
        for (let index1 = 23; index1 > 0; index1--) {
            for (let index2 = 0; index2 < 16; index2++) {
                if(this.objects_sand.indexOf(this.grid[index1][index2]) != -1){
                    this.grid_movement[index1][index2] = 0;
                }
            }      
        }
        for (let index1 = 23; index1 > 0; index1--) {
            for (let index2 = 0; index2 < 16; index2++) {
                if(this.objects_sand.indexOf(this.grid[index1-1][index2]) != -1){
                    if(this.grid[index1][index2] == 0){
                        this.grid[index1][index2] = this.grid[index1-1][index2];
                        this.grid[index1-1][index2] = 0;
                        this.grid_movement[index1][index2] = 1;
                        this.grid_movement[index1-1][index2] = 0;
                    }
                    else {
                        this.grid_movement[index1][index2] = 0;
                    }
                }
            }      
        }
    }
    mover_grid(){
        for (let id = 1; id < this.objects_count; id++) {
            if(this.objects_sand.indexOf(id) == -1) this.mover_blocks(id);
        }
        this.mover_sands();
    }
    verificar(){
        let bool_sand = true;
        for (let index1 = 23; index1 > 3; index1--) {
            let value_fila = false;
            let value_combo = false;
            if(this.grid[index1][0] != 0 && this.grid_movement[index1][0] == 0) {
                value_fila = true;
                value_combo = true;
                let value_reference = this.grid[index1][0];
                for (let index2 = 1; index2 < 16; index2++) {
                    if(this.grid_movement[index1][index2] == 1) {
                        value_fila = false;
                        value_combo = false;
                    }
                    else {
                        if(this.grid[index1][index2] == 0) value_fila = false;
                        if(this.grid[index1][index2] != value_reference) value_combo = false;
                    }
                }
            }
            if(value_fila) {
                for (let index2 = 0; index2 < 16; index2++) {
                    this.grid[index1][index2] = 0;
                }
                this.score += 50;
                if(value_combo) this.score += 100;
                if(bool_sand) {
                    for (let index1_sand = 4; index1_sand < index1; index1_sand++) {
                        for (let index2_sand = 0; index2_sand < 16; index2_sand++) {
                            let id_sand = this.grid[index1_sand][index2_sand];
                            if(id_sand != 0 && this.grid_movement[index1_sand][index2_sand] == 0) {
                                if(this.objects_sand.indexOf(id_sand) == -1) {
                                    this.objects_sand.push(id_sand);
                                    this.sand_count ++;
                                }
                            }
                        }
                    }
                }
                bool_sand = false;
            }
        } 
        if(!bool_sand) setTimeout(() => {this.actualizar(); console.log(this.score)}, 20);
    }
    actualizar(){
        for (let index1 = 4; index1 < 24; index1++) {
            for (let index2 = 0; index2 < 16; index2++) {
                this.filas_columnas[index1][index2].className = "container__fila__columna box__type-" + this.objects_id[this.grid[index1][index2]];
            }
        }  
    }
    rotate_img(rigth){
        let image_posible;
        if(rigth){
            this.image_rotate = (this.image_rotate+1)%4;
            image_posible = this.images[this.image_type][this.image_rotate];
        }
        else {
            this.image_rotate = (this.image_rotate+1)%4;
            image_posible = this.images[this.image_type][this.image_rotate];
        }
        let value = true;
        for (let index1 = 0; index1 < 4; index1++) {
            for (let index2 = 0; index2 < 4; index2++) {
                if(image_posible[index1][index2]){
                    if(index1 + this.image_pot_y > 23) {value = false;break;}
                    if(index2 + this.image_pot_x > 15) {value = false;break;}
                    if(index2 + this.image_pot_x < 0) {value = false;break;}
                    let newpot = this.grid[index1+this.image_pot_y][index2+this.image_pot_x];
                    if(newpot != 0 && newpot != this.image_id) {value = false;break;}
                }
            }
        }
        if(value) {
            for (let index1 = 0; index1 < 4; index1++) {
                for (let index2 = 0; index2 < 4; index2++) {
                    if(this.image[index1][index2]){
                        this.grid[index1+this.image_pot_y][index2+this.image_pot_x] = 0;
                        this.grid_movement[index1+this.image_pot_y][index2+this.image_pot_x] = 0;
                    }
                }
            }
            this.image = image_posible;
            for (let index1 = 0; index1 < 4; index1++) {
                for (let index2 = 0; index2 < 4; index2++) {
                    if(this.image[index1][index2]){
                        this.grid[index1+this.image_pot_y][index2+this.image_pot_x] = this.image_id;
                        this.grid_movement[index1+this.image_pot_y][index2+this.image_pot_x] = 1;
                    }
                }
            }
        }
    }
    bucle(){
        if(this.image_generate) {this.generar_img();}
        this.mover_grid();
        this.actualizar();
        this.verificar();
        this.round ++;
        console.clear();
        console.log(this.score);
    }
}