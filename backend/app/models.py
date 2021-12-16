#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class City(models.Model):
    id = models.SlugField(primary_key=True, blank=False, null=False)
    name = models.CharField(max_length=200, blank=False, null=False)
    town = models.ForeignKey('MaTowns', blank=True, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.name.capitalize()


class Evictions(models.Model):
    id = models.BigAutoField(primary_key=True)
    case_status = models.TextField(blank=True, null=True)
    case_type = models.TextField(blank=True, null=True)
    city = models.ForeignKey('City', models.SET_NULL, null=True)
    town = models.ForeignKey('MaTowns', blank=True, null=True, on_delete=models.SET_NULL)
    census_bg = models.ForeignKey('CensusBgs', blank=True, null=True, on_delete=models.SET_NULL)
    census_tract = models.ForeignKey('CensusTracts', blank=True, null=True,
                                     on_delete=models.SET_NULL)
    close_date = models.DateField(blank=True, null=True)
    # def = defendant
    def_field = models.TextField(db_column='def', blank=True,
                                 null=True)  # Field renamed because it was a Python reserved word.
    def_addl = models.TextField(blank=True, null=True)
    def_atty = models.TextField(blank=True, null=True)
    def_atty_add = models.TextField(blank=True, null=True)
    def_atty_bar = models.TextField(blank=True, null=True)
    def_atty_ph = models.TextField(blank=True, null=True)
    dispo = models.TextField(blank=True, null=True)
    dispo_date = models.DateField(blank=True, null=True)
    district = models.TextField(blank=True, null=True)
    docket = models.TextField(blank=True, null=True)
    file_date = models.DateField(blank=True, null=True)
    last_updated = models.DateField(blank=True, null=True)
    # ptf = plaintiff
    ptf = models.TextField(blank=True, null=True)
    ptf_atty = models.TextField(blank=True, null=True)
    ptf_atty_add = models.TextField(blank=True, null=True)
    ptf_atty_bar = models.TextField(blank=True, null=True)
    ptf_atty_ph = models.TextField(blank=True, null=True)
    st = models.TextField(blank=True, null=True)
    street = models.TextField(blank=True, null=True)
    zip = models.TextField(blank=True, null=True)
    street_cleaned = models.TextField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    match_type = models.TextField(blank=True, null=True)
    geocoder = models.TextField(blank=True, null=True)
    geometry = models.TextField(blank=True, null=True)  # This field type is a guess.
    meta_id = models.TextField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'evictions'

    def __str__(self):
        if self.town:
            return "%s: Town: %s (city matches)" % (self.id, self.town.id)
        else:
            return "%s: City: %s (no town found)" % (self.id, self.city.name)


class Judgments(models.Model):
    id = models.TextField(primary_key=True, blank=True, null=False)
    index = models.FloatField(blank=True, null=True)
    last_updated = models.DateTimeField(blank=True, null=True)
    against = models.TextField(blank=True, null=True)
    date = models.DateTimeField(blank=True, null=True)
    docket = models.TextField(blank=True, null=True)
    for_field = models.TextField(db_column='for', blank=True,
                                 null=True)  # Field renamed because it was a Python reserved word.
    method = models.TextField(blank=True, null=True)
    type = models.TextField(blank=True, null=True)
    meta_id = models.TextField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'judgments'


class CensusTracts(models.Model):
    id = models.TextField(primary_key=True)
    name = models.TextField(blank=True, null=True)
    white_pop = models.FloatField(blank=True, null=True)
    black_pop = models.FloatField(blank=True, null=True)
    asian_pop = models.FloatField(blank=True, null=True)
    latinx_pop = models.FloatField(blank=True, null=True)
    foreign_born = models.FloatField(blank=True, null=True)
    under18_pop = models.FloatField(blank=True, null=True)
    sgl_carer = models.FloatField(blank=True, null=True)
    married_hh = models.FloatField(blank=True, null=True)
    tot_pop = models.FloatField(blank=True, null=True)
    hs = models.FloatField(blank=True, null=True)
    ged = models.FloatField(blank=True, null=True)
    assc = models.FloatField(blank=True, null=True)
    bach = models.FloatField(blank=True, null=True)
    mast = models.FloatField(blank=True, null=True)
    prof = models.FloatField(blank=True, null=True)
    phd = models.FloatField(blank=True, null=True)
    mhi = models.FloatField(blank=True, null=True)
    tot_houses = models.FloatField(blank=True, null=True)
    vacant = models.FloatField(blank=True, null=True)
    tot_hh = models.FloatField(blank=True, null=True)
    tot_renters = models.FloatField(blank=True, null=True)
    black_renters = models.FloatField(blank=True, null=True)
    asian_renters = models.FloatField(blank=True, null=True)
    white_renters = models.FloatField(blank=True, null=True)
    latinx_renters = models.FloatField(blank=True, null=True)
    mgr_all = models.FloatField(blank=True, null=True)
    mgr_1br = models.FloatField(blank=True, null=True)
    median_burd = models.FloatField(blank=True, null=True)
    pop_pct_white = models.FloatField(blank=True, null=True)
    pop_pct_black = models.FloatField(blank=True, null=True)
    pop_pct_asian = models.FloatField(blank=True, null=True)
    pop_pct_latinx = models.FloatField(blank=True, null=True)
    pop_pct_under18 = models.FloatField(blank=True, null=True)
    vacant_pct = models.FloatField(blank=True, null=True)
    rent_pct = models.FloatField(blank=True, null=True)
    rent_pct_white = models.FloatField(blank=True, null=True)
    rent_pct_black = models.FloatField(blank=True, null=True)
    rent_pct_asian = models.FloatField(blank=True, null=True)
    rent_pct_latinx = models.FloatField(blank=True, null=True)
    foreign_pct = models.FloatField(blank=True, null=True)
    sgl_carer_pct = models.FloatField(blank=True, null=True)
    sev_rent_burd_pct = models.FloatField(blank=True, null=True)
    rent_burd_pct = models.FloatField(blank=True, null=True)
    married_hh_pct = models.FloatField(blank=True, null=True)
    bach_pct = models.FloatField(blank=True, null=True)
    hs_ged_pct = models.FloatField(blank=True, null=True)
    postbacc_pct = models.FloatField(blank=True, null=True)
    geometry = models.TextField(blank=True, null=True)  # This field type is a guess.
    ma_town = models.ForeignKey('MaTowns', models.SET_NULL, null=True)

    class Meta:
        managed = True
        db_table = 'census_tracts'

    def evictions_per_1000(self, town_type=False):
        evictions_num = self.evictions_set.count()
        if town_type:
            total_evictions_count = Evictions.objects.filter(
                town__type=self.ma_town.type).count()
        else:
            total_evictions_count = Evictions.objects.count()
        rate = evictions_num * 1000 / total_evictions_count
        return round(rate, 2)

    # def eviction_per_1000_for_matching_town(self):
    # evictions_num = self.evictions_set.count()


class Docket(models.Model):
    id = models.TextField(primary_key=True, blank=True, null=False)
    date = models.DateTimeField(blank=True, null=True)
    docket = models.TextField(blank=True, null=True)
    text = models.TextField(blank=True, null=True)
    last_updated = models.DateTimeField(blank=True, null=True)
    meta_id = models.TextField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'docket'


class MaHouse(models.Model):
    id = models.TextField(primary_key=True)
    repdistnum = models.IntegerField(blank=True, null=True)
    rep_dist = models.TextField(blank=True, null=True)
    rep_first = models.TextField(blank=True, null=True)
    rep_last = models.TextField(blank=True, null=True)
    rep_party = models.TextField(blank=True, null=True)
    rep = models.TextField(blank=True, null=True)
    url = models.TextField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    shape_len = models.FloatField(blank=True, null=True)
    geometry = models.TextField(blank=True, null=True)  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'ma_house'


class MaSenate(models.Model):
    id = models.IntegerField(primary_key=True)
    sen_dist = models.TextField(blank=True, null=True)
    sen_first = models.TextField(blank=True, null=True)
    sen_last = models.TextField(blank=True, null=True)
    sen_party = models.TextField(blank=True, null=True)
    senator = models.TextField(blank=True, null=True)
    url = models.TextField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    shape_len = models.FloatField(blank=True, null=True)
    geometry = models.TextField(blank=True, null=True)  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'ma_senate'


class MaTowns(models.Model):
    id = models.TextField(primary_key=True)
    town_id = models.IntegerField(blank=True, null=True)
    pop1980 = models.FloatField(blank=True, null=True)
    pop1990 = models.FloatField(blank=True, null=True)
    pop2000 = models.FloatField(blank=True, null=True)
    popch90_00 = models.FloatField(blank=True, null=True)
    type = models.TextField(blank=True, null=True)
    fourcolor = models.IntegerField(blank=True, null=True)
    fips_stco = models.FloatField(blank=True, null=True)
    sum_acres = models.FloatField(blank=True, null=True)
    sum_square = models.FloatField(blank=True, null=True)
    pop2010 = models.FloatField(blank=True, null=True)
    popch00_10 = models.FloatField(blank=True, null=True)
    popch80_90 = models.FloatField(blank=True, null=True)
    shape_leng = models.FloatField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    geometry = models.TextField(blank=True, null=True)  # This field type is a guess.

    class Meta:
        managed = True
        db_table = 'ma_towns'

    def __str__(self):
        return self.id

    def evictions_per_1000(self, town_type=False):
        evictions_num = self.evictions_set.count()
        if town_type:
            total_evictions_count = Evictions.objects.filter(
                town__type=self.type).count()
        else:
            total_evictions_count = Evictions.objects.count()
        rate = evictions_num * 1000 / total_evictions_count
        return round(rate, 2)


class MaWardsPrecincts(models.Model):
    id = models.TextField(primary_key=True)
    ward = models.TextField(blank=True, null=True)
    # electoral precinct
    precinct = models.TextField(blank=True, null=True)
    # court district
    district = models.TextField(blank=True, null=True)
    pop_2010 = models.FloatField(blank=True, null=True)
    town = models.TextField(blank=True, null=True)
    town_id = models.IntegerField(blank=True, null=True)
    area_sqmi = models.FloatField(blank=True, null=True)
    area_acres = models.FloatField(blank=True, null=True)
    year = models.FloatField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    shape_len = models.FloatField(blank=True, null=True)
    geometry = models.TextField(blank=True, null=True)  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'ma_wards_precincts'


class UsCongress(models.Model):
    id = models.TextField(primary_key=True)
    statefp = models.TextField(blank=True, null=True)
    cd116fp = models.TextField(blank=True, null=True)
    namelsad = models.TextField(blank=True, null=True)
    lsad = models.TextField(blank=True, null=True)
    cdsessn = models.TextField(blank=True, null=True)
    mtfcc = models.TextField(blank=True, null=True)
    funcstat = models.TextField(blank=True, null=True)
    aland = models.FloatField(blank=True, null=True)
    awater = models.FloatField(blank=True, null=True)
    intptlat = models.TextField(blank=True, null=True)
    intptlon = models.TextField(blank=True, null=True)
    geometry = models.TextField(blank=True, null=True)  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'us_congress'


class CensusBgs(models.Model):
    id = models.TextField(primary_key=True)
    name = models.TextField(blank=True, null=True)
    white_pop = models.FloatField(blank=True, null=True)
    black_pop = models.FloatField(blank=True, null=True)
    asian_pop = models.FloatField(blank=True, null=True)
    latinx_pop = models.FloatField(blank=True, null=True)
    foreign_born = models.FloatField(blank=True, null=True)
    under18_pop = models.FloatField(blank=True, null=True)
    sgl_carer = models.FloatField(blank=True, null=True)
    married_hh = models.FloatField(blank=True, null=True)
    tot_pop = models.FloatField(blank=True, null=True)
    hs = models.FloatField(blank=True, null=True)
    ged = models.FloatField(blank=True, null=True)
    assc = models.FloatField(blank=True, null=True)
    bach = models.FloatField(blank=True, null=True)
    mast = models.FloatField(blank=True, null=True)
    prof = models.FloatField(blank=True, null=True)
    phd = models.FloatField(blank=True, null=True)
    mhi = models.FloatField(blank=True, null=True)
    tot_houses = models.FloatField(blank=True, null=True)
    vacant = models.FloatField(blank=True, null=True)
    tot_hh = models.FloatField(blank=True, null=True)
    tot_renters = models.FloatField(blank=True, null=True)
    black_renters = models.FloatField(blank=True, null=True)
    asian_renters = models.FloatField(blank=True, null=True)
    white_renters = models.FloatField(blank=True, null=True)
    latinx_renters = models.FloatField(blank=True, null=True)
    mgr_all = models.FloatField(blank=True, null=True)
    mgr_1br = models.FloatField(blank=True, null=True)
    median_burd = models.FloatField(blank=True, null=True)
    pop_pct_white = models.FloatField(blank=True, null=True)
    pop_pct_black = models.FloatField(blank=True, null=True)
    pop_pct_asian = models.FloatField(blank=True, null=True)
    pop_pct_latinx = models.FloatField(blank=True, null=True)
    pop_pct_under18 = models.FloatField(blank=True, null=True)
    vacant_pct = models.FloatField(blank=True, null=True)
    rent_pct = models.FloatField(blank=True, null=True)
    rent_pct_white = models.FloatField(blank=True, null=True)
    rent_pct_black = models.FloatField(blank=True, null=True)
    rent_pct_asian = models.FloatField(blank=True, null=True)
    rent_pct_latinx = models.FloatField(blank=True, null=True)
    foreign_pct = models.FloatField(blank=True, null=True)
    sgl_carer_pct = models.FloatField(blank=True, null=True)
    sev_rent_burd_pct = models.FloatField(blank=True, null=True)
    rent_burd_pct = models.FloatField(blank=True, null=True)
    married_hh_pct = models.FloatField(blank=True, null=True)
    bach_pct = models.FloatField(blank=True, null=True)
    hs_ged_pct = models.FloatField(blank=True, null=True)
    postbacc_pct = models.FloatField(blank=True, null=True)
    geometry = models.TextField(blank=True, null=True)  # This field type is a guess.
    ma_town = models.ForeignKey('MaTowns', models.SET_NULL, null=True)

    class Meta:
        managed = True
        db_table = 'census_bgs'


class L3Lut(models.Model):
    objectid = models.AutoField(primary_key=True)
    town_id = models.SmallIntegerField(blank=True, null=True)
    field_nm = models.CharField(max_length=10)
    code = models.CharField(max_length=20, blank=True, null=True)
    code_desc = models.CharField(max_length=80, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'l3_lut'


class L3MiscPoly(models.Model):
    objectid = models.AutoField(primary_key=True)
    misc_type = models.CharField(max_length=15, blank=True, null=True)
    town_id = models.SmallIntegerField(blank=True, null=True)
    shape_length = models.FloatField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    shape = models.TextField(blank=True, null=True)  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'l3_misc_poly'


class L3OthlegPoly(models.Model):
    objectid = models.AutoField(primary_key=True)
    map_par_id = models.CharField(max_length=26, blank=True, null=True)
    legal_type = models.CharField(max_length=15, blank=True, null=True)
    ls_book = models.CharField(max_length=16, blank=True, null=True)
    ls_page = models.CharField(max_length=14, blank=True, null=True)
    reg_id = models.CharField(max_length=15, blank=True, null=True)
    town_id = models.SmallIntegerField(blank=True, null=True)
    taxpar_id = models.CharField(max_length=18, blank=True, null=True)
    shape_length = models.FloatField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    shape = models.TextField(blank=True, null=True)  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'l3_othleg_poly'


class L3ParcelFtpLinks(models.Model):
    objectid = models.AutoField(primary_key=True)
    town = models.CharField(max_length=21, blank=True, null=True)
    town_id = models.SmallIntegerField(blank=True, null=True)
    shape_link = models.CharField(max_length=100, blank=True, null=True)
    fgdb_link = models.CharField(max_length=80, blank=True, null=True)
    fy = models.SmallIntegerField(blank=True, null=True)
    note = models.CharField(max_length=800, blank=True, null=True)
    shape_length = models.FloatField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    shape = models.TextField(blank=True, null=True)  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'l3_parcel_ftp_links'


class L3TaxparPoly(models.Model):
    objectid = models.AutoField(primary_key=True)
    map_par_id = models.CharField(max_length=26, blank=True, null=True)
    loc_id = models.CharField(max_length=18, blank=True, null=True)
    poly_type = models.CharField(max_length=15, blank=True, null=True)
    map_no = models.CharField(max_length=4, blank=True, null=True)
    source = models.CharField(max_length=15)
    plan_id = models.CharField(max_length=40, blank=True, null=True)
    last_edit = models.IntegerField(blank=True, null=True)
    bnd_chk = models.CharField(max_length=2, blank=True, null=True)
    no_match = models.CharField(max_length=1)
    town_id = models.SmallIntegerField(blank=True, null=True)
    site = models.CharField(max_length=80, blank=True, null=True)
    esn = models.SmallIntegerField(blank=True, null=True)
    lu_codes = models.CharField(max_length=60, blank=True, null=True)
    dev = models.CharField(max_length=1, blank=True, null=True)
    sym1 = models.SmallIntegerField(blank=True, null=True)
    sym2 = models.SmallIntegerField(blank=True, null=True)
    shape_length = models.FloatField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    shape = models.TextField(blank=True, null=True)  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'l3_taxpar_poly'


class L3Townfy(models.Model):
    objectid = models.AutoField(primary_key=True)
    fy = models.IntegerField()
    town_id = models.IntegerField(blank=True, null=True)
    town = models.CharField(max_length=21, blank=True, null=True)
    shape_length = models.FloatField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    shape = models.TextField(blank=True, null=True)  # This field type is a guess.

    class Meta:
        managed = False
        db_table = 'l3_townfy'


class L3UcLut(models.Model):
    objectid = models.AutoField(primary_key=True)
    town_id = models.SmallIntegerField(blank=True, null=True)
    use_code = models.CharField(max_length=4, blank=True, null=True)
    use_desc = models.CharField(max_length=150, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'l3_uc_lut'


class SpatialRefSys(models.Model):
    srid = models.IntegerField(primary_key=True)
    auth_name = models.CharField(max_length=256, blank=True, null=True)
    auth_srid = models.IntegerField(blank=True, null=True)
    srtext = models.CharField(max_length=2048, blank=True, null=True)
    proj4text = models.CharField(max_length=2048, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'spatial_ref_sys'


class UpdateMeta(models.Model):
    id = models.TextField(primary_key=True, blank=True, null=False)
    ip = models.TextField(blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    end_date = models.DateField(blank=True, null=True)
    timestamp = models.DateTimeField(blank=True, null=True)
    district = models.TextField(blank=True, null=True)
    user = models.TextField(blank=True, null=True)
    update_table = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'update_meta'

#
