from django.urls import path
from pedidos import views

urlpatterns = [
    path('carrito',views.pedido, name="Carrito"),
    path('tramitaPedido',views.tramitaPedido, name="TramitaPedido"),
    path('producto',views.PedidoView.as_view(), name="obtenerProducto"),
    path('misPedidos',views.pedidos,name="misPedidos"),
    path('pedido/<int:pedido_id>',views.verPedido,name="verPedido"),
    path('cancelarPedido/<int:pedido_id>',views.cancelarPedido,name="cancelarPedido"),
]