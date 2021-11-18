import React from "react";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line
import PropTypes from 'prop-types';

mapboxgl.accessToken = "pk.eyJ1IjoiYWl6bWFuIiwiYSI6ImNrdnR5ZjdscjBzNWEzMXFpMnoyZmhmd3YifQ.0vz9VhAL2RucshBH07UJsg";

export default class Map extends React.PureComponent {
    static propTypes = {
        setStats: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.state = {
            lng: -71.66,
            lat: 42,
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
            style: 'mapbox://styles/aizman/ckw5c5ytz033m15oi2z4tzj74',
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
                'source-layer': 'census_tracts_geo-8o5nll',
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

            console.log(features[0].properties.id)
            this.props.setStats({
                locale: {
                    city: "",
                    town: features[0].properties.ma_town_id
                },
                evictions: features[0].properties.evictions,
                stats: {}
            })
            if (e && e.features && e.features.length > 0) {
                if (this.state.hoveredStateId) {
                    map.setFeatureState(
                        {
                            source: 'composite',
                            sourceLayer: 'census_tracts_geo-8o5nll',
                            id: this.state.hoveredStateId,
                        },
                        {click: false}
                    );
                }
                this.setState({hoveredStateId: e.features[0].id});
                map.setFeatureState(
                    {
                        source: 'composite',
                        sourceLayer: 'census_tracts_geo-8o5nll',
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

    minHeight = {
        minHeight: "400px"
    }

    render() {
        return (
            <>
                <div ref={this.mapContainer} className="map-container" style={this.minHeight}/>
            </>
        );
    }
}
