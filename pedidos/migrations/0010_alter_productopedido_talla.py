# Generated by Django 4.2.4 on 2023-12-11 16:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('pedidos', '0009_alter_direcciones_numero'),
    ]

    operations = [
        migrations.AlterField(
            model_name='productopedido',
            name='talla',
            field=models.CharField(),
        ),
    ]
