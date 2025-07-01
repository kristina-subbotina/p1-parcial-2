class Producto {

    constructor(nombre, autor, portada, precio, genero, idioma, descripcion, stock, isbn, editorial) {
        this.nombre = nombre;
        this.autor = autor;
        this.portada = portada;
        this.precio = parseInt(precio);
        this.genero = genero;
        this.idioma = idioma;
        this.descripcion = descripcion;
        this.stock = parseInt(stock);
        this.isbn = isbn;
        this.editorial = editorial;
    }

    isAvailable() {
        return this.stock > 0;
    }

    // El metodo para mostar un producto

    drawCard() {

        const cardColumn = document.createElement("div");
        cardColumn.setAttribute("class", "col-12 col-md-6 col-lg-4 col-xxl-3");

        const card = document.createElement("div");


        if (this.isAvailable()) {
            card.setAttribute("class", "libro-card");
        }
        else {
            card.setAttribute("class", "libro-card opacity-50");

            const badge = document.createElement('span');
            badge.setAttribute("class", "badge text-bg-secondary");
            badge.innerText = 'AGOTADO';


        }


        const title = document.createElement("div");
        title.setAttribute("class", "height-fix mt-1");

        const name = document.createElement("h3");
        name.setAttribute("class", "text-center fs-3 mb-2 text-marron");
        name.innerText = this.nombre;

        const autor = document.createElement('p');
        autor.setAttribute("class", "text-center fs-5");
        autor.innerText = this.autor;

        const imagen = document.createElement("img");
        imagen.setAttribute("class", "img-fluid d-block m-auto");
        imagen.setAttribute("src", this.portada);
        imagen.setAttribute("alt", `Tapa del libro ${this.nombre}`);

        const precio = document.createElement('p');
        precio.setAttribute("class", "text-center fs-4 my-3 text-marron");
        precio.innerText = currencyFormat(this.precio);


        if (!this.isAvailable()) {
            precio.innerText = 'AGOTADO';
            precio.setAttribute("class", "text-center fs-4 my-3 text-marron bg-warning rounded-3");
        }

        const descripcion = document.createElement('p');
        descripcion.setAttribute("class", "height-fix-p");
        descripcion.innerText = this.descripcion;

        const boton = document.createElement('button');
        if (this.isAvailable()) {
            boton.setAttribute("class", "btn btn-marron me-2");
            boton.addEventListener("click", (e) => {
                const target = e.target;
                const isbn = this.isbn;
                comprarLibro(isbn);
            });
        } else {
            boton.setAttribute("class", "btn btn-marron me-2 disabled");
        }
        boton.innerText = "Comprar";

        const botonVerMas = document.createElement('button');
        botonVerMas.setAttribute("class", "btn btn-verde");
        botonVerMas.innerText = "Ver más";
        botonVerMas.addEventListener("click", (e) => {
            this.drawVentModal();
        });

        title.append(name, autor);
        card.append(title, imagen, precio, descripcion, boton, botonVerMas);
        cardColumn.append(card);
        document.querySelector("#productos").append(cardColumn);

    }


    // Creamos una ventana modal de producto

    drawVentModal() {
        const modal = document.createElement("div");
        modal.setAttribute("class", "modal modal-libro fade show");
        modal.setAttribute("style", "display: block;");

        const dialog = document.createElement("div");
        dialog.setAttribute("class", "modal-dialog modal-dialog-centered modal-xl");

        const content = document.createElement("div");
        content.setAttribute("class", "modal-content bg-ivory");

        const header = document.createElement("div");
        header.setAttribute("class", "modal-header");

        const title = document.createElement("h1");
        title.setAttribute("class", "modal-title fs-3 text-marron text-uppercase");
        title.innerText = this.nombre;

        // Boton cerrar

        const close = document.createElement("button");
        close.setAttribute("type", "button");
        close.setAttribute("class", "btn-close");
        close.addEventListener("click", () => {
            document.querySelector(".modal-libro").remove();
            document.querySelector(".modal-backdrop-libro").remove();

        });

        // Modal body

        const body = document.createElement("div");
        body.setAttribute("class", "modal-body");

        const modalBodyContainer = document.createElement("div");
        modalBodyContainer.setAttribute("class", "container-fluid");

        const modalBodyRow = document.createElement("div");
        modalBodyRow.setAttribute("class", "row");

        const autor = document.createElement("div");
        autor.setAttribute("class", "col-12 fs-4 mb-3");
        autor.innerText = this.autor;

        const imgContainer = document.createElement("div");
        imgContainer.setAttribute("class", "col-5 col-lg-3");

        const imageLibro = document.createElement("img");
        imageLibro.setAttribute("class", "img-fluid d-block m-auto");
        imageLibro.setAttribute("src", this.portada);
        imageLibro.setAttribute("alt", `Tapa del libro ${this.nombre}`);

        const precio = document.createElement("p");
        precio.setAttribute("class", "text-center fs-3 fw-bold my-3 text-marron");
        precio.innerText = currencyFormat(this.precio);

        // Estilo para el producto agotado

        if (!this.isAvailable()) {
            precio.innerText = 'AGOTADO';
            precio.setAttribute("class", "text-center fs-3 text-marron bg-warning rounded-3 mt-2");
        }

        imgContainer.append(imageLibro, precio)

        const listContainer = document.createElement("div");
        listContainer.setAttribute("class", "col-7 col-lg-5");

        const list = document.createElement("ul");
        list.setAttribute("class", "list-group list-group-flush mb-3");

        const genero = document.createElement('li');
        genero.setAttribute("class", "list-group-item  bg-ivory");
        genero.innerText = `Genero: ${this.genero}`;

        const editorial = document.createElement('li');
        editorial.setAttribute("class", "list-group-item  bg-ivory");
        editorial.innerText = `Editorial: ${this.editorial}`;

        const idioma = document.createElement('li');
        idioma.setAttribute("class", "list-group-item  bg-ivory");
        idioma.innerText = `Idioma: ${this.idioma}`;

        const isbn = document.createElement('li');
        isbn.setAttribute("class", "list-group-item  bg-ivory");
        isbn.innerText = `ISBN: ${this.isbn}`;

        list.append(genero, editorial, idioma, isbn);

        const descripcion = document.createElement('p');
        descripcion.setAttribute("class", "fs-5");
        descripcion.innerText = this.descripcion;

        listContainer.append(list, descripcion);

        // Medios de pago

        const mediosPago = document.createElement("div");
        mediosPago.setAttribute("class", "col-12 col-lg-4 border border-secondary rounded-3");

        const mediosPagoHeader = document.createElement("p");
        mediosPagoHeader.setAttribute("class", "fs-5 fw-bold");
        mediosPagoHeader.innerText = 'Medios de pago';

        const mediosPagoCuotas = document.createElement("p");
        mediosPagoCuotas.setAttribute("class", "bg-success text-light p-3 mx-0 fs-5");
        mediosPagoCuotas.innerText = '¡Hasta 3 cuotas sin interes!';

        const mediosPagoList = document.createElement("ul");
        mediosPagoList.setAttribute("class", "list-group list-group-flush");

        const mediosPagoItemUno = document.createElement("li");
        mediosPagoItemUno.setAttribute("class", "bg-ivory list-group-item");
        mediosPagoItemUno.innerText = 'Cuotas sin tarjeta: Mercado pago';

        const mediosPagoItemDos = document.createElement("li");
        mediosPagoItemDos.setAttribute("class", "bg-ivory list-group-item");
        mediosPagoItemDos.innerText = 'Tarjeta de crédito: Visa, MasterCard, NaranjaX';

        const mediosPagoItemTres = document.createElement("li");
        mediosPagoItemTres.setAttribute("class", "bg-ivory list-group-item");
        mediosPagoItemTres.innerText = 'Tarjeta de débito: Visa, Cabal';

        const mediosPagoItemCuatro = document.createElement("li");
        mediosPagoItemCuatro.setAttribute("class", "bg-ivory list-group-item");
        mediosPagoItemCuatro.innerText = 'Efectivo: Rapipago, PagoFacil';

        mediosPagoList.append(mediosPagoItemUno, mediosPagoItemDos, mediosPagoItemTres, mediosPagoItemCuatro)
        mediosPago.append(mediosPagoHeader, mediosPagoCuotas, mediosPagoList);

        modalBodyRow.append(autor, imgContainer, listContainer, mediosPago);
        modalBodyContainer.append(modalBodyRow);
        body.append(modalBodyContainer);

        // Footer de modal con botones

        const footer = document.createElement("div");
        footer.setAttribute("class", "modal-footer");

        const btnComprar = document.createElement("button");
        btnComprar.setAttribute("type", "button");
        if (this.isAvailable()) {
            btnComprar.setAttribute("class", "btn btn-marron me-2");
            btnComprar.addEventListener("click", (e) => {
                const target = e.target;
                const isbn = this.isbn;
                comprarLibro(isbn);
                if (!this.isAvailable()) {
                    btnComprar.setAttribute("class", "btn btn-marron disabled");
                    if (!this.isAvailable()) {
                        precio.innerText = 'AGOTADO';
                        precio.setAttribute("class", "text-center fs-3 text-marron bg-warning rounded-3 mt-2");
                    }
                }
            });
        } else {
            btnComprar.setAttribute("class", "btn btn-marron disabled me-2");
        }

        btnComprar.innerText = "Comprar";
        const btn = document.createElement("button");
        btn.setAttribute("type", "button");
        btn.setAttribute("class", "btn btn-secondary btn-modal");
        btn.innerText = "Cerrar";
        btn.addEventListener("click", () => {

            document.querySelector(".modal-libro").remove();
            document.querySelector(".modal-backdrop-libro").remove();
        });



        footer.append(btnComprar, btn);
        header.append(title, close);

        content.append(header, body, footer);
        dialog.append(content);
        modal.append(dialog);

        document.querySelector("body").prepend(modal);

        const backdrop = document.createElement("div");
        backdrop.setAttribute("class", "modal-backdrop modal-backdrop-libro fade show");
        document.querySelector("body").append(backdrop);
    }
}


