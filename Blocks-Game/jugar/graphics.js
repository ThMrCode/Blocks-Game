// © 2024 ThMrCode (Misael Fernández Prada). Todos los derechos reservados.

export class Box {
    constructor(id_, color_) {
        this.id = id_;
        this.color = color_;
        this.sand = false;
    }
}

export class Img {
    constructor(x_,y_,shape_,id_, color_, type_, rotate_) {
        this.x = x_;
        this.y = y_;
        this.shape = shape_;
        this.id = id_;
        this.color = color_;
        this.type = type_;
        this.rotate = rotate_;
        this.sand = false;
    }
}

export class Grid {
    constructor(data_, ctx_) {
        this.ctx = ctx_;
        this.data = data_;
        this.grid = new Array(this.data.grid_h);
        for (let i = 0; i < this.data.grid_h; i++) { 
            this.grid[i] = new Array(this.data.grid_w).fill(new Box(0,this.data.bg_color)); 
        }
    }
    reset() {
        this.grid = new Array(this.data.grid_h);
        for (let i = 0; i < this.data.grid_h; i++) { 
            this.grid[i] = new Array(this.data.grid_w).fill(new Box(0,this.data.bg_color)); 
        }
    }
    // Graphics
    draw(i,j,color) {
        let y = (i - 4)*this.data.box_h;
        let x = j*this.data.box_w;
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x,y,this.data.box_w,this.data.box_h);
    }
    clear(i,j) {
        this.draw(i,j,this.data.bg_color);
    }
    drawAll() {
        // Empieza desde 4 pues los Boxs i 0 -> 3 no se ven
        for (let i = 4; i < this.data.grid_h; i++) {
            for (let j = 0; j < this.data.grid_w; j++) {
                if(this.grid[i][j].id != 0) {
                    this.draw(i,j,this.grid[i][j].color);
                }
            }
        }
    }
    clearAll() {
        // Empieza desde 4 pues los Boxs i 0 -> 3 no se ven
        for (let i = 4; i < this.data.grid_h; i++) {
            for (let j = 0; j < this.data.grid_w; j++) {
                this.clear(i,j);
            }
        }
    }
    drawClearAll() {
        // Empieza desde 4 pues los Boxs i 0 -> 3 no se ven
        for (let i = 4; i < this.data.grid_h; i++) {
            for (let j = 0; j < this.data.grid_w; j++) {
                this.draw(i,j,this.grid[i][j].color);
            }
        }
    }
}
