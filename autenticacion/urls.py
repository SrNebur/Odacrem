from django.urls import path
from . import views

urlpatterns = [
    path('',views.VRegistro.as_view(),name="Registro"),
    path('login',views.logear, name="Login"),
]