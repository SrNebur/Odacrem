# Generated by Django 4.2.4 on 2023-12-07 00:26

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pedidos', '0007_alter_productopedido_table'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='direcciones',
            name='pedido',
        ),
        migrations.AddField(
            model_name='pedido',
            name='direccion',
            field=models.ForeignKey(default='', on_delete=django.db.models.deletion.CASCADE, to='pedidos.direcciones'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='pedido',
            name='estado',
            field=models.CharField(choices=[('preparando', 'EN PREPARACION'), ('reparto', 'EN REPARTO'), ('entregado', 'ENTREGADO'), ('cancelado', 'CANCELADO')], default='preparando'),
        ),
    ]
