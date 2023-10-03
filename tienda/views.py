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
        productos = list(Producto.objects.values().order_by("nombre"))
        if len(productos) > 0:
            datos = {"message":"Success",'productos':productos}
        else:
            datos = {"message":"No se han encontrado productos disponibles"}
        return JsonResponse(datos,safe = False)