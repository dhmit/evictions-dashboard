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
        };
        this.mapContainer = React.createRef();
    }

    componentDidMount() {
        const {lng, lat, zoom, layers} = this.state;
        const map = new mapboxgl.Map({
            container: this.mapContainer.current,
            style: 'mapbox://styles/aizman/ckw53ue590vl914o477esyuv3',
            center: [lng, lat],
            zoom: zoom,
        });
        map.addControl(new mapboxgl.NavigationControl());
        map.on('move', () => {
            this.setState({
                lng: map.getCenter().lng.toFixed(4),
                lat: map.getCenter().lat.toFixed(4),
                zoom: map.getZoom().toFixed(2)
            });
        })
        map.on('click', (e) => {
            const features = map.queryRenderedFeatures(e.point);
            this.props.setStats({
                locale: {
                    city: "",
                    town: features[0].properties.ma_town_id
                },
                evictions: features[0].properties.evictions,
                stats: {}
            })
        })
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
