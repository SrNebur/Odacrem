// Importamos la clase Carrito y ProductoCarrito
import Carrito from './carrito.js';
import { actualizaNumCarrito } from './base.js';

'use strict';

//Variable global que guarda el carrito de la tienda
var carrito
//Constante que guardara la direccion raiz del servidor para hacer las peticiones
const urlServidor = "http://127.0.0.1:8000";

$(document).ready(function () {
    if (sessionStorage.getItem("carrito")) {
        carrito = new Carrito(sessionStorage.getItem("carrito"))
    } else {
        carrito = new Carrito();
    }
    $(".error").hide();
    $(".loader").hide();
    document.getElementById('pago').style.visibility = 'visible';
    $('#formPago').submit(function(event){
        event.preventDefault(); // Quitamos la acción por defecto
        $(".loader").show();
        document.getElementById('pago').style.visibility = 'hidden';
        // Obtenemos los datos del formulario y los pasamos a validacion
        let nombreCalle = $('#nombreCalle').val();
        let numPuerta = $('#numeroPuerta').val();
        let codigoPostal = $('#codigoPostal').val();
        let provincia = $('#provincia').val();
        let numTarjetaCredito = $('#numTarjetaCredito').val();
        let ciudad = $('#ciudad').val();
        let fechaVal = $('#fechaVal').val();
        let cvv = $('#cvv').val();

        if(validacionFormulario(nombreCalle,numPuerta,codigoPostal,provincia,numTarjetaCredito,ciudad,fechaVal,cvv)){ //Validamos el formulario
            hacerPeticionPedido(nombreCalle,numPuerta,codigoPostal,provincia,ciudad);
        }else{
            $(".loader").hide();
            document.getElementById('pago').style.visibility = 'visible';
        }
    });
});



function validacionFormulario(nombreCalle,numPuerta,codigoPostal,provincia,numTarjetaCredito,ciudad,fechaVal,cvv){
    $(".error").hide();
    if(esBlanco(nombreCalle)){
        imprimeError("nombreCalle","El nombre de la calle es un campo requerido")
        return false;
    }
    
    if(!esBlanco(numPuerta) && !esNumero(numPuerta)){
        imprimeError("numPuerta","El número de puerta ha de ser un número entre 1 y 1000")
        return false;
    }
    
    if(esBlanco(codigoPostal) || !esCodPostalValido(codigoPostal)){
        imprimeError("codigoPostal","El código postal introducido es erroneo, recuerde que ha de contener 5 digitos y ser un número entre 01000 y 52999.")
        return false;
    }
    
    if(esBlanco(ciudad)){
        imprimeError("ciudad","El nombre de la ciudad de envio es necesario.")
        return false;
    }
    //Siempre va a tener algo por el select y el required del html
    
    if(esBlanco(numTarjetaCredito) || !esTarjetaDeCreditoValida(numTarjetaCredito)){
        imprimeError("numTarjeta","El numero de tarjeta es necesario y deberá de tener el formato '1234567890123456' o '1234 1234 1234 1234'.");
        return false;
    }
    
    if(esBlanco(fechaVal) || !esValidaFecha(fechaVal)){
        imprimeError("fechaVal","Este dato es necesario, y debe tener el formato MM/AA.");
        return false;
    }
    if(tarjetaCaducada(fechaVal)){
        imprimeError("fechaVal","Por favor, compruebe la tarjeta. La fecha indicada ya ha pasado.");
        return false;
    }
    
    if(esBlanco(cvv) || !esValidoCVV(cvv)){
        imprimeError("cvv","Este dato es necesario, deben ser 3 números.");
        return false;
    }
    return true;
}

function imprimeError(elemento,texto){
    $("#error_"+elemento).show();
    $("#error_"+elemento).html(texto)
    $("#"+elemento).focus();
}

function esBlanco(texto){
    return texto.trim() == "";
}

function esNumero(numero) {
    if(/^-?\d+$/.test(numero)){
        numero = parseInt(numero);
        return  numero > 0 && numero <= 1000;
    }
    return false;
}

function esCodPostalValido(numero) {
    return /^(?:0[1-9]\d{3}|[1-4]\d{4}|5[0-2]\d{3})$/.test(numero);
}

function esTarjetaDeCreditoValida(numero){
    //De 16 a 16 numeros seguidos o de 4 en 4 separados por espacios
    return /^[0-9]{15,16}|(([0-9]{4}\s){3}[0-9]{3,4})$/.test(numero)
}

function esValidaFecha(fecha){
    return /^(0[1-9]|1[0-2])\/\d{2}$/.test(fecha);
}

function tarjetaCaducada(fecha){
    // Obtener el mes y el año de la cadena
    let partes = fecha.split('/');
    let mes = parseInt(partes[0], 10);
    let anyo = parseInt(partes[1], 10);

    // Obtener la fecha actual
    let fechaActual = new Date();
    let anyoActual = fechaActual.getFullYear() % 100; // Sacamos los 2 últimos meses del año
    let mesActual = fechaActual.getMonth() + 1; // Los meses en js son de 0 a 11

    // Comparar la fecha
    return !(anyo > anyoActual || (anyo === anyoActual && mes >= mesActual));
}

function esValidoCVV(numero){
    return /^[0-9]{3}$/.test(numero);
}

function hacerPeticionPedido(nombreCalle,numPuerta,codigoPostal,provincia,ciudad) {
    //Ponemos la url correcta dependiendo de los filtros
    let url = urlServidor + '/pedido/producto';
    let datos = JSON.stringify({"direccion":{"nombreCalle":nombreCalle,"numPuerta":numPuerta,"codigoPostal":codigoPostal,"provincia":provincia,"ciudad":ciudad},"productos":carrito.getProductos()})

    //Realizamos la peticion mediante ajax
    $.ajax({
      //Url donde hacemos la peticion
      url: url,
      //Datos enviados
      data: datos,
      //Metodo de la peticion
      type: 'POST',
      //Que haremos si la peticion es correcta
      success: function (response) {
        //Vaciamos el carrito
        carrito.vaciarCarrito();
        //Guardamos el carrito
        carrito.guardarCarrito();
        //Actualizamos el numero de elementos en el carrito
        actualizaNumCarrito(carrito);
        //Redirigimos a la pagina del pedido, pasandole el pedido
        window.location.replace(urlServidor+"/pedido/pedido/"+response["pedido"]);
      },
      //Que haremos en caso de error
      error: function () {
        console.error("No ha sido posible realizar el pedido correctamente");
      }
    });
  }