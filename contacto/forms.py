from django import forms

class FormularioContacto(forms.Form):
    nombre = forms.CharField( label = "Nombre", required = True)
    asunto = forms.CharField( label = "Asunto", required = False)
    email = forms.EmailField(label = "Email")
    contenido = forms.CharField(label = "Contenido", widget = forms.Textarea)