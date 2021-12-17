import React from "react";
import Plot from "react-plotly.js";
import CitiesDropdown from "./CitiesDropdown.js";
import axios from "axios";
import PropTypes from "prop-types";
import {fixNameCapitalization} from "./global/Helpers.js";

const baseURL = "/evictions/";
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const log = true
const colors = [[255, 255, 255], [255, 255, 255], [255, 166, 166], [255, 49, 49], [61, 113, 210], [44, 170, 115], [212, 30, 33], [90, 200, 48]];
export default class CitiesGraph extends React.Component {
    static propTypes = {
        setStats: PropTypes.func,
        town: PropTypes.string,
        overwriteFromDropdown: PropTypes.func,
    };
    state = {
        plotlyData: [
            {
                x: [],
                y: [],
                type: "scatter",
                mode: "lines+markers",
                marker: {color: "red"}
            },
            {type: "bar", x: [], y: []}
        ],
        updatedDropdown: false,
        currentTown: "",
    }

    componentDidMount() {
        this.populateGraph().then(() => {
            this.setState({updatedDropdown: false})
        })
    }

    componentDidUpdate = () => {
        let town = this.state.updatedDropdown ? this.state.currentTown : this.props.town;
        this.populateGraph(town).then(() => {
            this.setState({currentTown: town, updatedDropdown: false})
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.town !== nextState.currentTown || nextState.updatedDropdown;
    }

    populateGraph = (town) => {
        let url = baseURL;
        // fixme: this is silly but town can sometimes be an empty string
        url = town && town.length > 2 ? (baseURL + town + "?type=town") : url;
        return axios.get(url)
            .then(res => {
                const evictions_res = res.data.evictions;
                this.plotBarChart(evictions_res);
                return evictions_res;
            });
    }
    getPlotlyDataObject = (xVal) => {
        return {
            x: xVal ? xVal : [],
            y: [],
            type: "bar",
            name: "2020",
            marker: {
                color: [],
                opatown: 1
            }
        };
    }

    plotBarChart = (evictions) => {
        const plotlyData = [];
        let c = 0;
        for (let year in evictions) {
            let data = this.getPlotlyDataObject(months.slice());
            for (let month = 0; month < evictions[year].length; month++) {
                data.x[month] = data.x[month] + ", '" + year.slice(2);
                data.y[month] = evictions[year][month];
            }
            data.name = year;
            data.marker.color = `rgb(${colors[c][0]}, ${colors[c][1]}, ${colors[c][2]})`;
            plotlyData.push(data);
            c += 1;
        }
        this.setState({plotlyData});
    }
    printout = (msg, color) => {
        if (!(log)) return;
        console.log("GRAPH %c" + msg, "color:" + color + ";font-weight:bold;")
    }
    changeHandler = (townObj) => {
        this.props.overwriteFromDropdown(true);

        this.setState({
            updatedDropdown: true,
            currentTown: townObj.value
        });
        this.props.setStats({
            town: townObj.value
        })
        this.populateGraph(townObj.value);
    }

    render() {
        return <>
            <CitiesDropdown
                town={this.props.town}
                value={this.props.town}
                onChange={this.changeHandler}
            />
            <Plot
                data={this.state.plotlyData}
                layout={
                    {
                        margin: {l: 20, r: 10, t: 0, b: 80},
                        paper_bgcolor: "rgba(0,0,0,0)",
                        plot_bgcolor: "rgba(0,0,0,0)",
                        showgrid: false,
                        showlegend: false,
                        height: 200,
                        width: 300,
                        font: {
                            size: 10,
                            color: '#ffffff'
                        },
                        xaxis: {
                            showgrid: false,
                            showline: false,
                            rangemode: "tozero",
                        },
                        yaxis: {
                            showgrid: false,
                            showline: false,
                            fixedrange: true,
                            rangemode: "tozero",
                        }
                    }
                }
            />

        </>

    }
}
