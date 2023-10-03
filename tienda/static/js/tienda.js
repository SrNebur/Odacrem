
'use strict';
$(document).ready(
  function () {

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

    //Filtrado de los filtros activos
    $('.filtroGen').click(function () {
      let generoSeleccionado = $(this).attr('genero');
      $('.producto').hide();
      $('.producto[genero="' + generoSeleccionado + '"]').show();

    })

    $('.sinFiltro').click(function () {
      $('.producto').show();
    })

    $('.filtroCat').click(function () {
      let categoriaSeleccionada = $(this).attr('categoria');
      $('.producto').hide();
      $('.producto[categoria="' + categoriaSeleccionada + '"]').show();

    })



    //Todo
    $('.sort').on("change", function () {
      $('.producto').hide();
      var div = document.getElementById("prod"),para = document.querySelectorAll('.producto');
      var paraArr = [].slice.call(para).sort(function (a, b) {
        return a.getAttribute("precio") - b.getAttribute("precio");
      });
      console.log(paraArr);
      paraArr.forEach(function (p) {
        div.appendChild(p);
      });
      //let productos = $('.producto').tinysort(prod, { attr: ("precio") })
      //productos.show()
      
      //productos.show()

    })






  });
