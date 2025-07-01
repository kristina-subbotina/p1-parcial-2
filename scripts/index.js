'use strict';

/*
 * SUBBOTINA
 */

// Variables para guardar los productos de JSON

let productos = [];
let generos = [];
let idiomas = [];
let precios = [];

let catalogo;

// Recibimos data de JSON

fetch("./libros.json")
    .then(response => response.json())
    .then(json => {

        json.forEach(element => {
            productos.push(new Producto(
                element.nombre,
                element.autor,
                element.portada,
                element.precio,
                element.genero,
                element.idioma,
                element.descripcion,
                element.stock,
                element.isbn,
                element.editorial)
            );
            if (!(generos.includes(element.genero))) {
                generos.push(element.genero);
            }

            if (!(idiomas.includes(element.idioma))) {
                idiomas.push(element.idioma);
            }

            precios.push(parseInt(element.precio));

        });

        // Mostramos todo dinamicamente

        catalogo = new Catalogo(productos, new Carrito);
        catalogo.draw();

        drawFiltros();
        catalogo.carrito.drawMiniCarrito();
        catalogo.carrito.drawCarritoModal();
        catalogo.carrito.fillCarritoModal();
        catalogo.carrito.load();

        // Creamos el header para la seccion de productos

        const productosHeader = document.createElement('h3');
        productosHeader.setAttribute("class", "text-center fw-light h3 text-uppercase mt-5 mb-4");
        productosHeader.innerText = 'Nuestras ofertas';
        document.querySelector("#productoscontainer").prepend(productosHeader);
    });


// La func para cambiar el formato de precio a $ 00.000

function currencyFormat(precio) {
    return precio.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
}

// La func para mostar la seccion de filtros

