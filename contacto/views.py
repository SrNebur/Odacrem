from django.shortcuts import render,redirect
from django.core.mail import EmailMessage
from .forms import FormularioContacto
from django.conf import settings

# Create your views here.
def contacto(request):
    formulario_contacto = FormularioContacto()

    if request.method == "POST":
        formulario_contacto=FormularioContacto(data = request.POST)
        
        if formulario_contacto.is_valid():
            nombre = request.POST.get("nombre")
            asunto = request.POST.get("asunto")
            email = request.POST.get("email")
            contenido = request.POST.get("contenido")

            
            correo = EmailMessage("Mensaje de contacto de {} con asunto: {}".format(nombre,asunto),
                  "El usuario con nombre {} con la dirección {} escribe lo siguiente:\n\n {}".format(nombre,email,contenido),
                  "",[settings.EMAIL_HOST_USER],reply_to=[email])
            #Contructor email("Asunto","Mensaje del correo"),"deQuienViene",["cuenta/s destino"],destinatario contestación)
            try:
                correo.send()
                return redirect("/contacto/?valido")
            except:
                return redirect("/contacto/?novalido")

    return render(request,"contacto.html",{"formulario": formulario_contacto})