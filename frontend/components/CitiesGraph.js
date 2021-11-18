import React from "react";
import Plot from "react-plotly.js";
import CitiesDropdown from "./CitiesDropdown.js";
import axios from "axios";

const baseURL = "/evictions/";
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
// blue rgb(61, 113, 210)
// brown rgb(186, 117, 3)
// green rgb(90, 200, 48)
// red rgb(212, 30, 33)
// green2 rgb(44, 170, 115)
const colors = [[61, 113, 210], [44, 170, 115], [212, 30, 33], [90, 200, 48]];

export default class CitiesGraph extends React.Component {
    state = {
        town: "",
        plotlyTitle: "Evictions in town",
        plotlyData: [
            {
                x: [],
                y: [],
                type: "scatter",
                mode: "lines+markers",
                marker: {color: "red"}
            },
            {type: "bar", x: [], y: []}
        ]
    }

    populateGraph = (town, label) => {
        // todo: allow switching between town and city
        axios.get(`${baseURL}` + town + "?type=town")
            .then(res => {
                const evictions_res = res.data.evictions;
                this.plotBarChart(evictions_res);
                this.setState({plotlyTitle: "Evictions in " + label});
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

    changeHandler = (townObj) => {
        this.setState({
            town: townObj
        });
        this.populateGraph(townObj.value, townObj.label);
    }
    componentDidMount = () => {
        this.populateGraph('BOSTON', 'Boston');
    }

    render() {
        return <>
            <CitiesDropdown
                onChange={this.changeHandler}
            />
            <Plot
                data={this.state.plotlyData}
                layout={
                    {
                        title: this.state.plotlyTitle,
                        margin: {l: 20, r: 0, t: 140, b: 80},
                        paper_bgcolor: "rgba(0,0,0,0)",
                        plot_bgcolor: "rgba(0,0,0,0)",
                        showgrid: false,
                        font: {
                            size: 10,
                            color: '#ffffff'
                        },
                        xaxis: {
                            showgrid: false,
                            showline: false
                        },
                        yaxis: {
                            showgrid: false,
                            showline: false
                        }
                    }
                }
            />

        </>

    }
}
