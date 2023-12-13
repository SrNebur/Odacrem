"""
URL configuration for Odacrem project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

#Importamos static y settings para acceder a los archivos y a las constantes de configuración
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('',include("home.urls")),
    path('tienda/',include("tienda.urls")),
    path('pedido/',include("pedidos.urls")),
    path('login/',include("autenticacion.urls")),
    path('contacto/',include("contacto.urls")),
    path('about/',include("about.urls")),
]

#Agregamos al patron de urls aquella que servirá para servir los documentos de imagenes, indicandole la ruta con las constantes de configuración.
urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)
