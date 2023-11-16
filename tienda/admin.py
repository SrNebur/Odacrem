from django.contrib import admin
from .models import Seccion,Categoria,Prod_Ropa,Prod_Calzado,Prod_Accesorio

# Register your models here.

admin.site.register([Seccion,Categoria,Prod_Ropa,Prod_Calzado,Prod_Accesorio])
