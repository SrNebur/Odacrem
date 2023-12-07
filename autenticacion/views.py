from django.shortcuts import render,redirect
from django.views.generic import View

#Importación de los formularios para la creacion de usuarios y el logeo
from django.contrib.auth.forms import AuthenticationForm
#Importamos libreria para logear al usuario automaticamente, deslogearlo y autentificar la información de usuario
from django.contrib.auth import login, logout, authenticate
#Importamos el metodo para mostrar todos los mensajes de error
from django.contrib import messages
from .forms import CustomUserCreationForm

# Create your views here.
# Clase encargada de la vista registro, gestionará get y post con cada uno de sus métodos
class VRegistro(View):

    def get(self,request):
        form = CustomUserCreationForm()
        return render(request,"registro.html",{"form":form})

    def post(self,request):
        #Obtenemos el formulario con los datos necesarios
        form = CustomUserCreationForm(request.POST)
        #Comprobamos si el usuario es valido
        if form.is_valid():
            #Insertamos en la base de datos el usuario
            usuario = form.save()
            #Logeamos al usuario automaticamente
            login(request,usuario)
            #Redirigimos al Home
            return redirect("Home")
        else:
            #Recorremos los mensajes de error
            for msg in form.error_messages:
                #Vamos mostrando todos los mensajes de error obtenidos en el formulario
                messages.error(request,form.error_messages[msg])
            #Volvemos al formulario de registro mostrando todos los errores
            return render(request,"registro.html",{"form":form})



def logear(request):
    #Miramos si el metodo del request es Post, es decir, nos han hecho una petición de logeo
    if request.method == "POST":
        #Creamos el formulario pasandole la información que nos dieron en la petición
        form = AuthenticationForm(request,data = request.POST)
        #Miramos si el formulario es valido, es decir, si la información pasada es correcta
        if form.is_valid():
            #Obtenemos el nombre de usuario y la contraseña correctamente
            nombre_usuario = form.cleaned_data.get("username")
            contra = form.cleaned_data.get("password")
            #Intentamos encontrar al usuario pasado, devolvera None en caso de que no se pueda
            usuario = authenticate(username=nombre_usuario, password = contra)
            #Miramos si se ha podido encontrar el usuario
            if usuario is not None:
                #Logeamos al usuario encontramo y redirigimos al home
                login(request,usuario)
                return redirect("Home")
            else:
                #Devolvemos error diciendo que el usuario no es valido
                messages.error(request,"Usuario no valido",extra_tags="danger")
        else:
                #Devolvemos error diciendo la información pasada no es correcta, ponemos el extra_tags para el estilo
                messages.error(request,"Usuario o contraseña incorrectos",extra_tags="danger")

    form = AuthenticationForm()
    return render(request,"login.html",{"form":form})

def cerrar_sesion(request):
    logout(request)
    return redirect("Home")