# Generated by Django 4.2.4 on 2023-11-24 13:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tienda', '0013_alter_producto_marca'),
    ]

    operations = [
        migrations.AlterField(
            model_name='producto',
            name='nombre',
            field=models.CharField(max_length=40),
        ),
    ]
