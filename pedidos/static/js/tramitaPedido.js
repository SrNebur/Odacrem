// Importamos la clase Carrito
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
    $(".error").hide();
    $('#formPago').submit(function(event){
        event.preventDefault(); // Quitamos la acción por defecto
        if(validacionFormulario()){ //Validamos el formulario
          //todo petición al backend para crear el pedido 
        }
    });
});


function validacionFormulario(){
    $(".error").hide();
    let nombreCalle = $('#nombreCalle').val();
    if(esBlanco(nombreCalle)){
        imprimeError("nombreCalle","El nombre de la calle es un campo requerido")
        return false;
    }
    let numPuerta = $('#numeroPuerta').val();
    if(!esBlanco(numPuerta) && !esNumero(numPuerta)){
        imprimeError("numPuerta","El número de puerta ha de ser un número entre 1 y 1000")
        return false;
    }
    let codigoPostal = $('#codigoPostal').val();
    if(esBlanco(codigoPostal) || !esCodPostalValido(codigoPostal)){
        imprimeError("codigoPostal","El código postal introducido es erroneo, recuerde que ha de contener 5 digitos y ser un número entre 01000 y 52999.")
        return false;
    }
    let ciudad = $('#ciudad').val();
    if(esBlanco(ciudad)){
        imprimeError("ciudad","El nombre de la ciudad de envio es necesario.")
        return false;
    }
    //Siempre va a tener algo por el select y el required del html
    let provincia = $('#provincia').val();
    let numTarjetaCredito = $('#numTarjetaCredito').val();
    if(esBlanco(numTarjetaCredito) || !esTarjetaDeCreditoValida(numTarjetaCredito)){
        imprimeError("numTarjeta","El numero de tarjeta es necesario y deberá de tener el formato '1234567890123456' o '1234 1234 1234 1234'.");
        return false;
    }
    let fechaVal = $('#fechaVal').val();
    if(esBlanco(fechaVal) || !esValidaFecha(fechaVal)){
        imprimeError("fechaVal","Este dato es necesario, y debe tener el formato MM/AA.");
        return false;
    }
    if(tarjetaCaducada(fechaVal)){
        imprimeError("fechaVal","Por favor, compruebe la tarjeta. La fecha indicada ya ha pasado.");
        return false;
    }
    let cvv = $('#cvv').val();
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

