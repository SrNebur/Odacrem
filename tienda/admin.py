from django.contrib import admin
from .models import Seccion,Categoria,Prod_Accesorio,Prod_Ropa,Prod_Calzado,Marca

# Register your models here.
class SeccionAdmin(admin.ModelAdmin):
    search_fields=("nombre",)
    list_per_page=20

class CategoriaAdmin(admin.ModelAdmin):
    list_display=("nombre","seccion",)
    search_fields=("nombre","seccion__nombre",)
    list_filter=("seccion__nombre",)
    list_per_page=20

class Prod_AccesorioAdmin(admin.ModelAdmin):
    search_fields=("nombre","categoria__nombre","genero","marca__nombre")
    list_display=("nombre","precio","categoria","genero","marca","disponibilidad")
    list_filter=("disponibilidad","genero","marca__nombre")
    list_editable=("disponibilidad",)
    list_per_page=20

class Prod_CalzadoAdmin(admin.ModelAdmin):
    list_display=("nombre","precio","categoria","genero","marca","talla","disponibilidad")
    search_fields=("nombre","categoria__nombre","genero","marca__nombre")
    list_filter=("disponibilidad","genero","marca__nombre")
    list_editable=("disponibilidad",)

    list_per_page=20
    
class Prod_RopaAdmin(admin.ModelAdmin):
    list_display=("nombre","precio","categoria","genero","marca","talla","disponibilidad")
    search_fields=("nombre","categoria__nombre","genero","marca__nombre")
    list_filter=("disponibilidad","genero","marca__nombre")
    list_editable=("disponibilidad",)
    list_per_page=20

class MarcaAdmin(admin.ModelAdmin):
    search_fields=("nombre",)
    search_fields=("nombre",)
    list_per_page=20

admin.site.register(Seccion,SeccionAdmin)
admin.site.register(Categoria,CategoriaAdmin)
admin.site.register(Prod_Accesorio,Prod_AccesorioAdmin)
admin.site.register(Prod_Calzado,Prod_CalzadoAdmin)
admin.site.register(Prod_Ropa,Prod_RopaAdmin)
admin.site.register(Marca,MarcaAdmin)



