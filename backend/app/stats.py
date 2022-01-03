from django.db.models import Sum

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
    asian_renters = tract.asian_renters
    black_renters = tract.black_renters
    latinx_renters = tract.latinx_renters
    white_renters = tract.white_renters
    under18_pop = tract.under18_pop
    tot_renters = tract.tot_renters

    return {
        'town': town.id,
        'town_per_1000': town_per_1000,
        'tract_per_1000': tract_per_1000,
        'evictions_count': evictions_count,
        'no_cause': no_cause,
        'non_payment': non_payment,
        'asian_renters': asian_renters,
        'black_renters': black_renters,
        'latinx_renters': latinx_renters,
        'white_renters': white_renters,
        'under18_pop': under18_pop,
        'tot_renters': tot_renters
    }


def stats_for_tracts(tracts):
    overall_stats = {
        "town": "",
        "town_per_1000": 0,
        "tract_per_1000": 0,
        "evictions_count": 0,
        "no_cause": 0,
        "non_payment": 0,
        "asian_renters": 0,
        "black_renters": 0,
        "latinx_renters": 0,
        "white_renters": 0,
        "under18_pop": 0,
        "tot_renters": 0
    }
    for tract in tracts:
        tract_stats = stats_for_tract(tract)

        overall_stats["town"] = tract_stats["town"]
        overall_stats["evictions_count"] += tract_stats["evictions_count"]
        overall_stats["no_cause"] += tract_stats["no_cause"]
        overall_stats["non_payment"] += tract_stats["non_payment"]
        overall_stats["asian_renters"] += tract_stats["asian_renters"]
        overall_stats["black_renters"] += tract_stats["black_renters"]
        overall_stats["latinx_renters"] += tract_stats["latinx_renters"]
        overall_stats["white_renters"] += tract_stats["white_renters"]
        overall_stats["under18_pop"] += tract_stats["under18_pop"]
        overall_stats["tot_renters"] += tract_stats["tot_renters"]

    if overall_stats["tot_renters"] > 0:
        # we can do percent (preferred) if we have tot_renters
        overall_stats["asian_renters"] = \
            str(round((overall_stats["asian_renters"] / overall_stats["tot_renters"]) * 100,
                      1)) + "%"
        overall_stats["black_renters"] = \
            str(round((overall_stats["black_renters"] / overall_stats["tot_renters"]) * 100,
                      1)) + "%"
        overall_stats["latinx_renters"] = \
            str(round((overall_stats["latinx_renters"] / overall_stats["tot_renters"]) * 100,
                      1)) + "%"
        overall_stats["white_renters"] = \
            str(round((overall_stats["white_renters"] / overall_stats["tot_renters"]) * 100,
                      1)) + "%"
        overall_stats["evictions_pct"] = round((overall_stats["evictions_count"] / overall_stats[
            "tot_renters"]) * 100, 1)
    return overall_stats


def eviction_type_percent(eviction_type, total):
    if total == 0:
        return 0
    return round(eviction_type / total * 100, 1)


def total_census(total="tot_renters"):
    sum_key = total + "__sum"
    return int(CensusTracts.objects.aggregate(Sum(total))[sum_key])
