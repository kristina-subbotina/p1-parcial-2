class Carrito {

    constructor() {
        this.items = [];
        this.totalCount = 0;
        this.totalPrice = 0;

    }

    // Lacal Storage para los productos en carrito

    load() {
        if (localStorage.getItem("carritoItems")) {
            let carritoItems = JSON.parse(localStorage.getItem("carritoItems"));
            carritoItems.forEach(item => {
                for (let i = 0; i < item.count; i++) {

                    comprarLibro(item.producto.isbn)
                }
            });
        }
    }

    save() {
        localStorage.setItem("carritoItems", JSON.stringify(this.items));
    }

    // El metodo para limpiar el carrito

    borrarCarrito() {
        let isbns = [];
        this.items.forEach(item => {
            for (let i = 0; i < item.count; i++) {
                isbns.push(item.producto.isbn);
            }
        });
        isbns.forEach(isbn => removeLibro(isbn));
    }

    // Creamos un objeto de class CarritoItem o cambiamos su count si ya existe

    addProduct(product) {
        let items = this.items.filter(item => item.producto === product);
        if (items.length > 0) {
            items[0].count++;
        } else {
            let item = new CarritoItem(product);
            item.count = 1;
            this.items.push(item);
        }

        this.totalCount++;
        this.totalPrice += product.precio;
    }

    // Borramos el objeto de class CarritoItem o cambiamos su count

    removeProduct(product) {

        let items = this.items.filter(item => item.producto === product);
        if (items.length > 0) {
            items[0].count--;

            if (items[0].count === 0) {
                let index = this.items.indexOf(items[0]);

                if (index > -1) {
                    this.items.splice(index, 1);
                }
            }
        }

        this.totalCount--;
        this.totalPrice -= product.precio;
    }


    // Creamos la ventana modal de carrito

    drawCarritoModal() {

        const modal = document.createElement("div");
        modal.setAttribute("class", "modal modal-carrito fade");

        const dialog = document.createElement("div");
        dialog.setAttribute("class", "modal-dialog modal-lg modal-dialog-centered");

        const content = document.createElement("div");
        content.setAttribute("class", "modal-content bg-ivory");

        const header = document.createElement("div");
        header.setAttribute("class", "modal-header");

        const title = document.createElement("h1");
        title.setAttribute("class", "modal-title fs-4 text-uppercase fw-light");
        title.innerText = "Tu carrito";

        const close = document.createElement("button");
        close.setAttribute("type", "button");
        close.setAttribute("class", "btn-close");
        close.addEventListener("click", () => {
            this.closeCarritoModal();
        });

        const body = document.createElement("div");
        body.setAttribute("class", "modal-body modal-carrito-body");

        const footer = document.createElement("div");
        footer.setAttribute("class", "modal-footer");

        // Boton borrar

        const btnBorrarCarrito = document.createElement("button");
        btnBorrarCarrito.setAttribute("type", "button");
        btnBorrarCarrito.setAttribute("class", "btn btn-danger btn-borrar-todo");
        btnBorrarCarrito.innerText = "Borrar todo";
        btnBorrarCarrito.addEventListener("click", () => {
            this.borrarCarrito();
        });

        // Boton cerrar
        const btn = document.createElement("button");
        btn.setAttribute("type", "button");
        btn.setAttribute("class", "btn btn-secondary");
        btn.innerText = "Seguir comprando";
        btn.addEventListener("click", () => {
            this.closeCarritoModal();
        });

        const backdrop = document.createElement("div");
        backdrop.setAttribute("class", "modal-backdrop modal-carrito-backdrop fade");
        backdrop.setAttribute("style", "display: none;");


        footer.append(btnBorrarCarrito, btn);

        header.append(title, close);

        content.append(header, body, footer);
        dialog.append(content);
        modal.append(dialog);
        document.querySelector("body").append(backdrop);
        document.querySelector("body").prepend(modal);

    }

    // Los metodos para abrir y cerrar la ventana modal del carrito

    openCarritoModal() {
        const modal = document.querySelector(".modal-carrito");
        modal.classList.add("show");
        modal.setAttribute("style", "display: block;");
        const backdrop = document.querySelector(".modal-carrito-backdrop");
        backdrop.classList.add("show");
        backdrop.setAttribute("style", "display: block;");
    }

    closeCarritoModal() {
        const modal = document.querySelector(".modal-carrito");
        modal.classList.remove("show");
        modal.setAttribute("style", "display: none;");
        const backdrop = document.querySelector(".modal-carrito-backdrop");
        backdrop.classList.remove("show");
        backdrop.setAttribute("style", "display: none;");
    }

    // Creamos el contenido de modal-body para recfrescarlo dinamicamente 

    fillCarritoModal() {

        document.querySelector(".modal-carrito-body").replaceChildren();

        const list = document.createElement("ul");
        list.setAttribute("class", "list-group-flush");

        this.items.forEach(element => {
            const item = document.createElement("li");
            item.setAttribute("class", "list-group-item container mb-2 border-bottom border-1");

            const itemRow = document.createElement("div");
            itemRow.setAttribute("class", "row");

            const imagen = document.createElement("img");
            imagen.setAttribute("class", "img-fluid col-4 col-md-3 col-lg-2 px-2 py-1")
            imagen.setAttribute("src", element.producto.portada);
            imagen.setAttribute("alt", `Tapa del libro ${element.producto.nombre}`);


            const name = document.createElement("p");
            name.setAttribute("class", "img-fluid col-3 col-md-4 col-lg-5 mt-4")
            name.innerText = element.producto.nombre;


            const count = document.createElement("p");
            count.setAttribute("class", "img-fluid col-1 mt-4")
            count.innerText = `${element.count}`;

            const price = document.createElement("p");
            price.setAttribute("class", "img-fluid col-2 mt-4 fw-bold")
            price.innerText = currencyFormat(element.count * element.producto.precio);

            // Botones para agregar más o borrar el producto

            const btnGroup = document.createElement("div");
            btnGroup.setAttribute("class", "ms-auto col-2");

            const botonAdd = document.createElement('button');
            if (element.producto.isAvailable()) {
                botonAdd.setAttribute("class", "btn btn-marron fw-bold me-1");
                botonAdd.addEventListener("click", (e) => {
                    comprarLibro(element.producto.isbn);
                });
            } else {
                botonAdd.setAttribute("class", "btn btn-marron fw-bold me-1 disabled");
            }
            botonAdd.innerText = '+';


            const botonDelete = document.createElement('button');
            botonDelete.setAttribute("class", "btn btn-marron fw-bold");
            botonDelete.innerText = '-';
            botonDelete.addEventListener("click", (e) => {
                removeLibro(element.producto.isbn);
            });

            btnGroup.append(botonAdd, botonDelete);
            itemRow.append(imagen, name, count, price, btnGroup);
            item.append(itemRow);
            list.append(item);

        });

        // El grupo de count y precio total

        const totalItemsModal = document.createElement('p')
        totalItemsModal.setAttribute("class", "fs-5 mt-4 mb-1");
        totalItemsModal.innerText = `Ítems en total: ${this.totalCount}`;

        const totalPriceModal = document.createElement('p')
        totalPriceModal.setAttribute("class", "fs-5 fw-bold mt-0");
        totalPriceModal.innerText = `Precio total: ${currencyFormat(this.totalPrice)}`;

        // Boton borrar todo

        const btnBorrar = document.querySelector(".btn-borrar-todo");

        if (this.totalCount <= 0) {
            btnBorrar.setAttribute("class", "btn btn-danger btn-borrar-todo disabled");
        } else {
            btnBorrar.setAttribute("class", "btn btn-danger btn-borrar-todo");
        }

        document.querySelector(".modal-carrito-body").append(list, totalItemsModal, totalPriceModal);

    }

    // Creamos el mini-carrito que sigue en el body

    drawMiniCarrito() {

        document.querySelector("#carrito").replaceChildren();

        const carritoMiniContainer = document.createElement('div');
        carritoMiniContainer.setAttribute("class", "d-flex flex-row-reverse bg-image container px-0 m4-3");

        const carritoMini = document.createElement('div');
        carritoMini.setAttribute("class", "mb-1 bg-ivory p-5 rounded-end rounded-pill");

        const items = document.createElement('p');
        items.setAttribute("class", "fs-5 mb-1 ms-5");
        items.innerText = (`${this.totalCount} ítems agregados`);

        const total = document.createElement('p');
        total.setAttribute("class", "fs-5 mb-1");
        total.innerText = (`${currencyFormat(this.totalPrice)} es el total`);

        // Boton para llamar la ventana modal del carrito

        const boton = document.createElement('button');
        boton.setAttribute("id", "open");
        boton.setAttribute("class", "btn btn-marron");
        boton.innerText = 'Ver carrito';
        boton.addEventListener("click", (e) => {
            this.openCarritoModal();

        });

        carritoMini.append(items, total, boton);
        carritoMiniContainer.append(carritoMini);
        document.querySelector("#carrito").append(carritoMiniContainer);

    }

};






