# Generated by Django 4.2.4 on 2023-10-03 09:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tienda', '0006_alter_producto_talla'),
    ]

    operations = [
        migrations.RenameField(
            model_name='producto',
            old_name='categorias',
            new_name='categoria',
        ),
    ]
