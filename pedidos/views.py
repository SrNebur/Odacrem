from django.shortcuts import render

from django.views import View
from django.http.response import JsonResponse
from tienda.models import Producto

# Create your views here.

def pedido(request):
    return render(request,"pedido.html")


class PedidoView(View):
    def get(self,request):
        producto_id= request.GET.get('id',False)
        if producto_id:
            producto = Producto.objects.filter(pk=producto_id).values()
            if producto:
                datos = {"message":"Success",'producto':list(producto)}
            else:
                datos = {"message":"No se ha encontrado el producto",'producto':[]}
            return JsonResponse(datos,safe = False)

        else:
            datos = {"message":"Se necesita un id para buscar el producto"}
            return JsonResponse(datos,safe = False)
            
        