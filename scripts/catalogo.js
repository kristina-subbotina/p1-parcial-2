class Catalogo {

    constructor(products, carrito) {
        this.products = products;
        this.carrito = carrito;
        this.currentProducts = [];
        this.filtrosAplicados = ['', '', ''];  // genero, idioma, precio
        this.filtroPrecioRango = [-1, -1]; // min, max
    }

    // Llamamos la funccion (metodo de objeto de class Producto) "mostrar tarjeta" para cada producto

    draw(productos = this.products) {
        this.currentProducts = productos;

        document.querySelector("#productos").replaceChildren();
        productos.forEach(element => {
            element.drawCard()
        });
    }

}