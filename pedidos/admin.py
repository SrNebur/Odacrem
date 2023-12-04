from django.contrib import admin

from .models import Pedido,ProductoPedido, Direcciones

# Register your models here.
admin.site.register([Pedido,ProductoPedido,Direcciones])