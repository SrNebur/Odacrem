from django.shortcuts import render
from .models import Categoria,Seccion, Producto, Prod_Ropa, Prod_Calzado

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
                productos = Producto.objects.filter(genero=gen, categoria=cat, disponibilidad = True).order_by("nombre").values()
            elif gen:
                productos = Producto.objects.filter(genero=gen, disponibilidad = True).order_by("nombre").values()
            elif cat:
                productos = Producto.objects.filter(categoria=cat, disponibilidad = True).order_by("nombre").values()
            else:
                productos = {}
        else:
            productos = Producto.objects.filter(disponibilidad = True).order_by("nombre").values()


        if len(productos) > 0:
            datos = {"message":"Success",'productos':list(productos)}
        else:
            datos = {"message":"No se han encontrado productos disponibles",'productos':[]}
        return JsonResponse(datos,safe = False)
    
def producto(request,producto_id):
    producto = Producto.objects.get(pk=producto_id)
    productosRelacionados = Producto.objects.filter(categoria=producto.categoria).exclude(pk=producto_id)
    try:
        tallas = Prod_Ropa.objects.get(producto_ptr_id = producto_id)
    except Prod_Ropa.DoesNotExist:
        tallas = []

    if not tallas:
        try:
            tallas = Prod_Calzado.objects.get(producto_ptr_id = producto_id)
        except Prod_Calzado.DoesNotExist:
            tallas = []
        
    print(productosRelacionados)
    return render(request,"producto.html",{"producto":producto,"productosRelacionados":productosRelacionados,"tallas": tallas})
