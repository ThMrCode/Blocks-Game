import { Data } from "./data.js" 
import { Box, Img, Grid } from "./graphics.js"

export class Utils {
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
}

export class Logic {
    constructor(data_, grid_controler_) {
        this.data = data_;
        this.grid_controler = grid_controler_;
        this.grid = this.grid_controler.grid;
    }

    spawn_img(id) {
        // Spawnea una imagen aleatoria de las opciones en data, (type, rotate, color)
        // La coloca en el grid (Boxs), y tambien retorna esta imagen
        let img_type = Math.floor(Math.random()*this.data.n_type);
        let img_rotate = Math.floor(Math.random()*this.data.n_rotate);
        let img_color = this.data.colors[Math.floor(Math.random()*this.data.n_color)];
        let img_x = Math.floor(Math.random()*(this.data.grid_w-3));
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if(this.data.images[img_type][img_rotate][i][j] == 1) {
                    this.grid[i][img_x + j] = new Box(id,img_color);
                }
            }
        }
        return new Img(img_x, 0, this.data.images[img_type][img_rotate], id, img_color,img_type,img_rotate);
    }

    static verify_move_img(img, dx, dy) {
        // Funcion que se encarga de ver si una imagen (solida) puede moverse 
        // (segun limites del mapa y no chocar con otros bloques que lo impidan)
        // Devuelve el valor de si puede moverse o no
        let move = true;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if(img.shape[i][j] == 1) {
                    let new_y = img.y + i + dy;
                    let new_x = img.x + j + dx;
                    if(Utils.verify_range(new_x,0,(this.data.grid_w-1)) && Utils.verify_range(new_y,0,(this.data.grid_h-1))) {
                        if(this.grid[new_y][new_x].id != 0 && this.grid[new_y][new_x].id != img.id) {
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

    static move_img(img, dx, dy) {
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
            this.grid[pots[i].y][pots[i].x] = new Box(img.id,img.color);
        }
        for (let i = 0; i < pots_delete.length; i++) {
            this.grid[pots_delete[i].y][pots_delete[i].x] = new Box(0,this.data.bg_color);
        }
        img.x = img.x + dx;
        img.y = img.y + dy;
    }

    static verify_rotate_img(img, rotate) {
        // Funcion que verifica si una imagen puede rotar
        let new_rotate = (img.rotate + rotate) % this.data.n_rotate;
        let new_shape = this.data.images[img.type][new_rotate];
        let move = true;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if(new_shape[i][j] == 1) {
                    let new_y = img.y + i;
                    let new_x = img.x + j;
                    if(Utils.verify_range(new_x,0,(this.data.grid_w-1)) && Utils.verify_range(new_y,0,(this.data.grid_h-1))) {
                        if(this.grid[new_y][new_x].id != 0 && this.grid[new_y][new_x].id != img.id) {
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

    static rotate_img(img, rotate) {
        // Funcion que rota la imagen (su shape) y sus Boxs en la grid
        let new_rotate = (img.rotate + rotate) % this.data.n_rotate;
        let new_shape = this.data.images[img.type][new_rotate];
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
            this.grid[pots[i].y][pots[i].x] = new Box(img.id,img.color);
        }
        for (let i = 0; i < pots_delete.length; i++) {
            this.grid[pots_delete[i].y][pots_delete[i].x] = new Box(0,this.data.bg_color);
        }
        img.rotate = new_rotate;
        img.shape = new_shape;
    }

    static move_sands() {
        for (let i = (this.data.grid_h-2); i >= 0; i--) {
            for (let j = 0; j < this.data.grid_w; j++) {
                if(this.grid[i][j].id != 0 && this.grid[i][j].sand && this.grid[i+1][j].id == 0) {
                    this.grid[i+1][j] = this.grid[i][j];
                    this.grid[i][j] = new Box(0,this.data.bg_color);
                }
            }
        }
    }

    static pop_row(i) {
        for (let j = 0; j < this.data.grid_w; j++) {
            // Actualizar id sans de todos los cuadrados y de las imagenes
            this.grid[i][j].id
            this.grid[i][j] = new Box(0,this.data.bg_color);
        }
    }

    static verify_row() {
        let same_color = true;
        for (let i = (this.data.grid_h-1); i >= 0; i--) {
            for (let j = 0; j < this.data.grid_w; j++) {
                if(this.grid[i][j].id != 0) {
                    this.draw(i,j,this.grid[i][j].color);
                }
            }
        }
    }
    
}