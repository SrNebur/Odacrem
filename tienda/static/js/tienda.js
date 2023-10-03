
'use strict';
$(document).ready(
  function () {

    //Carga de los productos en la tienda
    var productos={};
    var productosActivos = [];
    let request = new XMLHttpRequest();
    request.open("GET", "http://127.0.0.1:8000/tienda/productos")
    request.send()
    request.responseType = "json"
    request.onload = function () {
      productos = productosActivos = request.response["productos"];
      cargarProductos(productos)
    }
    //Fin carga productos de la tienda


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
      $(this).addClass('active')
      productosActivos = productos;
      cargarProductos(productosActivos);
    })
    //Fin muestra

    //Filtrado de los productos por genero
    $('.filtroGen').click(function () {
      $(this).addClass('active')
      let generoSeleccionado = $(this).attr('genero');
      productosActivos=[];
      productos.forEach(producto => {
        if(generoSeleccionado == producto.genero){
          productosActivos.push(producto);
        }
      })
      cargarProductos(productosActivos);
    })
    //Fin filtro

    //Filtrado de los productos por categoria
    $('.filtroCat').click(function () {
      $(this).addClass('active')
      let categoriaSeleccionada = $(this).attr('categoria');
      productosActivos = [];
      productos.forEach(producto => {
        if(categoriaSeleccionada == producto.categoria_id){
          productosActivos.push(producto);
        }
      })
      cargarProductos(productosActivos);

    })
    //Fin filtro

    $('#orden').on("change", function () {
      switch (document.getElementById("orden").options[ this.selectedIndex ].getAttribute("sort")){
        case 'precioCaro':
          productosActivos.sort(function(a,b){return b.precio - a.precio});
          break;
        case 'precioBajo':
          productosActivos.sort(function(a,b){return a.precio - b.precio});
          break;
        default:
          productosActivos.sort(function(a, b){
            if(a.nombre == b.nombre){
              return 0
            }
            return a.nombre > b.nombre? 1:-1;
          });
          break;

      }
      cargarProductos(productosActivos)
    })



  });

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
