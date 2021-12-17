from django.db.models import Sum

from app.models import Evictions, CensusBgs, CensusTracts, MaTowns
from shapely import wkb
from geopandas import gpd
import pandas as pd


def get_town_geometry():
    towns = MaTowns.objects.all().values('town_id', 'id', 'geometry')
    towns_df = pd.DataFrame(towns)

    towns_gpd = gpd.GeoDataFrame(towns_df)
    towns_gpd['geometry'] = towns_gpd['geometry'].transform(transform_to_geo)
    towns_gpd.to_file(
        "./app/data/town_geo.json", driver="GeoJSON")


def old_transformation():
    evictions = Evictions.objects.all().values()
    evictions_df = pd.DataFrame(evictions)
    evictions_gpd = gpd.GeoDataFrame(evictions_df)
    census = CensusBgs.objects.all().values()
    census_df = pd.DataFrame(census)
    census_gpd = gpd.GeoDataFrame(census_df)
    evictions_gpd['geometry'] = evictions_gpd['geometry'].transform(transform_to_geo)
    census_gpd['geometry'] = census_gpd['geometry'].transform(transform_to_geo)
    pointInPoly = gpd.sjoin(evictions_gpd, census_gpd, op='within')
    for _, row in pointInPoly.iterrows():
        eviction = Evictions.objects.get(id=row['id_left'])
        census = CensusBgs.objects.get(id=row['id_right'])
        eviction.census_bg = census
        eviction.save()


def transform_to_geo(geo):
    return wkb.loads(geo, hex=True)


def get_evictions_by_censustract(census_id, town_type=False):
    tract = CensusTracts.objects.get(pk=census_id)
    evictions = tract.evictions_set.count()
    tract_evictions_per_1000 = tract.evictions_per_1000(town_type=town_type)
    town_evictions_per_1000 = tract.ma_town.evictions_per_1000(town_type=town_type)
    return [evictions, tract_evictions_per_1000, town_evictions_per_1000]


def total_demographics():
    return CensusTracts.objects.aggregate(Sum('under18_pop'),
                                          Sum('asian_renters'),
                                          Sum('black_renters'),
                                          Sum('latinx_renters'),
                                          Sum('white_renters'),
                                          Sum('tot_renters'))


def percentage(num, total_num):
    return round(num / total_num * 100, 2)


def get_demographics_percentage(tract):
    totals = total_demographics()
    return percentage(tract.asian_renters, totals['asian_renters__sum']), \
           percentage(tract.black_renters, totals['black_renters__sum']), \
           percentage(tract.latinx_renters, totals['latinx_renters__sum']), \
           percentage(tract.white_renters, totals['white_renters__sum']), \
           percentage(tract.tot_renters, totals['tot_renters__sum']), \
           percentage(tract.under18_pop, totals['under18_pop__sum'])


def census_tracts_to_geojson():
    """
    Create GeoJSON from census tracts
    """
    census = CensusTracts.objects.all().values('under18_pop', 'asian_renters',
                                               'black_renters', 'latinx_renters',
                                               'white_renters', 'tot_renters', 'geometry',
                                               'ma_town', 'id')
    census_df = pd.DataFrame(census)
    census_gpd = gpd.GeoDataFrame(census_df)
    census_gpd['geometry'] = census_gpd['geometry'].transform(transform_to_geo)

    census_gpd[['evictions', 'tract_evictions_per_1000', 'town_evictions_per_1000',
                'town_type_evictions', 'town_type_tract_evictions_per_1000',
                'town_type_town_evictions_per_1000', 'asian_renters_percent',
                'black_renters_percent', 'latinx_renters_percent',
                'white_renters_percent', 'tot_renters_percent',
                'under18_pop_percent']] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    for _, item in census_gpd.iterrows():
        location = census_gpd.loc[census_gpd.id == item.id].index[0]
        census_tract_id = item.id
        evictions, tract_evictions_per_1000, town_evictions_per_1000 = get_evictions_by_censustract(
            census_tract_id, town_type=False)
        census_gpd.loc[location, 'evictions'] = evictions
        census_gpd.loc[location, 'tract_evictions_per_1000'] = tract_evictions_per_1000
        census_gpd.loc[location, 'town_evictions_per_1000'] = town_evictions_per_1000
        town_type_evictions, town_type_tract_evictions_per_1000, \
        town_type_town_evictions_per_1000 = get_evictions_by_censustract(census_tract_id,
                                                                         town_type=True)
        census_gpd.loc[location, 'town_type_evictions'] = town_type_evictions
        census_gpd.loc[
            location, 'town_type_tract_evictions_per_1000'] = town_type_tract_evictions_per_1000
        census_gpd.loc[
            location, 'town_type_town_evictions_per_1000'] = town_type_town_evictions_per_1000

        asian_renters_percent, black_renters_percent, latinx_renters_percent, \
        white_renters_percent, tot_renters_percent, under18_pop_percent = \
            get_demographics_percentage(item)
        census_gpd.loc[location, 'asian_renters_percent'] = asian_renters_percent
        census_gpd.loc[location, 'black_renters_percent'] = black_renters_percent
        census_gpd.loc[location, 'latinx_renters_percent'] = latinx_renters_percent
        census_gpd.loc[location, 'white_renters_percent'] = white_renters_percent
        census_gpd.loc[location, 'tot_renters_percent'] = tot_renters_percent
        census_gpd.loc[location, 'under18_pop_percent'] = under18_pop_percent

        census_gpd.to_file(
            "./app/data/census_tracts_geo.json", driver="GeoJSON")


def towns_to_geojson():
    """
    Create GeoJSON from census tracts
    """
    towns = MaTowns.objects.all().values()
    towns_df = pd.DataFrame(towns)
    towns_gpd = gpd.GeoDataFrame(towns_df)
    towns_gpd['geometry'] = towns_gpd['geometry'].transform(transform_to_geo)
    towns_gpd['geometry'].to_file("./app/data/towns_geo.json", driver="GeoJSON")