function drawFiltros() {

    // Container + header

    const botonGroupContainer = document.createElement('div');
    botonGroupContainer.setAttribute("class", "container bg-ivory p-5 rounded-3 border-top border-bottom border-1 border-secondary");

    const filtroHeader = document.createElement('h3');
    filtroHeader.setAttribute("class", "text-center fw-light h3 text-uppercase mt-0 mb-3 text-marron")
    filtroHeader.innerText = 'Filtros';

    botonGroupContainer.append(filtroHeader);

    // Grid items para selectors

    const selectorRow = document.createElement('div');
    selectorRow.setAttribute("class", "row");
    botonGroupContainer.append(selectorRow);

    const selectorgeneroCol = document.createElement('div');
    selectorgeneroCol.setAttribute("class", "col-12 col-lg-4");
    selectorRow.append(selectorgeneroCol);


    //El selector por genero

    const generoSelector = document.createElement('select');
    generoSelector.setAttribute("class", "form-select mb-3");
    generoSelector.setAttribute("name", "");
    generoSelector.setAttribute("id", "generos");

    const option = document.createElement("option");
    option.setAttribute("value", '');
    option.innerText = 'Seleccione un género';

    generoSelector.append(option);

    generos.forEach(genero => {
        const option = document.createElement("option");
        option.setAttribute("value", genero);
        option.innerText = genero;
        generoSelector.append(option);
    })

    selectorgeneroCol.append(generoSelector);

    generoSelector.addEventListener("change", (e) => {
        catalogo.filtrosAplicados[0] = e.target.value;
        filtrarLibros();
    });


    // El selector por idioma

    const selectoridiomaCol = document.createElement('div');
    selectoridiomaCol.setAttribute("class", "col-12 col-lg-4");
    selectorRow.append(selectoridiomaCol);


    const idiomaSelector = document.createElement('select');
    idiomaSelector.setAttribute("class", "form-select mb-3");
    idiomaSelector.setAttribute("name", "");
    idiomaSelector.setAttribute("id", "idioma");

    const optionIdioma = document.createElement("option");
    optionIdioma.setAttribute("value", '');
    optionIdioma.innerText = 'Seleccione idioma';

    idiomaSelector.append(optionIdioma);

    idiomas.forEach(idioma => {
        const optionIdioma = document.createElement("option");
        optionIdioma.setAttribute("value", idioma);
        optionIdioma.innerText = idioma;
        idiomaSelector.append(optionIdioma);
    })

    selectoridiomaCol.append(idiomaSelector);

    idiomaSelector.addEventListener("change", (e) => {
        catalogo.filtrosAplicados[1] = e.target.value;
        filtrarLibros();
    });

    // El selector por precio

    const selectorMinmaxCol = document.createElement('div');
    selectorMinmaxCol.setAttribute("class", "col-12 col-lg-4");
    selectorRow.append(selectorMinmaxCol);


    const minMaxSelector = document.createElement('select');
    minMaxSelector.setAttribute("class", "form-select mb-3");
    minMaxSelector.setAttribute("name", "");
    minMaxSelector.setAttribute("id", "minmax");

    let optionMinMax = document.createElement("option");
    optionMinMax.setAttribute("value", '');
    optionMinMax.innerText = 'Filtrar por precio';

    minMaxSelector.append(optionMinMax);

    optionMinMax = document.createElement("option");
    optionMinMax.setAttribute("value", 'minmax');
    optionMinMax.innerText = 'Min --> Max';
    minMaxSelector.append(optionMinMax);

    optionMinMax = document.createElement("option");
    optionMinMax.setAttribute("value", 'maxmin');
    optionMinMax.innerText = 'Max --> Min';
    minMaxSelector.append(optionMinMax);

    selectorMinmaxCol.append(minMaxSelector);


    minMaxSelector.addEventListener("change", (e) => {
        catalogo.filtrosAplicados[2] = e.target.value;
        filtrarLibros();
    });

// Contenedores para filtro por rango

    const botonMinMaxGroup = document.createElement('div');
    botonMinMaxGroup.setAttribute("class", "d-flex flex-row mb-4 mt-2");
    botonMinMaxGroup.setAttribute("class", "row");

    const rangeGroupTitle = document.createElement('div');
    rangeGroupTitle.setAttribute("class", "col-12 mb-2");
    const rangeGroupTitleText = document.createElement('div');
    rangeGroupTitleText.setAttribute("class", "fs-5 text-marron");
    rangeGroupTitleText.innerText = 'Filtrar por rango del precio:';
    rangeGroupTitle.append(rangeGroupTitleText);

    const rangeGroup = document.createElement('div');
    rangeGroup.setAttribute("class", " col-8  col-sm-5 col-lg-4");

    const rangeInputGroup = document.createElement('div');

// Filtros por rango

    const inputField = document.createElement('input');
    inputField.setAttribute('type', 'number');
    inputField.setAttribute('class', 'form-control mb-1');
    inputField.setAttribute('placeholder', `${Math.min(...precios)}`);
    inputField.setAttribute('aria-label', 'Valor minimo');

    const inputFieldMax = document.createElement('input');
    inputFieldMax.setAttribute('type', 'number');
    inputFieldMax.setAttribute('class', 'form-control');
    inputFieldMax.setAttribute('placeholder', `${Math.max(...precios)}`);
    inputFieldMax.setAttribute('aria-label', 'Valor maximo');

    const botonFiltrar = document.createElement('button');
    botonFiltrar.setAttribute("class", "btn btn-filtro mx-2 col-4 col-sm-3 col-md-2 col-lg-1");
    botonFiltrar.innerText = "Filtrar";
    botonFiltrar.addEventListener("click", (e) => {

        let minValue = inputField.value === '' ? Math.min(...precios) : parseInt(inputField.value);
        let maxValue = inputFieldMax.value === '' ? Math.max(...precios) : parseInt(inputFieldMax.value);

        if (minValue < 0) {
            inputField.setCustomValidity("El precio debe que ser más de 0");
            inputField.reportValidity();
            return;
        }

        if (maxValue < minValue) {
            inputFieldMax.setCustomValidity("El precio debe que ser más que valor minimo");
            inputFieldMax.reportValidity();
            return;
        }
        catalogo.filtroPrecioRango = [minValue, maxValue];
        filtrarLibros();
    });

    const botonBorrar = document.createElement('button');
    botonBorrar.setAttribute("class", "btn btn-filtro-borrar col-4 col-sm-3 col-md-2 col-lg-1  col-xl-1");
    botonBorrar.innerText = "Borrar filtro";
    botonBorrar.addEventListener("click", (e) => {
        inputField.value = '';
        inputFieldMax.value = '';
        catalogo.filtroPrecioRango = [-1, -1];
        filtrarLibros();
    });

    rangeInputGroup.append(inputField, inputFieldMax);
    rangeGroup.append(rangeInputGroup);
    botonMinMaxGroup.append(rangeGroupTitle, rangeGroup, botonFiltrar, botonBorrar);

    botonGroupContainer.append(botonMinMaxGroup);
    document.querySelector("#filtros").append(botonGroupContainer);
}


