from app.models import City, Evictions, CensusTracts


def stats_for_tract(tract_id):
    tract = CensusTracts.objects.get(id=tract_id)
    tract_per_1000 = tract.evictions_per_1000()
    town_per_1000 = tract.ma_town.evictions_per_1000()
    town = CensusTracts.objects.get(id=tract_id).ma_town
    evictions = Evictions.objects.filter(census_tract_id=tract).order_by('case_type')
    evictions_count = evictions.count()
    no_cause = evictions.filter(case_type__icontains="No cause").count()
    non_payment = evictions.filter(case_type__icontains="Non-payment").count()

    return {
        'town': town.id,
        'town_per_1000': town_per_1000,
        'tract_per_1000': tract_per_1000,
        'evictions_count': evictions_count,
        'no_cause': no_cause,
        'non_payment': non_payment
    }


def stats_for_tracts(tracts):
    overall_stats = {
        'town': '',
        'town_per_1000': 0,
        'tract_per_1000': 0,
        'evictions_count': 0,
        'no_cause': 0,
        'non_payment': 0
    }
    for tract in tracts:
        tract_stats = stats_for_tract(tract)
        overall_stats['town'] = tract_stats['town']
        overall_stats['evictions_count'] += tract_stats['evictions_count']
        overall_stats['no_cause'] += tract_stats['no_cause']
        overall_stats['non_payment'] += tract_stats['non_payment']

    return overall_stats


def eviction_type_percent(eviction_type, total):
    if total == 0:
        return 0
    return round(eviction_type / total * 100, 1)
