from django.shortcuts import render
from .models import Producto,Categoria,Seccion

from django.views import View
from django.http.response import JsonResponse

# Create your views here.
def tienda(request):
    secciones = Seccion.objects.all()
    categorias = Categoria.objects.all()
    return render(request,"tienda.html",{"secciones":secciones, "categorias":categorias,})

class ProductoView(View):
    def get(self,request):
        if len(request.GET) > 0:
            gen = request.GET.get('genero',False)
            cat= request.GET.get('categoria',False)
            if gen and cat:
                productos = Producto.objects.filter(genero=gen,categoria=cat).order_by("nombre").values()
            elif gen:
                productos = Producto.objects.filter(genero=gen).order_by("nombre").values()
            elif cat:
                productos = Producto.objects.filter(categoria=cat).order_by("nombre").values()
            else:
                productos = {}
        else:
            productos = Producto.objects.values().order_by("nombre")
        if len(productos) > 0:
            datos = {"message":"Success",'productos':list(productos)}
        else:
            datos = {"message":"No se han encontrado productos disponibles",'productos':[]}
        return JsonResponse(datos,safe = False)
    
def producto(request,producto_id):
    producto = Producto.objects.get(pk=producto_id)
    productosRelacionados = Producto.objects.filter(categoria=producto.categoria).exclude(pk=producto_id)
    print(productosRelacionados)
    return render(request,"producto.html",{"producto":producto,"productosRelacionados":productosRelacionados})
