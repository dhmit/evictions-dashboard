import React from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line
import STYLES from "./Map.module.scss";

mapboxgl.accessToken = "pk.eyJ1IjoiYWl6bWFuIiwiYSI6ImNrdnR5ZjdscjBzNWEzMXFpMnoyZmhmd3YifQ.0vz9VhAL2RucshBH07UJsg";

const baseURL = "geodata";
export default class Map extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            lng: -71.66,
            lat: 42,
            zoom: 7,
            layers: []
        };
        this.mapContainer = React.createRef();
    }

    componentDidMount() {
        const {lng, lat, zoom, layers} = this.state;
        const map = new mapboxgl.Map({
            container: this.mapContainer.current,
            style: 'mapbox://styles/aizman/ckw26hibv0x7114no6riwwzol',
            center: [lng, lat],
            zoom: zoom,
        });
        map.on('move', () => {
            this.setState({
                lng: map.getCenter().lng.toFixed(4),
                lat: map.getCenter().lat.toFixed(4),
                zoom: map.getZoom().toFixed(2)
            });
        })
        map.on('click', (e) => {
            const features = map.queryRenderedFeatures(e.point);
            console.log(features[0].properties.id, features[0].properties.ma_town_id);
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
