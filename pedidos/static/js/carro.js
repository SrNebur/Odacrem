// Importamos la clase Carrito y ProductoCarrito
import Carrito from './carrito.js';
import { actualizaNumCarrito } from './base.js';
'use strict';

//Variable global que guarda el carrito de la tienda
var carrito


//Variable global que tiene el precio del carrito final
var precioTotal = 0;

//Constante que guardara la direccion raiz del servidor para hacer las peticiones
const urlServidor = "http://127.0.0.1:8000";

$(document).ready(function () {
  //Recuperamos el carrito
  if (sessionStorage.getItem("carrito")) {
    carrito = new Carrito(sessionStorage.getItem("carrito"))
  } else {
    carrito = new Carrito();
  }

  if(carrito.isEmpty()){
    $("#comprar").hide();
  }

  cargarProductos();
  //Boton del modal para eliminar el producto

  //Boton para eliminar el elemento
  $('#modal-eliminar').click(() => {
    let prodId = $('#modal-eliminar').attr("value")
    let prodTalla = $('#modal-eliminar').attr("talla")
    //console.log("eliminar prod "+prodId+"-"+prodTalla);
    //Eliminamos el producto del carrito
    carrito.eliminarProducto(prodId, prodTalla);
    //Guardamos el carrito en la sesión
    carrito.guardarCarrito();
    //Cargamos los productos de nuevo sin ese producto
    cargarProductos();
    //Actualizamos el numero de elementos en el carrito
    actualizaNumCarrito(carrito);
    if(carrito.isEmpty()){
      $("#comprar").hide();
    }
    //Movemos la pantalla al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});


function cargarProductos() {
  //Ponemos el precio total a 0
  precioTotal = 0;
  //Borramos todos los productos anteriores
  $('.producto').remove();
  //Miramos si tenemos productos en el carrito
  if (carrito.isEmpty()) {
    //Escondemos el loader
    $('.loader').hide();
    //Mostramos un mensaje indicando que no se disponen de articulos
    const div = document.createElement("div");
    div.classList.add("producto");
    let htmlProducto = `<div class="alert alert-danger text-center">
                            Sin productos
                        </div>`
    div.innerHTML = htmlProducto;
    document.getElementById("listaProductoCarrito").append(div);
  } else {
    //Ocultamos el loader
    $('.loader').hide();
    //Mostramos los productos
    carrito.getProductos().forEach(prod => {
      //Vamos cargando todos los productos
      cargaProducto(prod.id, prod.cantidad, prod.talla)
    })
  }

  actualizaPrecioTotal();
}

function cargaProducto(id, cantidad, talla) {
  //Ponemos la url correcta dependiendo de los filtros
  let url = urlServidor + '/pedido/producto?id=' + id;
  //console.log("Peticion producto " + id+" - "+talla)
  //Realizamos la peticion mediante ajax
  $.ajax({
    //Url donde hacemos la peticion
    url: url,
    //Metodo de la peticion
    type: 'GET',
    //Que haremos si la peticion es correcta
    success: function (response) {

      //Añadimos un elemento más a la lista
      const div = document.createElement("li");
      div.classList.add("list-group-item");
      div.classList.add("producto");
      //Nos quedamos con el producto pasado
      let prod = response.producto[0];
      //Calculamos el precio total que tendra ese producto
      let precioTotalProd = parseFloat(prod.precio) * parseInt(cantidad);
      //Sumamos el precio total del producto al precio total del carrito
      precioTotal += precioTotalProd;
      //Acutalizamos el precio total del carrito
      actualizaPrecioTotal()
      //Creamos el html para mostrar el producto
      let nomProd = `
        <div class="row">
          <div class="col-lg-7 d-flex justify-content-start">
            <h4 class="nombreProducto">${prod.nombre}</h4>
          </div>
          <div class="col-sm d-flex justify-content-end acciones ml-3">
            <a id="elimina_${id}"  data-bs-toggle="modal" data-bs-target="#modalEliminar" class="btn btn-outline-danger m-1 end-0">Eliminar</a>
          </div>
        </div>`
      if (prod.nombre.length > 20) {
        nomProd = `
        <div>
          <h4 class="nombreProducto">${prod.nombre}</h4>
        </div>
        <div class="d-flex justify-content-end acciones ml-3">
          <a id="elimina_${id}"  data-bs-toggle="modal" data-bs-target="#modalEliminar" class="btn btn-outline-danger m-1 end-0">Eliminar</a>
        </div>`
      }

      let htmlTalla = ""
      if (talla != "undefined") {
        htmlTalla = `
        <ul class="list-inline pb-3">
          <li class="list-inline-item text-right">
            <h6>Talla:</h6>
          </li>
          <li class="list-inline-item">
            <span>${talla}</span>
          </li>
        </ul>
        `
      }
      
      let htmlCantidad = ''
      if(parseInt(cantidad) < 10){
        htmlCantidad = `
        <select class="form-select" id="cantidadMenos10_${id}" required>
            <option value="1" ${cantidad==1? "selected":""}>1</option>
            <option value="2" ${cantidad==2? "selected":""}>2</option>
            <option value="3" ${cantidad==3? "selected":""}>3</option>
            <option value="4" ${cantidad==4? "selected":""}>4</option>
            <option value="5" ${cantidad==5? "selected":""}>5</option>
            <option value="6" ${cantidad==6? "selected":""}>6</option>
            <option value="7" ${cantidad==7? "selected":""}>7</option>
            <option value="8" ${cantidad==8? "selected":""}>8</option>
            <option value="9" ${cantidad==9? "selected":""}>9</option>
            <option value="10">+10</option>
        </select>`
      }

      let htmlProducto = `
        <div class="row">
                <div class="col-lg-4 p-2">
                  <div class="ml-5">`
      htmlProducto += '<img class="card-img img-thumbnail prodImagen" alt="' + id + '" src="' + ((prod.imagen == "") ? '../static/img/work_in_progress.png' : '../../media/' + prod.imagen) + '"></img>'
      htmlProducto += `
                  </div>
                </div>
                <div class="col-lg-8 mt-2">
                    <div class="mb-5">
                      ${nomProd}
                    <div class="col-auto">
                      <ul class="list-inline pb-3">
                        <li class="list-inline-item text-right">
                          <h6>Cantidad:</h6>
                        </li>
                        <li class="list-inline-item">
                          ${htmlCantidad}
                          <div id="cantidadMas10_${id}" class="input-group  mb-3 ${htmlCantidad==''? '':'d-none'}">
                            <input id="numeroCantidad10_${id}" type="number" class="form-control form-control-sm" value="${cantidad}" min="1" max="20">
                            <button class="btn btn-outline-secondary ${htmlCantidad==''? 'd-none':''}" type="button" id="modCantidad_${id}">Modificar</button>
                          </div>
                        </li>
                        <br/>
                        <span id="error_${id}" class="d-none error">La cantidad ha de ser un número entre 1 y 20</span>
                      </ul>
                      ${htmlTalla}
                      <ul class="list-inline pb-3">
                        <li class="list-inline-item text-right">
                          <h6>Precio Unidad:</h6>
                        </li>
                        <li class="list-inline-item">
                          <span id="precio_${id}">${prod.precio.toFixed(2)}€</span>
                        </li>
                        <li class="list-inline-item text-right">
                          <h6>Total:</h6>
                        </li>
                        <li class="list-inline-item">
                          <span id="total_${id}">${precioTotalProd.toFixed(2)}€</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              `
      //Añadimos el html al elemento de la lista
      div.innerHTML = htmlProducto;
      //Lo añadimos al contenedor de los productos
      document.getElementById("listaProductoCarrito").append(div);

      $('#cantidadMenos10_'+id).on("change",function () {
        //console.log("Cantidad modificada: "+$('#cantidadMenos10_'+id).val())
        if($('#cantidadMenos10_'+id).val()==10){
          $("#cantidadMenos10_" + id).hide();
          $("#cantidadMas10_" + id).removeClass("d-none");
        }else{
          let val = $('#cantidadMenos10_'+id).val();
          precioTotal -= parseFloat($("#total_" + id).text())
          let precio = parseFloat(val) * parseFloat($("#precio_" + id).text())
          $("#total_" + id).text(precio.toFixed(2)+"€")
          precioTotal += precio;
          actualizaPrecioTotal();

          carrito.anyadirProducto(id, parseInt(val), talla);
          carrito.guardarCarrito();

          actualizaNumCarrito(carrito);
        }
      });

      $("#numeroCantidad10_" + id).click(() => {
        $("#modCantidad_" + id).show();
        $("#modCantidad_" + id).removeClass("d-none");
      });

      $("#modCantidad_" + id).click(() => {

        var val = parseInt(document.getElementById("numeroCantidad10_" + id).value);
        //console.log(val)
        if (!Number.isInteger(val) || val > 20 || val < 1) {
          $("#error_" + id).removeClass("d-none");
          $("#error_" + id).show();
        } else {
          document.getElementById("numeroCantidad10_" + id).value=val;
          $("#modCantidad_" + id).hide();
          $("#error_" + id).hide();

          precioTotal -= parseFloat($("#total_" + id).text())
          let precio = parseFloat(val) * parseFloat($("#precio_" + id).text())
          $("#total_" + id).text(precio.toFixed(2)+"€")
          precioTotal += precio;
          actualizaPrecioTotal();

          carrito.anyadirProducto(id, val, talla);
          carrito.guardarCarrito();

          actualizaNumCarrito(carrito);
        }
      })

      //Boton para eliminar el elemento
      $('#elimina_' + id).click(() => {
        $('#modal-eliminar').attr("talla", talla)
        $('#modal-eliminar').attr("value", id)
        $("#modalEliminarTitulo").text("¿Estas seguro de que deseas eliminar el producto '" + prod.nombre + "' " + ((talla == "undefined") ? "" : "con talla " + talla) + " del carrito?")
      });
    },
    //Que haremos en caso de error
    error: function () {
      console.error("No ha sido posible cargar el producto " + id);
      //Ocultamos el loader
      $('.loader').hide();
      //Añadimos un mensaje de error indicando al usuario lo que ha ocurrido
      const div = document.createElement("div");
      div.classList.add("producto");
      let htmlProducto = `<li class="list-group-item">
        <div class="alert alert-danger text-center">
          No ha sido posible cargar el producto `+ id
      htmlProducto += `</div>
      </li>`
      div.innerHTML = htmlProducto;
      document.getElementById("contenedorProductos").append(div);
    }
  });
}

function actualizaPrecioTotal(precio) {
  precio ? $("#precioTotal").html(precio.toFixed(2)) : $("#precioTotal").html(precioTotal.toFixed(2))
}
