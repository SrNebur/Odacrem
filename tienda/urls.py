from django.urls import path
from tienda import views

urlpatterns = [
    path('',views.tienda, name="Tienda"),
    path('producto/<int:producto_id>',views.producto, name="Producto"),
    path('productos',views.ProductoView.as_view(), name="productos_list"),
]