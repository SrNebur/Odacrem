
'use strict';

//Enum que contiene los valores del atributo sort de cada opcion del select para el orden
const Orden = {
  Alfabetico: 'alfabetico',
  PrecioCaro: 'precioCaro',
  PrecioBarato: 'precioBajo',
}

$(document).ready(
  function () {
    //Variables para contener los productos que se estan mostrando actualmente, los filtros activos y el orden que tienen actualmente
    var productos = {};
    var filtrosActivos = {};
    //Ponemos el orden por alfabetico, es el que nos da el backend por defecto
    document.getElementById('orden').selectedIndex = 0;
    //Petición inicial para la carga de todos los productos
    let request = new XMLHttpRequest();
    let urlPeticion = "http://127.0.0.1:8000/tienda/productos/"
    request.open("GET", urlPeticion);
    request.send();
    request.responseType = "json";
    request.onload = function () {
      productos = request.response["productos"]
      cargarProductos(productos)
      
    }

    // Inicio acordeon
    var all_panels = $('.accordion > li > ul').hide();

    $('.accordion > li > a').click(function () {
      var target = $(this).next();
      if (!target.hasClass('active')) {
        all_panels.removeClass('active').slideUp();
        target.addClass('active').slideDown();
      } else {
        target.removeClass('active').slideUp();
      }
      return false;
    });
    // Fin acordeon

    //Mostrar todos los productos
    $('.sinFiltro').click(function () {
      //Borramos todos los filtros
      filtrosActivos = {}
      //Realizamos la peticion para obtener todos los productos
      let request = new XMLHttpRequest();
      let urlPeticion = "http://127.0.0.1:8000/tienda/productos/"
      request.open("GET", urlPeticion);
      request.send();
      request.responseType = "json";
      request.onload = function () {
        productos = ordenaProductos(request.response["productos"]);
        cargarProductos(productos);
      }

    })
    //Fin muestra

    //Filtrado de los productos por genero
    $('.filtroGen').click(function () {
      //Obtenemos el genero seleccionado
      let generoSeleccionado = $(this).attr('genero');
      //Lo añadimos como filtro activo
      filtrosActivos['genero'] = generoSeleccionado;
      //Preparamos el filtrado
      let filtrado = "?genero=" + generoSeleccionado
      //Miramos si hay una categoria seleccionada, en cuyo caso se aplica tambien
      if (filtrosActivos["categoria"] != undefined) {
        filtrado += "&categoria=" + filtrosActivos["categoria"];
      }
      //Hacemos la peticion
      let request = new XMLHttpRequest();
      let urlPeticion = "http://127.0.0.1:8000/tienda/productos/" + filtrado
      request.open("GET", urlPeticion);
      request.send();
      request.responseType = "json";
      request.onload = function () {
        productos = ordenaProductos(request.response["productos"]);
        cargarProductos(productos);
      }
    })
    //Fin filtro

    //Filtrado de los productos por categoria
    $('.filtroCat').click(function () {
      //Obtenemos la categoria seleccionada
      let categoriaSeleccionada = $(this).attr('categoria');
      //La añadimos como filtro activo
      filtrosActivos['categoria'] = categoriaSeleccionada;
      //Preparamos el filtrado
      let filtrado = "?categoria=" + categoriaSeleccionada;
      //Miramos is tambien hay un filtro de genero, en cuyo caso se aplica tambien
      if (filtrosActivos["genero"] != undefined) {
        filtrado += "&genero=" + filtrosActivos["genero"];
      }
      //Hacemos la peticion
      let request = new XMLHttpRequest();
      let urlPeticion = "http://127.0.0.1:8000/tienda/productos/" + filtrado
      request.open("GET", urlPeticion);
      request.send();
      request.responseType = "json";
      request.onload = function () {
        productos = ordenaProductos(request.response["productos"]);
        cargarProductos(productos);
      }

    });
    //Fin filtro

    //Ordenacion de los productos cuando se cambia el desplegable
    $('#orden').on('change', function () {
      productos = ordenaProductos(productos);
      console.log(productos)
      cargarProductos(productos);
    });
    //Fin orden productos

    reiniciaPaginacion();

    
    $('#pagAnt').click(function(){pagAnt(productos)});
    $('#pag1').click(function(){
      if(document.getElementById("pag1").innerHTML != 1){
        pagAnt(productos);
      }
    });
    $('#pagSig').click(function(){pagSig(productos)});
    $('#pag2').click(function(){pagSig(productos)});
    

  });
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

//Función encargada de cargar todos los productos pasados
function cargarProductos(productosElegidos) {
  //Borramos todos los productos anteriores
  $('.producto').remove();
  //Mostramos los productos pasados
  productosElegidos.forEach(producto => {

    const div = document.createElement("div");
    div.classList.add("producto");
    div.classList.add("col-md-4");
    let htmlProducto = `
      <div class="card mb-4 product-wap rounded-0">
        <!-- Tarjeta del producto -->
        <div class="card rounded-0">`
    htmlProducto += producto.imagen == "" ? `<img class="card-img rounded-0 img-fluid" src="../static/img/work_in_progress.png"></img>` : `<img class="card-img rounded-0 img-fluid" src="../../media/${producto.imagen}"></img>`
    htmlProducto += `
        <div class="card-img-overlay rounded-0 product-overlay d-flex align-items-center justify-content-center">
            <ul class="list-unstyled">
              <!-- Botones para ver el producto o añadirlo al carrito directamente -->
              <li><a class="btn btn-success text-white mt-2" href="#"><i class="far fa-eye"></i></a></li>
              <li><a class="btn btn-success text-white mt-2" href="#"><i class="fas fa-cart-plus"></i></a></li>
            </ul>
          </div>
        </div>
        <!-- Body de la tarjeta de presentación del producto -->
        <div class="card-body">
          <a href="#" class="h3 text-decoration-none">${producto.nombre}</a>
          <ul class="w-100 list-unstyled d-flex justify-content-between mb-0">
            <li>${producto.talla}</li>
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

  //actualizarBotonesAgregar();
}
//Fin cargarProductos

//Funciones que se encargan de la paginacion
function reiniciaPaginacion(){
  $("#pagAnt").prop("disabled", true);
  $("#pagination > button").removeClass("btn-success")
  $("#pag1").addClass("btn-success")
}

function pagSig(productos){
  let pag2 = document.getElementById("pag2");
  $('#pagAnt').prop("disabled", false);
  if (pag2.innerHTML == Math.ceil(productos.length / 9)){
    $("#pagination > button").removeClass("btn-success");
    $("#pag2").addClass("btn-success");
    $('#pagSig').prop("disabled", true);
  }else{
    document.getElementById("pag1").innerHTML = pag2.innerHTML
    pag2.innerHTML = parseInt(pag2.innerHTML) + 1
  }
}

function pagAnt(productos){
  let pag2 = document.getElementById("pag2");
  $('#pagSig').prop("disabled", false);
  if (pag2.innerHTML == Math.ceil(productos.length / 9) && pag2.classList.contains("btn-success")){
    $("#pag2").removeClass("btn-success");
    $("#pag1").addClass("btn-success");
  }else{
    let pag1 = document.getElementById("pag1");
    pag2.innerHTML = pag1.innerHTML;
    pag1.innerHTML = parseInt(pag2.innerHTML) - 1;
    if(pag1.innerHTML == 1){
      $('#pagAnt').prop("disabled", true);;
    }
  }  
}
