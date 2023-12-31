# Generated by Django 4.2.4 on 2023-09-28 10:28

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('tienda', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Categoria',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=50)),
            ],
            options={
                'verbose_name': 'categoria',
                'verbose_name_plural': 'categorias',
            },
        ),
        migrations.CreateModel(
            name='Seccion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=50)),
            ],
            options={
                'verbose_name': 'sección',
                'verbose_name_plural': 'secciones',
            },
        ),
        migrations.DeleteModel(
            name='CategoriaProd',
        ),
        migrations.AddField(
            model_name='categoria',
            name='seccion',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='tienda.seccion'),
        ),
        migrations.AlterField(
            model_name='producto',
            name='categorias',
            field=models.ManyToManyField(to='tienda.categoria'),
        ),
    ]
