import json
from django.shortcuts import render
from django.http import JsonResponse

from django.db.models import Count
from app.models import City, Evictions, CensusBgs, MaTowns, CensusTracts
from django.db.models.functions import TruncYear, TruncMonth
from django.core import serializers


def index(request):
    """
    Home page
    """

    context = {
        'page_metadata': {
            'title': 'Home page',
        },
        'component_name': 'Home'
    }

    return render(request, "index.html", context)


def get_locales(request):
    type_of_place = request.GET.get('type')
    if type_of_place == 'town':
        locales = Evictions.objects.filter(town__isnull=False).distinct('town') \
            .values_list('town_id', flat=True).order_by('town_id')
    else:
        locales = City.objects.all().values_list('id', flat=True).order_by('id')
    return JsonResponse({"cities": list(locales)})


def get_evictions(request, locale):
    """
    returns per town:
            {"evictions: {year: [list of counts per month}}
            Example:
            {"evictions":
                {"2020": [0, 0, 0, 1, 0, 0, 0, 0, 2, 2, 2, 13],
                "2021": [0, 4, 5, 9, 3, 4, 9, 5, 9, 1, 0, 0]}}
    """
    type_of_place = request.GET.get('type')
    evictions = Evictions.objects.filter(town__id=locale) if type_of_place == 'town' else \
        Evictions.objects.filter(city__id=locale)
    evictions = evictions.annotate(year=TruncYear('file_date'), month=TruncMonth('file_date'), ) \
        .order_by('file_date__year', 'file_date__month') \
        .values('file_date__year', 'file_date__month') \
        .annotate(count=Count('pk'))

    formatted = {}
    for evictions_per_month in evictions:
        year = evictions_per_month['file_date__year']
        month = evictions_per_month['file_date__month']
        count = evictions_per_month['count']
        if year not in formatted:
            formatted[year] = [0] * 12

        formatted[year][month - 1] = count
    return JsonResponse({"evictions": formatted})


def get_eviction_by_id(request, id):
    eviction = Evictions.objects.get(id=id)
    print('eviction', eviction)

    return JsonResponse({'id': eviction.id, 'file_date': eviction.file_date})


def fake_total_pop(census):
    """
    Sometimes total population is less than a certain segment's population
    therefore we have to fake total population with given numbers
    """
    return census.asian_pop + census.black_pop + census.latinx_pop + census.white_pop


def get_statistics(request, id):
    evictions = Evictions.objects.filter(census_tract=id)
    town = CensusTracts.objects.get(id=id).ma_town
    # results = list(evictions)
    count = evictions.count()
    return JsonResponse({
        'town': town.id,
        'evictions': count
    })


def get_geodata(request):
    with open("app/data/census_tracts_geo.json", "r") as f:
        census_tracts = json.load(f)

    with open("app/data/towns_geo.json", "r") as f:
        towns = json.load(f)
    return JsonResponse({"census": census_tracts, "towns": towns})


def get_eviction_details(request, town):
    tract = request.GET.get('tract', '')
    if tract:
        evictions = Evictions.objects.filter(census_tract_id=tract)
    else:
        evictions = Evictions.objects.filter(town=town.upper())
    evictions = list(evictions.values('case_type', 'census_tract', 'ptf', 'ptf_atty',
                                           'file_date', 'town_id'))
    return JsonResponse(evictions, safe=False)
