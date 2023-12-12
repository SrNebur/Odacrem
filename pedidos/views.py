from django.shortcuts import render

from django.views import View
from django.http.response import JsonResponse
from tienda.models import Producto
from .models import ProductoPedido,Pedido,Direcciones
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import redirect
import json
# Create your views here.

def pedido(request):
    return render(request,"carrito.html")

@login_required(login_url="/login/login")
def tramitaPedido(request):
    return render(request,"tramitaPedido.html")

@login_required(login_url="/login/login")
def verPedido(request,pedido_id):
    pedidos = Pedido.objects.filter(user_id = request.user)
    pedido = Pedido.objects.get(id=pedido_id)
    if pedidos.contains(pedido):
        productosPedidos = ProductoPedido.objects.filter(pedido_id = pedido.id)
        total = 0
        for p in productosPedidos:
            total += p.producto.precio * p.cantidad
            
        return render(request,"verPedido.html",{"pedido":pedido,"productos":productosPedidos,"precio":total})
    else:
        return redirect("Error")
    
@login_required(login_url="/login/login")
def pedidos(request):
    pedidos = list(Pedido.objects.filter(user_id = request.user).values())
    return render(request,"pedidos.html",{"pedidos":pedidos})

@login_required(login_url="/login/login")
def cancelarPedido(request,pedido_id):
    pedidos = Pedido.objects.filter(user_id = request.user)
    pedido = Pedido.objects.get(id=pedido_id)
    if pedidos.contains(pedido):
        #print("Pedido a cancelar: "+str(pedido_id))
        pedido.estado = "cancelado"
        pedido.save()
        return redirect("misPedidos")
    else:
        return redirect("Error")



class PedidoView(View):
    @method_decorator(csrf_exempt)
    def dispatch(self, request, *args, **kwargs):
        return super().dispatch(request, *args, **kwargs)
    

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
    
    def post(self,request):
        jsonData = json.loads(request.body)

        productos = jsonData["productos"]
        direccion = jsonData["direccion"]
        #print(productos)
        #print(direccion)

        #Creacion de la direccion del pedido
        #Miramos si hay numero de puerta para buscar la dirección
        if direccion['numPuerta'] != '':
            #Buscamos si la direccion existe
            dir = Direcciones.objects.filter(nombre = str(direccion['nombreCalle']).lower(),numero = int(direccion['numPuerta']),codigoPostal = direccion['codigoPostal'])
            if not dir:
                #Si no existe la creamos
                dir = Direcciones.objects.create(nombre = str(direccion['nombreCalle']).lower(),numero = int(direccion['numPuerta']),codigoPostal = direccion['codigoPostal'],ciudad = direccion['ciudad'],provincia = direccion['provincia'])
            else:
                dir = dir[0]
        #Lo mismo que antes pero sin tener el cuenta el numero
        else:
            dir = Direcciones.objects.filter(nombre = str(direccion['nombreCalle']).lower(),codigoPostal = direccion['codigoPostal'])
            if not dir:
                dir = Direcciones.objects.create(nombre = str(direccion['nombreCalle']).lower(),codigoPostal = direccion['codigoPostal'],ciudad = direccion['ciudad'],provincia = direccion['provincia'])
            else:
                dir = dir[0]

        
        #Creacion del nuevo pedido con el usuario y la direccion
        ped = Pedido.objects.create(direccion = dir,user = request.user)
        #Insercion de los productos del pedido creado
        for prod in productos:
            #Buscamos el producto
            p = Producto.objects.get(pk=prod['id'])
            #print("Pedido de producto: ",prod['id'],"cantidad: ",prod["cantidad"],"talla: ",prod["talla"])
            ProductoPedido.objects.create(producto = p,pedido = ped,cantidad = prod["cantidad"],talla = prod["talla"])

        datos = {"message":"Success","pedido":ped.id}
        return JsonResponse(datos,safe = False)