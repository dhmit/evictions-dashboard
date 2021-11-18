from models import Evictions, CensusBgs, CensusTracts, MaTowns
from shapely import wkb
from geopandas import gpd
import pandas as pd

# from shapely.geometry import Point

evictions = Evictions.objects.all().values()
evictions_df = pd.DataFrame(evictions)
evictions_gpd = gpd.GeoDataFrame(evictions_df)
census = CensusBgs.objects.all().values()
census_df = pd.DataFrame(census)
census_gpd = gpd.GeoDataFrame(census_df)


def transform_to_geo(geo):
    return wkb.loads(geo, hex=True)


evictions_gpd['geometry'] = evictions_gpd['geometry'].transform(transform_to_geo)
census_gpd['geometry'] = census_gpd['geometry'].transform(transform_to_geo)
pointInPoly = gpd.sjoin(evictions_gpd, census_gpd, op='within')

for index, row in pointInPoly.iterrows():
    try:
        eviction = Evictions.objects.get(id=row['id_left'])
        census = CensusBgs.objects.get(id=row['id_right'])
        eviction.census_bg = census
        eviction.save()
    except:
        pass
    # print(row['c1'], row['c2'])


def get_evictions_by_censustract(id):
    evictions_count = CensusTracts.objects.get(pk=id).evictions_set.count()
    print(id, evictions_count)
    return evictions_count


def census_tracts_to_geojson():
    """
    Create GeoJSON from census tracts
    """
    census = CensusTracts.objects.all().values()
    census_df = pd.DataFrame(census)
    census_gpd = gpd.GeoDataFrame(census_df)
    census_gpd['geometry'] = census_gpd['geometry'].transform(transform_to_geo)
    census_gpd['evictions'] = census_gpd.apply(lambda row: get_evictions_by_censustract(row.id),
                                               axis=1)
    census_gpd[['geometry', 'id', 'ma_town_id', 'evictions']].to_file(
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
