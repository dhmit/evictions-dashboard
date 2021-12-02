import React from "react";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line
import PropTypes from 'prop-types';

mapboxgl.accessToken = "pk.eyJ1IjoiYWl6bWFuIiwiYSI6ImNrdnR5ZjdscjBzNWEzMXFpMnoyZmhmd3YifQ.0vz9VhAL2RucshBH07UJsg";
const sourceLayer = "census_tracts_geo-8tw3r3"
const stats = {
    lng: -71.7,
    lat: 42.1,
    zoom: 7,
}
/* Map related methods that we need to keep outside of component to have access everywhere */
let map = undefined;

const deselectMap = () => {
    /* Unclick everything */
    map.removeFeatureState({
        source: 'composite',
        sourceLayer: sourceLayer,
    })
}

const selectTown = (town) => {
    let features = map.querySourceFeatures('composite', {
        'sourceLayer': sourceLayer
    });

    /* Show highlighted matching census tracts */
    let stats = {
        locale: {
            city: "",
            town: town
        },
        tract: [],
        evictions: 0,
        stats: {
            asian_pop: 0,
            black_pop: 0,
            latinx_pop: 0,
            white_pop: 0,
            under18_pop: 0,
            foreign_born: 0,
        }
    }
    let matchedFeatures = features.filter((feature) => {
        if (town === feature.properties.ma_town_id) {
            map.setFeatureState(
                {
                    source: 'composite',
                    sourceLayer: sourceLayer,
                    id: feature.id,
                },
                {click: true}
            );
            stats.tract.push(feature.properties.id);
            stats.evictions += feature.properties.evictions;
            stats.stats.asian_pop += feature.properties.asian_pop;
            stats.stats.black_pop += feature.properties.black_pop;
            stats.stats.latinx_pop += feature.properties.latinx_pop;
            stats.stats.white_pop += feature.properties.white_pop;
            stats.stats.under18_pop += feature.properties.under18_pop;
            stats.stats.foreign_born += feature.properties.foreign_born;
            return feature
        }
    });
    return [matchedFeatures, stats];

}
export default class Map extends React.Component {
    static propTypes = {
        setStats: PropTypes.func,
        town: PropTypes.string,
        showEntireTown: PropTypes.bool,
        toggleEntireTown: PropTypes.func,
        stats: PropTypes.object,
    };

    constructor(props) {
        super(props);

        this.state = {
            lng: -71.7,
            lat: 42.1,
            zoom: 7,
            layers: [],
            clickedStateID: undefined,
            currentTown: undefined,
            showingEntireTown: false,
        };
        this.mapContainer = React.createRef();
    }

    clearStats = () => {
        this.props.setStats({
            locale: {
                city: "",
                town: ""
            },
            tract: [],
            evictions: 0,
            stats: {
                asian_pop: 0,
                black_pop: 0,
                latinx_pop: 0,
                white_pop: 0,
                under18_pop: 0,
                foreign_born: 0,
            }
        })
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!this.props.town.length) {
            deselectMap();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.town !== nextState.currentTown;
    }

    static getDerivedStateFromProps(props, state) {
        if (!map) return null;
        if (!props.town || !props.town.length) {
            deselectMap();
            return null
        }

        /* if we need to show entire town: */
        if (props.showEntireTown && !state.showingEntireTown) {

            /* Unclick everything */
            deselectMap();

            /* Select town on map, get matched features and stats back */
            let [matched, fullStats] = selectTown(props.town);

            if (matched.length) {
                /* Send stats up to parent component to alert other components */
                props.setStats(fullStats);
            }
        }

        return {
            locale: {city: "", town: props.town},
            currentTown: props.town,
            showingEntireTown: props.showEntireTown,
        }
    }

    componentDidMount() {
        const {lng, lat, zoom, layers} = this.state;
        map = new mapboxgl.Map({
            container: this.mapContainer.current,
            style: 'mapbox://styles/aizman/ckw5r50zy0m3t14oz7h5cdwim',
            center: [lng, lat],
            zoom: zoom,
            minZoom: 6,
            maxZoom: 9
        });
        map.on('load', () => {
            map.addLayer({
                'id': 'census-fills',
                'type': 'fill',
                'source': 'composite',
                'source-layer': sourceLayer,
                'layout': {},
                'paint': {
                    'fill-color': '#ffdc59',
                    'fill-opacity': [
                        'case',
                        ['boolean', ['feature-state', 'click'], false],
                        1,
                        0
                    ]
                }
            });
        })
        map.addControl(new mapboxgl.NavigationControl());
        map.on('move', () => {
            this.setState({
                lng: map.getCenter().lng.toFixed(4),
                lat: map.getCenter().lat.toFixed(4),
                zoom: map.getZoom().toFixed(2)
            });
        })
        /* new census tract selection */
        map.on('click', 'census', (e) => {
            /* clear map first */
            deselectMap();
            /* allow selection of entire town on new census tract selection */
            if (this.props.showEntireTown) {
                this.props.toggleEntireTown();
                this.setState({showingEntireTown: false})
            }

            this.clearStats();

            const features = map.queryRenderedFeatures(e.point);
            const stats = features[0].properties;

            this.props.setStats({
                showEntireTown: false,
                locale: {
                    city: "",
                    town: stats.ma_town_id
                },
                tract: [stats.id.toString()],
                evictions: stats.evictions,
                stats: {
                    asian_pop: stats.asian_pop,
                    black_pop: stats.black_pop,
                    latinx_pop: stats.latinx_pop,
                    white_pop: stats.white_renters,
                    under18_pop: stats.under18_pop,
                    foreign_born: stats.foreign_born,
                }
            });
            if (e && e.features && e.features.length > 0) {
                if (this.state.clickedStateID) {
                    map.setFeatureState(
                        {
                            source: 'composite',
                            sourceLayer: sourceLayer,
                            id: this.state.clickedStateID,
                        },
                        {click: false}
                    );
                }
                this.setState({clickedStateID: e.features[0].id});
                map.setFeatureState(
                    {
                        source: 'composite',
                        sourceLayer: sourceLayer,
                        id: this.state.clickedStateID
                    },
                    {click: true}
                );
            }
        });
    }

    reset = () => {
        this.setState({
            lng: stats.lng,
            lat: stats.lat,
            zoom: stats.zoom
        })
    }
    mapStyles = {
        minHeight: "400px",
    }

    render() {
        return (
            <>
                <div ref={this.mapContainer} className="map-container" style={this.mapStyles}/>
            </>
        );
    }
}
