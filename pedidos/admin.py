from django.contrib import admin

from .models import Pedido,ProductoPedido, Direcciones

# Register your models here.
@admin.register(Pedido)
class PedidoAdmin(admin.ModelAdmin):
    search_fields=("user__username","direccion__nombre","direccion__ciudad","estado")
    list_display=("id","user","direccion","created_at","estado")
    list_filter=("user__username","estado","created_at","direccion__nombre","direccion__ciudad")
    list_editable=("estado",)
    list_per_page=20

@admin.register(ProductoPedido)
class ProductoPedidoAdmin(admin.ModelAdmin):
    search_fields=("producto__nombre","pedido__id")
    list_display=("producto","cantidad","pedido","talla")
    list_filter=("producto__nombre","pedido")
    list_per_page=20

@admin.register(Direcciones)
class DireccionesAdmin(admin.ModelAdmin):
    search_fields=("nombre","numero","codigoPostal","ciudad",)
    list_filter=("ciudad","provincia",)
    list_display=("nombre","numero","codigoPostal","ciudad","provincia")
    list_per_page=20
