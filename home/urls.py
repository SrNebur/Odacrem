#Archivo que contendrá todas las urls de esta aplicación
from django.urls import path
from home import views

urlpatterns = [
    path('',views.home, name="Home"),
    path('error',views.error,name="Error")
]