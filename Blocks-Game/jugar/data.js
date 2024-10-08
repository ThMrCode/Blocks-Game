// © 2024 ThMrCode (Misael Fernández Prada). Todos los derechos reservados.

export class Data {
    constructor(json) {
        this.images = json.images;
        this.colors = json.colors;
        this.n_color = this.colors.length; 
        this.n_type = this.images.length; 
        this.n_rotate = this.images[0].length;
        this.bg_color = "#000";
        this.h = 400;  this.w = 300;
        this.box_h = 20;   this.box_w = 20;
        this.grid_h = 24; this.grid_w = 15;
    }
}
