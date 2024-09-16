// © 2024 ThMrCode (Misael Fernández Prada). Todos los derechos reservados.

export class Data {
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