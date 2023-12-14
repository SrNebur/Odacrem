from django.db import models
#Importamos el método para obtener el id del usuario actual
from django.contrib.auth import get_user_model
from tienda.models import Producto
from django.db.models import F,Sum,FloatField

# Create your models here.
#Obtenemos el usuario actual
User = get_user_model()


class Direcciones(models.Model):
    PROVINCIAS = [("VI", "Álava"),("AB", "Albacete"),("A", "Alicante"),("AL", "Almería"),("O", "Asturias"),("AV", "Ávila"),("BA", "Badajoz"),("B", "Barcelona"),("BU", "Burgos"),("CC", "Cáceres"),("CA", "Cádiz"),("S", "Cantabria"),("CS", "Castellón"),("CR", "Ciudad Real"),("CO", "Córdoba"),("CU", "Cuenca"),("GI", "Gerona"),("GR", "Granada"),("GU", "Guadalajara"),("SS", "Guipúzcoa"),("H", "Huelva"),("HU", "Huesca"),("PM", "Islas Balears"),("J", "Jaén"),("C", "La Coruña"),("LO", "La Rioja"),("GC", "Las Palmas"),("LE", "León"),("L", "Lérida"),("LU", "Lugo"),("M", "Madrid"),("MA", "Málaga"),("MU", "Murcia"),("NA", "Navarra"),("OR", "Orense"),("P", "Palencia"),("PO", "Pontevedra"),("SA", "Salamanca"),("TF", "Santa Cruz de Tenerife"),("SG", "Segovia"),("SE", "Sevilla"),("SO", "Soria"),("T", "Tarragona"),("TE", "Teruel"),("TO", "Toledo"),("V", "Valencia"),("VA", "Valladolid"),("BI", "Vizcaya"),("ZA", "Zamora"),("Z", "Zaragoza")]

    nombre  = models.CharField(max_length = 40)
    numero = models.IntegerField(blank=True,null = True)
    codigoPostal = models.IntegerField()
    ciudad = models.CharField(max_length = 40)
    provincia = models.CharField(choices = PROVINCIAS)

    def __str__(self):
        return self.nombre+","+str(self.numero) +","+str(self.codigoPostal)+" "+self.ciudad+","+self.provincia

    class Meta:
        #Nombre en singular y plural
        verbose_name='direccion'
        verbose_name_plural = 'direcciones'
        #Campo por el cual se va a ordenar
        ordering=['id']

class Pedido(models.Model):
    ESTADOS = (("preparando","EN PREPARACION"),
               ("reparto","EN REPARTO"),
               ("entregado","ENTREGADO"),
               ("cancelado","CANCELADO"),
               )
    #Guardamos el usaurio y decimos que en el caso de que se borre el usuario sus pedidos también se borrarán
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    estado = models.CharField(choices = ESTADOS, default = "preparando")
    direccion = models.ForeignKey(Direcciones,on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add = True)

    #Indicamos que como toString nos devuelva el id
    def __str__(self):
        return "Pedido nº " + str(self.id)
    class Meta:
        #Nombre en singular y plural
        verbose_name='pedido'
        verbose_name_plural = 'pedidos'
        #Campo por el cual se va a ordenar
        ordering=['id']


class ProductoPedido(models.Model):

    producto = models.ForeignKey(Producto,on_delete=models.CASCADE)
    pedido= models.ForeignKey(Pedido,on_delete=models.CASCADE)
    cantidad = models.IntegerField(default = 1)
    talla = models.CharField()
    created_at = models.DateTimeField(auto_now_add = True)

    def __str__(self):
        return f'{self.cantidad} unidades de {self.producto.nombre}'
    
    class Meta:
        #Nombre en singular y plural
        verbose_name='Productos de cada Pedido'
        verbose_name_plural = 'Productos de los Pedido'
        #Campo por el cual se va a ordenar
        ordering=['id']

