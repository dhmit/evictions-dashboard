import React from "react";
import mapboxgl from "!mapbox-gl"; // eslint-disable-line
import PropTypes from "prop-types";
import STYLES from "./Map.module.scss";

mapboxgl.accessToken = "pk.eyJ1IjoiYWl6bWFuIiwiYSI6ImNrdnR5ZjdscjBzNWEzMXFpMnoyZmhmd3YifQ.0vz9VhAL2RucshBH07UJsg";
// per 1000 stats
const sourceLayer = "evictions_per_renter_populati-1756v6";
// const mapStyle = "mapbox://styles/aizman/ckx4u3o7d3x8f14o7po6noaam"
const mapStyle = "mapbox://styles/aizman/ckxxsauak3jlc14ph7sxrycix";
const renterAsianLayer = "rent-pct-asian";
const renterBlackLayer = "rent-pct-black";
const renterLatinxLayer = "rent-pct-latinx";
const renterWhiteLayer = "rent-pct-white";
// const sourceLayer = "census_tracts_geo-8tw3r3"
// const mapStyle = "mapbox://styles/aizman/ckw5r50zy0m3t14oz7h5cdwim"
// const censusLayer = "census"
const statsLayer = "evictions"

const stats = {
    lng: -71.7,
    lat: 42.1,
    zoom: 7,
}
const selectionTemplate = {
    showEntireTown: false,
    town: "",
    tract: [],
    stats: {
        evictions: 0,
        asian_renters: 0,
        black_renters: 0,
        latinx_renters: 0,
        white_renters: 0,
        under18_pop: 0,
        foreign_born: 0
    }
}

/* Map related methods that we need to keep outside of component to have access everywhere */
let map = undefined;
let mapLoaded = false;

const deselectMap = () => {
    if (!mapLoaded) return;
    if (!map) return null;
    /* Unclick everything */
    map.removeFeatureState({
        source: "composite",
        sourceLayer: sourceLayer,
    })
}

