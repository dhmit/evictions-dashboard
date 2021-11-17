import React from "react";
import Plot from "react-plotly.js";
import axios from "axios";
import mapboxgl from '!mapbox-gl'; // eslint-disable-line
import STYLES from "./Map.module.scss";

mapboxgl.accessToken = "pk.eyJ1IjoiYWl6bWFuIiwiYSI6ImNrdnR5ZjdscjBzNWEzMXFpMnoyZmhmd3YifQ.0vz9VhAL2RucshBH07UJsg";

const baseURL = "census_tracts";
export default class Map extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            lng: -70.9,
            lat: 42,
            zoom: 9,
            layers: []
        };
        this.mapContainer = React.createRef();
    }

    componentDidMount() {
        const {lng, lat, zoom, layers} = this.state;
        const map = new mapboxgl.Map({
            container: this.mapContainer.current,
            style: 'mapbox://styles/mapbox/light-v10',
            center: [lng, lat],
            zoom: zoom,
        });
        this.getData().then((layers) => {
            map.on('load', () => {
                map.addSource("census-tracts", {
                    type: 'geojson',
                    data: layers
                })
                map.addLayer({
                    id: 'census-tracts-fill',
                    type: "line",
                    source: "census-tracts",
                    paint: {
                        "line-color": "#6382f2",
                        "line-width": 1,
                    },
                })
            })
        })
        map.on('move', () => {
            this.setState({
                lng: map.getCenter().lng.toFixed(4),
                lat: map.getCenter().lat.toFixed(4),
                zoom: map.getZoom().toFixed(2)
            });
        })
        map.on('click', (evt) => {
            console.log("clicking evt", evt)
        })
    }

    getData = () => {
        return axios.get(`${baseURL}`)
            .then(res => {
                return res.data;
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
