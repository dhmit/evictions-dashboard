import React from "react";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line
import PropTypes from 'prop-types';

mapboxgl.accessToken = "pk.eyJ1IjoiYWl6bWFuIiwiYSI6ImNrdnR5ZjdscjBzNWEzMXFpMnoyZmhmd3YifQ.0vz9VhAL2RucshBH07UJsg";
const sourceLayer = "census_tracts_geo-8tw3r3"
export default class Map extends React.PureComponent {
    static propTypes = {
        setStats: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            lng: -71.7,
            lat: 42.1,
            zoom: 7,
            layers: [],
            hoveredStateId: undefined,
        };
        this.mapContainer = React.createRef();
    }

    componentDidMount() {
        const {lng, lat, zoom, layers} = this.state;
        const map = new mapboxgl.Map({
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
        map.on('click', 'census', (e) => {
            const features = map.queryRenderedFeatures(e.point);
            const stats = features[0].properties
            console.log(features[0].properties.id)
            this.props.setStats({
                locale: {
                    city: "",
                    town: stats.ma_town_id
                },
                evictions: stats.evictions,
                stats: {
                    asian_pop: stats.asian_pop,
                    black_pop: stats.black_pop,
                    latinx_pop: stats.latinx_pop,
                    white_pop: stats.white_renters,
                    under18_pop: stats.under18_pop,
                    foreign_born: stats.foreign_born,
                }
            })
            if (e && e.features && e.features.length > 0) {
                // debugger;
                if (this.state.hoveredStateId) {
                    map.setFeatureState(
                        {
                            source: 'composite',
                            sourceLayer: sourceLayer,
                            id: this.state.hoveredStateId,
                        },
                        {click: false}
                    );
                }
                this.setState({hoveredStateId: e.features[0].id});
                map.setFeatureState(
                    {
                        source: 'composite',
                        sourceLayer: sourceLayer,
                        id: this.state.hoveredStateId
                    },
                    {click: true}
                );
            }
        });
        // map.on('mousemove', 'census', (e) => {
        //
        // });
    }

    mapStyles = {
        minHeight: "400px",
        border: "1px solid pink"
    }

    render() {
        return (
            <>
                <div ref={this.mapContainer} className="map-container" style={this.mapStyles}/>
            </>
        );
    }
}
