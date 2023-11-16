from django.contrib import admin
from .models import Seccion,Categoria,Prod_Accesorio,Prod_Ropa,Prod_Calzado

# Register your models here.

admin.site.register([Seccion,Categoria,Prod_Accesorio,Prod_Calzado,Prod_Ropa])
