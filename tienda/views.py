from django.shortcuts import render
from .models import Producto,Categoria,Seccion

# Create your views here.
def tienda(request):
    
    secciones = Seccion.objects.all()
    categorias = Categoria.objects.all()
    parametros = {}
    if request.method == 'GET' and len(request.GET) > 0:
        parametros=dict(request.GET)
        if (sexo:= request.GET['sexo']):
            productos = Producto.objects.all().filter(genero = sexo).order_by("nombre")
    else:
        productos = Producto.objects.all().order_by("nombre")
    return render(request,"tienda.html",{"productos":productos, "secciones":secciones, "categorias":categorias,"parametros":parametros})

