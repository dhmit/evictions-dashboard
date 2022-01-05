import React from "react";
import Plot from "react-plotly.js";
import CitiesDropdown from "./CitiesDropdown.js";
import axios from "axios";
import PropTypes from "prop-types";

const baseURL = "/evictions/";
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const log = true
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
            },
            {type: "bar", x: [], y: []}
        ],
        plotlyOptions: {
            displayModeBar: false,
        },
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
        if (town && town !== "Total") {
            url = baseURL + town + "?type=town";
        }
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
            data.marker = {color: "white"};
            data.hoverlabel = {bgcolor: "#eaffae"};
            data.hovertemplate = "%{x}: %{y} evictions filed";
            data.showticklabels = false;
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
            {this.state.plotlyData && this.state.plotlyData.length > 0 &&
            <Plot
                data={this.state.plotlyData}
                config={this.state.plotlyOptions}
                layout={
                    {
                        margin: {l: 20, r: 10, t: 0, b: 80},
                        paper_bgcolor: "rgba(0,0,0,0)",
                        plot_bgcolor: "rgba(0,0,0,0)",
                        showgrid: false,
                        showlegend: false,
                        hoverlabel: {bgcolor: "#eaffae"},
                        height: 200,
                        width: 300,
                        font: {
                            size: 10,
                            color: "#ffffff",
                        },
                        marker: {
                            color: "white",
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
            />}
            {this.state.plotlyData && this.state.plotlyData.length === 0 &&
            <>No data</>
            }

        </>

    }
}