const selectTown = (town) => {
    let features = map.querySourceFeatures("composite", {
        "sourceLayer": sourceLayer
    });

    /* Show highlighted matching census tracts */
    let selection = JSON.parse(JSON.stringify(selectionTemplate));
    let matchedFeatures = features.filter((feature) => {
        if (town === feature.properties.ma_town) {
            map.setFeatureState(
                {
                    source: "composite",
                    sourceLayer: sourceLayer,
                    id: feature.id,
                },
                {click: true}
            );
            selection.tract.push(feature.properties.id);
            selection.stats.evictions += feature.properties.evictions;
            selection.stats.town_evictions_per_1000 = feature.properties.town_type_town_evictions_per_1000;
            return feature
        }
    });
    return [matchedFeatures, selection];
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
            lng: stats.lng,
            lat: stats.lat,
            zoom: stats.zoom,
            layers: [],
            clickedStateID: undefined,
            currentTown: undefined,
            showingEntireTown: false,
            showAsianRenters: false,
            showBlackRenters: false,
            showLatinxRenters: false,
            showWhiteRenters: false,
        };
        this.mapContainer = React.createRef();
    }

    clearStats = () => {
        this.props.setStats(selectionTemplate)
    }

    componentDidUpdate() {
        if (!this.props.town.length) {
            deselectMap();
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.town !== nextState.currentTown;
    }

    static getDerivedStateFromProps(props, state) {
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

        // messy but: when reset (in Stats.js) is clicked, we're here
        if (map && state.town && props.town === "Total") {
            deselectMap();
        }

        return {
            town: props.town,
            currentTown: props.town,
            showingEntireTown: props.showEntireTown,
        }
    }

    componentDidMount() {
        const {lng, lat, zoom} = this.state;
        map = new mapboxgl.Map({
            container: this.mapContainer.current,
            style: mapStyle,
            center: [lng, lat],
            zoom: zoom,
            minZoom: 6,
            maxZoom: 9
        });
        map.on("load", () => {
            mapLoaded = true;
            map.setLayoutProperty(renterAsianLayer, 'visibility', 'none');
            map.setLayoutProperty(renterBlackLayer, 'visibility', 'none');
            map.setLayoutProperty(renterLatinxLayer, 'visibility', 'none');
            map.setLayoutProperty(renterWhiteLayer, 'visibility', 'none');
            map.addLayer({
                "id": "census-fills",
                "type": "fill",
                "source": "composite",
                "source-layer": sourceLayer,
                "layout": {},
                "paint": {
                    "fill-color": "white",
                    "fill-opacity": [
                        "case",
                        ["boolean", ["feature-state", "click"], false],
                        1,
                        0
                    ]
                }
            });
        })
        map.addControl(new mapboxgl.NavigationControl());
        map.on("move", () => {
            this.setState({
                lng: map.getCenter().lng.toFixed(4),
                lat: map.getCenter().lat.toFixed(4),
                zoom: map.getZoom().toFixed(2)
            });
        })
        /* new census tract selection */
        map.on("zoom", statsLayer, () => {
            deselectMap();
        })
        map.on("click", (e) => {

            /* clear map first */
            deselectMap();
            /* allow selection of entire town on new census tract selection */
            if (this.props.showEntireTown) {
                this.props.toggleEntireTown();
                this.setState({showingEntireTown: false})
            }

            this.clearStats();

            const features = map.queryRenderedFeatures(e.point);
            console.log('getting features', features)
            let selection = JSON.parse(JSON.stringify(selectionTemplate));
            for (let i = 0; i < features.length; i++) {
                let feature = features[i];
                if (feature.layer.id === statsLayer) {
                    selection.stats.evictions = feature.properties.evictions_count;
                    selection.stats.evictions_per_1000 = feature.properties.evictions_per_1000.toFixed(2);
                    selection.stats.town_evictions_per_1000 = feature.properties.town_type_town_evictions_per_1000;
                    selection.town = feature.properties.ma_town;
                    selection.tract.push(feature.properties.id);
                    let selectedTract = feature.id;
                    this.setState({clickedStateID: selectedTract});
                    map.setFeatureState(
                        {
                            source: "composite",
                            sourceLayer: sourceLayer,
                            id: selectedTract
                        },
                        {click: true}
                    );
                }
            }
            this.props.setStats(selection);
        });
    }

    toggleDemography = (e) => {
        let visibility;
        if (e.target.id === "asian") {
            visibility = !this.state.showAsianRenters ? 'visible' : 'none';
            map.setLayoutProperty(renterAsianLayer, 'visibility', visibility);
            this.setState({showAsianRenters: !this.state.showAsianRenters});
        } else if (e.target.id === "black") {
            visibility = !this.state.showBlackRenters ? 'visible' : 'none';
            map.setLayoutProperty(renterBlackLayer, 'visibility', visibility);
            this.setState({showBlackRenters: !this.state.showBlackRenters});
        } else if (e.target.id === "latinx") {
            visibility = !this.state.showLatinxRenters ? 'visible' : 'none';
            map.setLayoutProperty(renterLatinxLayer, 'visibility', visibility);
            this.setState({showLatinxRenters: !this.state.showLatinxRenters});
        } else if (e.target.id === "white") {
            visibility = !this.state.showWhiteRenters ? 'visible' : 'none'
            map.setLayoutProperty(renterWhiteLayer, 'visibility', visibility);
            this.setState({showWhiteRenters: !this.state.showWhiteRenters});
        }
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
                <input type={"checkbox"} id="asian" onClick={this.toggleDemography}
                       className={STYLES.checkbox}/>
                <label htmlFor="asian">Asian</label>&nbsp;
                <input type={"checkbox"} id="black" onClick={this.toggleDemography}
                       className={STYLES.checkbox}/>
                <label htmlFor="black">Black</label>&nbsp;
                <input type={"checkbox"} id="latinx" onClick={this.toggleDemography}
                       className={STYLES.checkbox}/>
                <label htmlFor="latinx">Latinx</label>&nbsp;
                <input type={"checkbox"} id="white" onClick={this.toggleDemography}
                       className={STYLES.checkbox}/>
                <label htmlFor="white">White</label>&nbsp;
                <div ref={this.mapContainer} className="map-container" style={this.mapStyles}/>
            </>
        );
    }
}
