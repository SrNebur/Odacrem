#Clase para la personalizacion de formularios

from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True,help_text="Es necesario una cuenta de correo valida para registrarse.")
    class Meta:
        model = User
        fields = ["username","email","password1","password2"]