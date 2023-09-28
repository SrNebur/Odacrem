from django.db import models

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
    nombre = models.CharField(max_length = 50)
    categorias = models.ManyToManyField(Categoria)
    imagen = models.ImageField(upload_to = "tienda", null = True, blank = True)
    precio = models.FloatField()
    disponibilidad = models.BooleanField( default = True)

    class Meta:
        verbose_name = "producto"
        verbose_name_plural = "productos"
    
    def __str__(self):
        return self.nombre