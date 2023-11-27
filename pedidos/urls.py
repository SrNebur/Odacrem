from django.urls import path
from pedidos import views

urlpatterns = [
    path('',views.pedido, name="Pedido"),
    path('producto',views.PedidoView.as_view(), name="obtenerProducto")
]