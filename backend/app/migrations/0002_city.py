from django.db import migrations, models
from django.template.defaultfilters import slugify


def populate_cities(apps, schema_editor):
    # This is to standardize cities. We collect them all, lower case them, slugify them,
    # and add them as unique rows to the City table.
    # Next step is to change eviction cities to be foreignkeys of City
    City = apps.get_model('app', 'City')
    Evictions = apps.get_model('app', 'Evictions')
    for eviction in Evictions.objects.all():
        try:
            city, created = City.objects.get_or_create(id=slugify(eviction.city))
            city.name = eviction.city.lower()
            city.save()
        except:
            pass


def depopulate_cities(apps, schema_editor):
    # backward migration, in case you need to step back
    City = apps.get_model('app', 'City')
    City.objects.all().delete()


class Migration(migrations.Migration):
    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='City',
            fields=[
                ('id', models.SlugField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=200)),
            ],
        ),
        migrations.RunPython(populate_cities, depopulate_cities)
    ]
