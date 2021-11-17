import json
from django.shortcuts import render
from django.http import JsonResponse
from django.db.models import F

from django.db.models import Count
from app.models import City, Evictions, CensusBgs, MaTowns
from django.db.models.functions import TruncYear, TruncMonth


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


def get_statistics(request):
    black = CensusBgs.objects.filter(black_pop__gt=F('white_pop')).filter(
        black_pop__gt=F('asian_pop')).filter(black_pop__gt=F('latinx_pop')).order_by('-black_pop')
    black_sorted = sorted(black,
                          key=lambda x: x.black_pop / fake_total_pop(x),
                          reverse=True)
    white = CensusBgs.objects.filter(white_pop__gt=F('black_pop')).filter(
        white_pop__gt=F('asian_pop')).filter(white_pop__gt=F('latinx_pop')).order_by('-white_pop')
    white_sorted = sorted(white,
                          key=lambda x: x.white_pop / fake_total_pop(x),
                          reverse=True)
    latino = CensusBgs.objects.filter(latinx_pop__gt=F('black_pop')).filter(
        latinx_pop__gt=F('asian_pop')).filter(latinx_pop__gt=F('white_pop')).order_by('-latinx_pop')
    latino_sorted = sorted(latino,
                           key=lambda x: x.latinx_pop / fake_total_pop(x),
                           reverse=True)
    asian = CensusBgs.objects.filter(asian_pop__gt=F('black_pop')).filter(
        asian_pop__gt=F('latinx_pop')).filter(asian_pop__gt=F('white_pop')).order_by('-asian_pop')
    asian_sorted = sorted(asian,
                          key=lambda x: x.asian_pop / fake_total_pop(x),
                          reverse=True)

    pops = {
        'asian': asian,
        'black': black,
        'latino': latino,
        'white': white,
    }
    results = {
        'majority_neighborhoods': {},
        'top': {
            'asian': [],
            'black': [],
            'latino': [],
            'white': [],
        }
    }

    def get_percent(pop, census):
        if pop == 'white':
            return round(100 * (census.white_pop / fake_total_pop(census)), 1)
        elif pop == 'black':
            return round(100 * (census.black_pop / fake_total_pop(census)), 1)
        elif pop == 'latino':
            return round(100 * (census.latinx_pop / fake_total_pop(census)), 1)
        elif pop == 'asian':
            return round(100 * (census.asian_pop / fake_total_pop(census)), 1)

    for pop, res in pops.items():
        results['majority_neighborhoods'][pop] = len(res)
        for census in res[:10]:
            eviction_count = Evictions.objects.filter(census_bg=census).count()
            results['top'][pop].append({
                'id': census.id,
                'name': census.name,
                'town': census.ma_town.id,
                'total_population': census.tot_pop,
                'total_renters': census.tot_renters,
                '%rent': round(census.rent_pct, 1) if census.rent_pct else None,
                'evictions': eviction_count,
                f'%population_{pop}': get_percent(pop, census)
            })

    return JsonResponse(results)


def get_geodata(request):
    with open("app/data/census_tracts_geo.json", "r") as f:
        census_tracts = json.load(f)

    with open("app/data/towns_geo.json", "r") as f:
        towns = json.load(f)
    return JsonResponse({"census": census_tracts, "towns": towns})
