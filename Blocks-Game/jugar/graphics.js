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