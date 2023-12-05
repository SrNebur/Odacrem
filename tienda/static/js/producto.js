//Importamos el carrito
import Carrito from './carrito.js';
import {actualizaNumCarrito} from './base.js';

//variable global que guarda el carrito de la tienda
var carrito


'use strict';

$(document).ready(function () {
    if(sessionStorage.getItem("carrito")){
      carrito = new Carrito(sessionStorage.getItem("carrito"))
    }else{
      carrito = new Carrito();
    }
    //Carrusel caracteristicas
    $('#carousel-producto-relacionado').slick({
        infinite: true,
        slidesToShow: 4,
        slidesToScroll: 3,
        arrows: true,
        dots: true,
        responsive: [{
            breakpoint: 1024,
            settings: {
                slidesToShow: 3,
                slidesToScroll: 3
            }
        },
        {
            breakpoint: 600,
            arrows: false,
            settings: {
                slidesToShow: 2,
                slidesToScroll: 2
            }
        },
        {
            breakpoint: 480,
            settings: {
                arrows: false,
                slidesToShow: 2,
                slidesToScroll: 2
            }
        }]
    });

    //Boton quitar cantidad
    $('#btn-minus').click(function () {
        var val = $("#cantidad").html();
        val = (val == '1') ? val : val - 1;
        $("#cantidad").html(val);
        return false;
    });

    //Boton suma cantidad
    $('#btn-plus').click(function () {
        var val = $("#cantidad").html();
        val = (val == '20') ? val : parseInt(val) + 1;
        $("#cantidad").html(val);
        return false;
    });

    //Boton de talla
    $('.btn-size').click(function () {
        $(".btn-size").removeClass('btn-secondary');
        $(".btn-size").addClass('btn-success');
        $(this).removeClass('btn-success');
        $(this).addClass('btn-secondary');
        $("#anyadirCarrito").attr("talla",$(this).text())
        $("#comprar").attr("talla",$(this).text())
    });

    
    //Boton de añadir al carrito
    $('#anyadirCarrito').click(function () {
        let id = $(this).attr('value')
        let talla = $(this).attr('talla')
        let cantidad = $("#cantidad").html();
        //console.log("Producto "+id+" añadido "+cantidad+" veces")
        if(talla == ""){
            talla = undefined;
        }
        carrito.agregarCantidad(id,cantidad,talla)
        
        carrito.guardarCarrito();
  
        actualizaNumCarrito(carrito);
    });

    //Boton de comprar, se anyade al articulo y se lleva a la pagina del carrito para tramitar compra
    $('#comprar').click(function () {
        let id = $(this).attr('value')
        let talla = $(this).attr('talla')
        let cantidad = $("#cantidad").html();
        carrito.anyadirProducto(id,cantidad,talla)
        carrito.guardarCarrito();
        actualizaNumCarrito(carrito);
    });

});