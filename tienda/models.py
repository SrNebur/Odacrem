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
    
#Clase que sirve para añadir marcas a productos
class Marca(models.Model):
    nombre = models.CharField(max_length = 50)

    class Meta:
        verbose_name = "marca"
        verbose_name_plural = "marcas"
    
    def __str__(self):
        return self.nombre

#Clase que servira como base para crear productos de diversos tipos
class Producto(models.Model):
    #El primer valor es el almacenado en la base de datos, el segundo será el mostrado
    SEXO = [
        ("H","Hombre"),
        ("M","Mujer"),
        ("X","Unisex"),
    ]

    nombre = models.CharField(max_length = 40)
    categoria = models.ForeignKey(Categoria,on_delete = models.PROTECT)
    imagen = models.ImageField(upload_to = "tienda", null = True, blank = True)
    precio = models.FloatField()
    disponibilidad = models.BooleanField( default = True)
    #Almacenamos en la base de datos solo estas opciones
    genero = models.CharField(max_length = 1, choices = SEXO, default = "X")
    descripcion = models.TextField(max_length=1500)
    marca = models.ForeignKey(Marca,on_delete = models.PROTECT, null = True, blank = True)


    class Meta:
        verbose_name = "producto"
        verbose_name_plural = "productos"
    
    def __str__(self):
        return self.nombre

#Clases que hijas de Producto que seran productos concretos
class Prod_Ropa(Producto):
        TALLAS = [
        ("S", "S"),
        ("M", "M"),
        ("L", "L"),
        ("XL", "XL"),
        ]
        talla = MultiSelectField(min_choices = 1, max_choices = 4,max_length = 8, choices = TALLAS, blank = False, null = False)
        class Meta:
            verbose_name = "ropa"
            verbose_name_plural = "ropas"

class Prod_Calzado(Producto):
    TALLAS = [
        ("36","36"),("37","37"),("38","38"),("39","39"),("40","40"),("41","41"),("42","42"),("43","43"),("44","44"),("45","45"),("46","46"),("47","47"),("48","48"),("49","49"),("50","50"),("51","51"),("52","52"),("53","53"),("54","54")
    ]
    talla = MultiSelectField(max_choices = 19,min_choices = 1,max_length = 56, choices = TALLAS, blank = False, null = False)
    class Meta:
        verbose_name = "calzado"
        verbose_name_plural = "calzados"

class Prod_Accesorio(Producto):    
    class Meta:
        verbose_name = "accesorio"
        verbose_name_plural = "accesorios"
