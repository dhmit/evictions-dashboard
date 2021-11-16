import React from "react";
import Plot from "react-plotly.js";


export default class Map extends React.Component {
    state = {
        layout: {
            geo: {
                scope: 'usa',
                resolution: 50,
            },
            // mapbox: {center: {lon: -72, lat: 42.2}, zoom: 6},
            // width: 600, height: 400
        },
        data: [{
            type: "scattergeo", locations: ["MA"], z: [-50, -10, -20],
            geojson: "https://raw.githubusercontent.com/python-visualization/folium/master/examples/data/us-states.json"
        }],
        config: {mapboxAccessToken: "pk.eyJ1IjoiYWl6bWFuIiwiYSI6ImNrdnR5ZjdscjBzNWEzMXFpMnoyZmhmd3YifQ.0vz9VhAL2RucshBH07UJsg"}
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