// Funcciones adicionales para filtrar por precio

function filtroMinMax(productos) {
    let librosCopy = [...productos];
    librosCopy.sort((a, b) => a.precio - b.precio);
    return librosCopy;
}


function filtroMaxMin(productos) {
    let librosCopy = [...productos];
    librosCopy.sort((a, b) => b.precio - a.precio);
    return librosCopy;
}


function precioRango(librosFiltrados, minP, maxP) {

    let librosFiltradosPorPrecio = librosFiltrados.filter(libro => (libro.precio >= minP && libro.precio <= maxP));
    return librosFiltradosPorPrecio;
}

// La func principal de filtracion

function filtrarLibros() {

    let librosFiltrados = catalogo.products;

    // GENERO
    if (catalogo.filtrosAplicados[0] !== '') {

        librosFiltrados = librosFiltrados.filter(libro => libro.genero === catalogo.filtrosAplicados[0]);
    }

    // IDIOMA
    if (catalogo.filtrosAplicados[1] !== '') {

        librosFiltrados = librosFiltrados.filter(libro => libro.idioma === catalogo.filtrosAplicados[1]);
    }

    // PRECIO

    if (catalogo.filtrosAplicados[2] === 'minmax') {
        librosFiltrados = filtroMinMax(librosFiltrados);
    } else if (catalogo.filtrosAplicados[2] === 'maxmin') {
        librosFiltrados = filtroMaxMin(librosFiltrados);
    }
    let minValue = catalogo.filtroPrecioRango[0];
    let maxValue = catalogo.filtroPrecioRango[1];

    if (minValue < 0) {
        minValue = Math.min(...precios);
    }

    if (maxValue < 0) {
        maxValue = Math.max(...precios);
    }
    librosFiltrados = precioRango(librosFiltrados, minValue, maxValue);
    catalogo.draw(librosFiltrados);

}

// La func para añadir un producto a carrito

function comprarLibro(isbn) {
    let libros = catalogo.products.filter(libro => libro.isbn === isbn);
    if (libros.length > 0) {

        let libro = libros[0];

        if (libro.stock > 0) {
            libro.stock = libro.stock - 1;

            catalogo.carrito.addProduct(libro);
            catalogo.carrito.drawMiniCarrito();
            catalogo.carrito.fillCarritoModal();
            if (libro.stock === 0) { catalogo.draw(catalogo.currentProducts); }

            catalogo.carrito.save();
        } else {
            alert(`No hay más ${libro.nombre}`);
        }

    }

}

// La func para borrar un producto del carrito

function removeLibro(isbn) {


    let libros = catalogo.products.filter(libro => libro.isbn === isbn);

    if (libros.length > 0) {

        let libro = libros[0];

        libro.stock++;
        catalogo.carrito.removeProduct(libro);
        catalogo.carrito.drawMiniCarrito();
        catalogo.carrito.fillCarritoModal()
        if (libro.stock === 1) { catalogo.draw(catalogo.currentProducts); }
        catalogo.carrito.save();
    }

}







