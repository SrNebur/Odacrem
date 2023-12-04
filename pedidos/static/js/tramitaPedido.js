'use strict';


$(document).ready(function () {
    $(".error").hide();
    $('#formPago').submit(function(event){
        event.preventDefault();
        validacionFormulario();
    });
});


function validacionFormulario(){
    let nombreCalle = $('#nombreCalle').val();
    if(esBlanco(nombreCalle)){
        imprimeError("nombreCalle","El nombre de la calle es un campo requerido")
        return false;
    }
    let numeroPuerta = $('#numeroPuerta').val();
    let codigoPostal = $('#codigoPostal').val();
    let ciudad = $('#ciudad').val();
    let provincia = $('#provincia').val();
    return false;
}

function imprimeError(elemento,texto){
    $("#error_"+elemento).show();
    $("#error_"+elemento).html(texto)
}

function esBlanco(texto){
    return texto.trim() == "";
}

function esNumeroValido(numero) {
    return Number.isInteger(numero) && numero > 0 && numero < 1000;
}

function esCodPostalValido(numero) {
    return numero.match("/^(?:0[1-9]\d{3}|[1-4]\d{4}|5[0-2]\d{3})$/");
}

