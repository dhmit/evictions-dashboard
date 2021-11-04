from models import Evictions, CensusBgs, CensusTracts
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

