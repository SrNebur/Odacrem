from django.shortcuts import render
from .models import Categoria,Seccion, Producto

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
                productos = list(Prod_Ropa.objects.filter(disponibilidad = True,genero=gen,categoria=cat).values())
                productos.extend(list(Prod_Calzado.objects.filter(disponibilidad=True,genero=gen,categoria=cat).values()))
                productos.extend(list(Prod_Accesorio.objects.filter(disponibilidad = True,genero=gen,categoria=cat).values()))
            elif gen:
                productos = list(Prod_Ropa.objects.filter(disponibilidad = True,genero = gen).values())
                productos.extend(list(Prod_Calzado.objects.filter(disponibilidad=True,genero = gen).values()))
                productos.extend(list(Prod_Accesorio.objects.filter(disponibilidad = True,genero = gen).values()))
            elif cat:
                productos = list(Prod_Ropa.objects.filter(disponibilidad = True,categoria = cat).values())
                productos.extend(list(Prod_Calzado.objects.filter(disponibilidad=True,categoria = cat).values()))
                productos.extend(list(Prod_Accesorio.objects.filter(disponibilidad = True,categoria = cat).values()))
            else:
                productos = {}
        else:
            #Recuperamos los productos de cada tipo y los añadimos a la lista
            #productos = list(Prod_Ropa.objects.filter(disponibilidad = True).values())
            #productos.extend(list(Prod_Calzado.objects.filter(disponibilidad=True).values()))
            #productos.extend(list(Prod_Accesorio.objects.filter(disponibilidad = True).values()))
            productos = Producto.objects.all().values()


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
