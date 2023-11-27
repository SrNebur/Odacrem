//Importamos el carrito
import Carrito from './carrito.js';
import { actualizaNumCarrito } from './base.js';

'use strict';

//Enum que contiene los valores del atributo sort de cada opcion del select para el orden
const Orden = {
  Alfabetico: 'alfabetico',
  PrecioCaro: 'precioCaro',
  PrecioBarato: 'precioBajo',
}

//Constante que guardara la direccion raiz del servidor para hacer las peticiones
const urlServidor = "http://127.0.0.1:8000";

//variable global que guarda el carrito de la tienda
var carrito
if (sessionStorage.getItem("carrito")) {
  carrito = new Carrito(sessionStorage.getItem("carrito"))
} else {
  carrito = new Carrito();
}


//Constante que tiene el numero de productos por pagina
const nProductosPagina = 9;

//Variable global que tiene los productos seleccionados actualmente
var productos = {};

$(document).ready(
  function () {
    //Variable para contener los filtros activos
    var filtrosActivos = {};
    //Ponemos el orden por alfabetico, es el que nos da el backend por defecto
    document.getElementById('orden').selectedIndex = 0;
    //Petición inicial para la carga de todos los productos
    peticionProductos();

    // Inicio acordeon
    $('.accordion > li > ul').hide();

    $('.accordion > li > a').click(function () {
      var target = $(this).next();
      if (!target.hasClass('active')) {
        target.addClass('active').slideDown();
      } else {
        target.removeClass('active').slideUp();
      }
    });
    // Fin acordeon

    //-----------------------FILTROS DE PRODUCTOS-----------------------

    //Filtrado de los productos por genero
    $('.filtroGen').click(function () {
      //Obtenemos el seleccionado anteriormente
      let selectAnt = $('.selectedGen');
      //Le quitamos a la seleccion anterior la X
      selectAnt.text(selectAnt.text().replace("X ", ""))
      //Quitamos el selected de cualquier filtro anterior de categoria
      selectAnt.removeClass('selectedGen');
      //Se define la variable de filtrado
      let filtrado = ""
      //Miramos si estamos eliminando el filtro o si estamos modificandolo
      if (selectAnt.attr('genero') == $(this).attr('genero')) {
        filtrosActivos['genero'] = undefined
      } else {
        //Añadimos una X al nuevo filtro
        $(this).text("X " + $(this).text());
        //Ponemos el filtro como activo
        $(this).addClass('selectedGen');
        //Obtenemos el genero seleccionado
        let generoSeleccionado = $(this).attr('genero');
        //Lo añadimos como filtro activo
        filtrosActivos['genero'] = generoSeleccionado;
        //Preparamos el filtrado
        filtrado += "?genero=" + generoSeleccionado;
      }

      //Miramos si hay una categoria seleccionada, en cuyo caso se aplica tambien
      if (filtrosActivos["categoria"] != undefined) {
        filtrado += ((filtrado == "") ? "?" : "&") + "categoria=" + filtrosActivos["categoria"];
      }

      //Hacemos la peticion de los productos con los filtros
      peticionProductos(filtrado)

    });

    //Filtrado de los productos por categoria
    $('.filtroCat').click(function () {
      //Obtenemos el seleccionado anteriormente
      let selectAnt = $('.selectedCat');
      //Le quitamos a la seleccion anterior la X
      selectAnt.text(selectAnt.text().replace("X ", ""))
      //Quitamos el selected de cualquier filtro anterior de categoria
      selectAnt.removeClass('selectedCat');
      //Se define la variable de filtrado
      let filtrado = ""
      //Miramos si estamos eliminando el filtro o si estamos modificandolo
      if (selectAnt.attr('categoria') == $(this).attr('categoria')) {
        filtrosActivos['categoria'] = undefined
      } else {
        //Añadimos una X al nuevo filtro
        $(this).text("X " + $(this).text());
        //Ponemos el filtro como activo
        $(this).addClass('selectedCat');
        //Obtenemos la categoria seleccionada
        let categoriaSeleccionada = $(this).attr('categoria');
        //La añadimos como filtro activo
        filtrosActivos['categoria'] = categoriaSeleccionada;
        //Preparamos el filtrado
        filtrado = "?categoria=" + categoriaSeleccionada;
      }

      //Miramos is tambien hay un filtro de genero, en cuyo caso se aplica tambien
      if (filtrosActivos["genero"] != undefined) {
        filtrado += ((filtrado == "") ? "?" : "&") + "genero=" + filtrosActivos["genero"];
      }
      //Hacemos la peticion de los productos con los filtros
      peticionProductos(filtrado);
    });
    //----------------------- FIN FILTROS DE PRODUCTOS-----------------------

    //-----------------------PAGINACION PRODUCTOS-----------------------
    //Buscamos los dos botones para paginar los productos
    let pag2 = document.getElementById("pag2");
    let pag1 = document.getElementById("pag1");

    //Ordenacion de los productos cuando se cambia el desplegable
    $('#orden').on('change', function () {
      //Reiniciamos la paginacion
      reiniciaPaginacion(productos.length);
      //Ordenamos los productos
      productos = ordenaProductos(productos);
      //Cargamos los productos que pertenecen a la pagina 1
      cargarProductos(sacaProductosPaginacion(productos, 1));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    //Fin orden productos

    //Asinamos al boton de volver a la pagina anterior sus funciones
    $('#pagAnt').click(function () {
      //Volvera a la pagina anterior
      pagAnt(productos);
      //Se obtiene el numero de pagina que se queda marcado como actual
      let num = pag1.innerHTML;
      if (pag2.classList.contains("btn-success")) {
        num = pag2.innerHTML;
      }
      //Cargamos los productos de la pagina actual
      cargarProductos(sacaProductosPaginacion(productos, num));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    //Asinamos al boton pag1
    $('#pag1').click(function () {
      //Solo actuara cuando el elemento marcado sea el pag2
      if (pag2.classList.contains("btn-success")) {
        //pasamos a la pagina anterior
        pagAnt(productos);
        //Miramos el numero que esta marcado y lo guardamos en num
        let num = pag1.innerHTML;
        if (pag2.classList.contains("btn-success")) {
          num = pag2.innerHTML;
        }
        //Cargamos los productos de la pagina indicada
        cargarProductos(sacaProductosPaginacion(productos, num));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });

    //Asinamos al boton de siguiente a la pagina anterior sus funciones
    $('#pagSig').click(function () {
      //Pasara a la pagina siguiente
      pagSig(productos);
      //Miramos el numero que esta marcado y lo guardamos en num
      let num = pag1.innerHTML;
      if (pag2.classList.contains("btn-success")) {
        num = pag2.innerHTML;
      }
      //Cargamos los productos de la pagina indicada
      cargarProductos(sacaProductosPaginacion(productos, num));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    //Asinamos al boton pag2
    $('#pag2').click(function () {
      //Pasamos a la pagina siguiente
      pagSig(productos)
      //Miramos el numero que esta marcado y lo guardamos en num
      let num = pag1.innerHTML;
      if (pag2.classList.contains("btn-success")) {
        num = pag2.innerHTML;
      }
      //Cargamos los productos de la pagina indicada
      cargarProductos(sacaProductosPaginacion(productos, num));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    //-----------------------FIN PAGINACION PRODUCTOS-----------------------
  });
//Fin $(document).ready

//Funcion encargada de ordenar los productos en funcion del valor del desplegable
function ordenaProductos(productos) {
  //Se obtiene el valor del desplegable y se ejecutará un case con una funcion sort
  switch (document.getElementById('orden').options[document.getElementById('orden').selectedIndex].getAttribute("sort")) {
    case Orden.PrecioCaro:
      productos.sort(function (a, b) { return b.precio - a.precio });
      break;
    case Orden.PrecioBarato:
      productos.sort(function (a, b) { return a.precio - b.precio });
      break;
    //El orden alfabetico será por defecto
    default:
      productos.sort(function (a, b) {
        if (a.nombre == b.nombre) {
          return 0
        }
        return a.nombre > b.nombre ? 1 : -1;
      });
      break;
  }
  return productos
}
//Fin ordenaProductos

function peticionProductos(filtrado) {
  //Mostramos el loader
  $('.loader').show();
  //Ponemos la url correcta dependiendo de los filtros
  let url = urlServidor + '/tienda/productos';
  if (filtrado != undefined) {
    url = urlServidor + '/tienda/productos' + filtrado;
  }
  //Realizamos la peticion mediante ajax
  $.ajax({
    //Url donde hacemos la peticion
    url: url,
    //Metodo de la peticion
    type: 'GET',
    //Que haremos si la peticion es correcta
    success: function (response) {
      //Se guardan los productos ordenados
      productos = ordenaProductos(response["productos"])
      //Cargamos los productos de la primera pagina
      cargarProductos(sacaProductosPaginacion(productos, 1))
      //Reiniciamos la paginacion
      reiniciaPaginacion(productos.length);
      //Ocultamos el loader
      $('.loader').hide();
    },
    //Que haremos en caso de error
    error: function () {
      console.error("No ha sido posible realizar la petición");
      //Ocultamos el loader
      $('.loader').hide();
      //Añadimos un mensaje de error indicando al usuario lo que ha ocurrido
      const div = document.createElement("div");
      div.classList.add("producto");
      let htmlProducto = `<h2 class="text-center">Lo sentimos, parece que ha habido un error al obtener los productos</h2>
    <p class="text-center">Estamos trabajando para ofrecer un mejor servicio. Le pedimos disculpas por cualquier inconveniente.</p>`
      div.innerHTML = htmlProducto;
      document.getElementById("contenedorProductos").append(div);
      //Reiniciamos la paginación a 0 para que desaparezca
      reiniciaPaginacion(0);
    }
  });
}



//Función encargada de cargar todos los productos pasados
function cargarProductos(productosElegidos) {
  //Borramos todos los productos anteriores
  $('.producto').remove();
  //Miramos si hemos obtenido productos
  if (productosElegidos.length == 0) {
    //Mostramos un mensaje indicando que no se disponen de articulos
    const div = document.createElement("div");
    div.classList.add("producto");
    let htmlProducto = `<h2 class="text-center">Lo sentimos, no disponemos de ese tipo de artículos</h2>
    <p class="text-center">Estamos trabajando para ofrecer una mejor selección en el futuro. Le pedimos disculpas por cualquier inconveniente.</p>`
    div.innerHTML = htmlProducto;
    document.getElementById("contenedorProductos").append(div);
  } else {
    //Mostramos los productos
    productosElegidos.forEach(producto => {
      let talla = '<li><a value=' + producto.id + ' class="btn btn-success text-white mt-2 anyadirCarrito"><i class="fas fa-cart-plus"></i></a></li>'
      if (producto.tallas.length > 0) {
        talla = '<li><a value=' + producto.id + ' tallas=' + producto.tallas + ' class="btn btn-success text-white mt-2 anyadirCarritoTalla" data-bs-toggle="modal" data-bs-target="#modalTalla"><i class="fas fa-cart-plus"></i></a></li>'
      }

      const div = document.createElement("div");
      div.classList.add("producto");
      div.classList.add("col-md-4");
      let htmlProducto = `
      <div class="card mb-4 product-wap rounded-0">
        <!-- Tarjeta del producto -->
        <div class="card rounded-0">`
      htmlProducto += '<img class="card-img rounded-0 img-fluid" src="' + ((producto.imagen == "") ? '../static/img/work_in_progress.png' : '../../media/' + producto.imagen) + '"></img>'
      htmlProducto += `
        <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
            <ul class="list-unstyled">
              <!-- Botones para ver el producto o añadirlo al carrito directamente -->
              <li><a class="btn btn-success text-white mt-2" href="${urlServidor}/tienda/producto/${producto.id}"><i class="far fa-eye"></i></a></li>
              ${talla}
            </ul>
          </div>
        </div>
        <!-- Body de la tarjeta de presentación del producto -->
        <div class="card-body">
          <a href="${urlServidor}/tienda/producto/${producto.id}" class="h3 text-decoration-none">${producto.nombre}</a>
          <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
            <li class="pt-2">
              <!--Imprimimos el precio del producto con 2 decimales -->
              <p class="text-center mb-0">${producto.precio.toFixed(2)}€</p>
            </li>
          </ul>
        </div>
      </div>`;

      div.innerHTML = htmlProducto;

      document.getElementById("contenedorProductos").append(div);
    })

    //-----------------------PETICION ANYADIR AL CARRITO--------------------
    //Boton de añadir al carrito
    $('.anyadirCarrito').click(function () {
      let id = $(this).attr('value')

      carrito.agregarCantidad(id, 1)

      carrito.guardarCarrito();

      actualizaNumCarrito(carrito);
    });

    $('#modal-anyadir').click(function () {
      let id = $(this).attr('prod')
      let talla = $(this).attr('talla')
      //console.log(id + "-" + talla)
      
      carrito.agregarCantidad(id, 1, talla)

      carrito.guardarCarrito();

      actualizaNumCarrito(carrito);
    });

    $('.anyadirCarritoTalla').click(function () {
      let id = $(this).attr('value')
      $("#modal-anyadir").attr("prod",id)
      let tallas = $(this).attr('tallas').split(',')
      document.getElementById("modal-body").innerHTML = "";
      const div = document.createElement("div");
      div.classList.add("row");

      $('#modal-anyadir').attr('talla',tallas[0])
      let htmlTallas = '<li class="list-inline-item mt-1"><span class="btn btn-size btn-secondary">' + tallas[0] + '</span></li>';
      tallas.shift();
      tallas.forEach(t => {
        htmlTallas += '<li class="list-inline-item mt-1"><span class="btn btn-success btn-size">' + t + '</span></li>'
      });
      let htmlTallaSelect = `
      <div class="col-auto">
          <ul class="list-inline pb-3">
              <li class="list-inline-item">
                  <h6>Tallas:</h6>
                  ${htmlTallas}
          </ul>
      </div>`
      div.innerHTML = htmlTallaSelect;
      document.getElementById("modal-body").append(div);
      //Boton de talla
      $('.btn-size').click(function () {
        $(".btn-size").removeClass('btn-secondary');
        $(".btn-size").addClass('btn-success');
        $(this).removeClass('btn-success');
        $(this).addClass('btn-secondary');
        $("#modal-anyadir").attr("talla",$(this).text())
      });
    });
    //------------------FIN PETICION ANYADIR AL CARRITO-------------------

  }
}
//Fin cargarProductos

//Funciones que se encargan de la paginacion
function reiniciaPaginacion(tamanyoProd) {

  //Comprobamos que el tamaño sea distinto de 0
  if (tamanyoProd <= 0) {
    $("#pagination").hide()
  } else {

    $("#pagination").show()
    $("#pagAnt").prop("disabled", true);
    $("#pagination > button").removeClass("btn-success")
    $("#pag1").addClass("btn-success")
    document.getElementById("pag1").innerHTML = "1";

    if (tamanyoProd <= nProductosPagina) {
      $("#pag2").hide()
      $('#pagSig').prop("disabled", true);
    } else {
      $("#pag2").show();
      $('#pagSig').prop("disabled", false);
      document.getElementById("pag2").innerHTML = "2";
    }
  }
}

//Funcion encargada de pasar a la pagina siguiente, en todo lo referente a estetica
function pagSig(productos) {
  //Borramos todos los productos anteriores
  $('.producto').remove();
  let pag2 = document.getElementById("pag2");
  $('#pagAnt').prop("disabled", false);
  if (pag2.innerHTML == Math.ceil(productos.length / nProductosPagina)) {
    $("#pagination > button").removeClass("btn-success");
    $("#pag2").addClass("btn-success");
    $('#pagSig').prop("disabled", true);
  } else {
    document.getElementById("pag1").innerHTML = pag2.innerHTML
    pag2.innerHTML = parseInt(pag2.innerHTML) + 1
  }
}

//Funcion encargada de pasar a la pagina anterior, en todo lo referente a estetica
function pagAnt(productos) {
  //Borramos todos los productos anteriores
  $('.producto').remove();
  let pag2 = document.getElementById("pag2");
  $('#pagSig').prop("disabled", false);
  if (pag2.innerHTML == Math.ceil(productos.length / nProductosPagina) && pag2.classList.contains("btn-success")) {
    $("#pag2").removeClass("btn-success");
    $("#pag1").addClass("btn-success");
  } else {
    let pag1 = document.getElementById("pag1");
    pag2.innerHTML = pag1.innerHTML;
    pag1.innerHTML = parseInt(pag2.innerHTML) - 1;
  }
  if (pag1.innerHTML == 1) {
    $('#pagAnt').prop("disabled", true);;
  }
}

//Funcion encargada de generar el array de productos que se han de mostrar 
function sacaProductosPaginacion(productos, nPagina) {
  let maxProductoMostrar = nPagina * nProductosPagina;
  let productoInicial = maxProductoMostrar - nProductosPagina;
  return productos.slice(productoInicial, maxProductoMostrar)
}



