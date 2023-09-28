from django.contrib import admin
from .models import Producto,Categoria,Seccion

# Register your models here.

admin.site.register([Seccion,Categoria,Producto])
