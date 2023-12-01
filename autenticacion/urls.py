from django.urls import path
from . import views

urlpatterns = [
    path('',views.VRegistro.as_view(),name="Registro"),
    path('login',views.logear, name="Login"),
    path('cerrar_sesion',views.cerrar_sesion,name="cerrar_sesion"),
]