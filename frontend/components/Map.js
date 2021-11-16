import React from "react";
import Plot from "react-plotly.js";
import axios from "axios";

const baseURL = "census_tracts";
export default class Map extends React.Component {
    state = {
        layout: {
            // clickmode: 'event+select',
            // margin: {r: 0, t: 0, l: 0, b: 0},
            mapbox: {
                center: {
                    lat: 42,
                    lon: -71
                },
                style: "light",
                zoom: 7,

                layers: [{
                    type: "fill",
                    below: "water",
                    color: "red",
                    source: {
                        type: "FeatureCollection",
                        features: [
                            {
                                type: "Feature",
                                properties: {},
                                geometry: {
                                    type: "MultiPolygon",
                                    coordinates: [[[[-71.496614, 42.414673], [-71.486262, 42.41631], [-71.477051, 42.420032], [-71.474376, 42.421624], [-71.469452, 42.402631], [-71.471073, 42.396241], [-71.482026, 42.400423], [-71.484883, 42.399483], [-71.496715, 42.40744], [-71.496614, 42.414673]]]]
                                }
                            },
                            {
                                type: "Feature",
                                properties: {},
                                geometry: {
                                    type: "MultiPolygon",
                                    coordinates: [[[[-71.05624, 42.338869], [-71.053928, 42.340791], [-71.052377, 42.339803], [-71.05084, 42.338795], [-71.052405, 42.337488], [-71.05389, 42.33624], [-71.057112, 42.338333], [-71.05624, 42.338869]]]]
                                }
                            },
                            {
                                type: "Feature",
                                properties: {},
                                geometry: {
                                    type: "MultiPolygon",
                                    coordinates: [[[[-70.948651, 41.58406], [-70.94658, 41.584125], [-70.945346, 41.584172], [-70.944429819548304, 41.581063363155202], [-70.946911, 41.581089], [-70.948080339567085, 41.579817358721002], [-70.948651, 41.58406]]]]
                                }
                            },
                        ]

                    }
                }],
            },
        },
        data: [{
            type: "scattermapbox",
            lon: [-72], lat: [42],
            mode: "markers",
        }],
        config: {mapboxAccessToken: "pk.eyJ1IjoiYWl6bWFuIiwiYSI6ImNrdnR5ZjdscjBzNWEzMXFpMnoyZmhmd3YifQ.0vz9VhAL2RucshBH07UJsg"}
    }
    componentDidMount = () => {
        this.populateMap();
    }
    populateMap = () => {
        axios.get(`${baseURL}`)
            .then(res => {
                console.log('getting result:', res.data)
                this.setState({
                    layout: {
                        mapbox: {
                            center: {
                                lat: 42,
                                lon: -71
                            },
                            style: "light",
                            zoom: 7,

                            layers: [{
                                type: "fill",
                                below: "water",
                                color: "teal",
                                source: res.data
                            }]
                        }
                    }
                })
            })
    }

    render() {
        return <>
            <Plot
                data={this.state.data}
                layout={this.state.layout}
                config={this.state.config}
            />
        </>
    }
}
