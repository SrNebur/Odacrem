from django.db import models
#Libreria para realizar una elección multiple de valores
from multiselectfield import MultiSelectField

# Create your models here.
#Mapeo ORM de las clases categoria y producto

    

class Seccion(models.Model):
    nombre = models.CharField(max_length = 50)

    class Meta:
        verbose_name = "sección"
        verbose_name_plural = "secciones"
    
    def __str__(self):
        return self.nombre

class Categoria(models.Model):
    nombre = models.CharField(max_length = 50)
    #Protegera el producto, solo se podrá borrar la categoria si no existe ningún producto de esa categoria
    seccion = models.ForeignKey(Seccion, on_delete = models.PROTECT)
    class Meta:
        verbose_name = "categoria"
        verbose_name_plural = "categorias"
    
    def __str__(self):
        return self.nombre

class Producto(models.Model):
    #El primer valor es el almacenado en la base de datos, el segundo será el mostrado
    SEXO = [
        ("H","Hombre"),
        ("M","Mujer"),
        ("X","Unisex"),
    ]

    TALLAS = [
        ("S", "S"),
        ("M", "M"),
        ("L", "L"),
        ("XL", "XL"),
    ]
    nombre = models.CharField(max_length = 50)
    categoria = models.ForeignKey(Categoria,on_delete = models.PROTECT)
    imagen = models.ImageField(upload_to = "tienda", null = True, blank = True)
    precio = models.FloatField()
    disponibilidad = models.BooleanField( default = True)
    #Almacenamos en la base de datos solo estas opciones
    genero = models.CharField(max_length = 1, choices = SEXO, default = "X")
    talla = MultiSelectField(max_choices = 4,max_length = 8, choices = TALLAS, blank = True, null = True)


    class Meta:
        verbose_name = "producto"
        verbose_name_plural = "productos"
    
    def __str__(self):
        return self.nombre