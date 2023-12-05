// Importamos la clase Carrito y ProductoCarrito
import Carrito from './carrito.js';

'use strict';

//Variable global que guarda el carrito de la tienda
var carrito


$(document).ready(function () {
    if (sessionStorage.getItem("carrito")) {
      carrito = new Carrito(sessionStorage.getItem("carrito"))
    } else {
      carrito = new Carrito();
    }
    actualizaNumCarrito(carrito);
});

export function actualizaNumCarrito(carr){
    if(carr.isEmpty()){
      $("#numCarrito").addClass('visually-hidden');
    }else{
      $("#numCarrito").removeClass('visually-hidden');
      $("#numCarrito").text(carr.getSize());
    }
}
  
