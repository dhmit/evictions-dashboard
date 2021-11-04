import React from "react";
import Plot from "react-plotly.js";
import CitiesDropdown from "./CitiesDropdown.js";
import axios from "axios";

const baseURL = "/evictions/";
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export default class Home extends React.Component {
    state = {
        city: "",
        plotlyTitle: "Evictions in city",
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
    randomRGB = () => {
        return Math.floor(Math.random() * 256);
    }
    getPlotlyDataObject = (xVal) => {
        return {
            x: xVal ? xVal : [],
            y: [],
            type: "bar",
            name: "Evictions in 2020",
            marker: {
                color: `rgb(${this.randomRGB()},${this.randomRGB()},${this.randomRGB()})`,
                opacity: 1
            }
        };
    }

    plotBarChart = (evictions) => {
        const plotlyData = [];
        for (let year in evictions) {
            let data = this.getPlotlyDataObject(months.slice());
            for (let month = 0; month < evictions[year].length; month++) {
                data.x[month] = data.x[month] + " '" + year.slice(2);
                data.y[month] = evictions[year][month];
            }
            data.name = "Evictions in " + year;
            plotlyData.push(data);
        }
        console.log(plotlyData);
        this.setState({plotlyData});
    }

    changeHandler = (cityObj) => {
        this.setState({
            city: cityObj
        });
        console.log(cityObj);
        axios.get(`${baseURL}` + cityObj.value)
            .then(res => {
                const evictions_res = res.data.evictions;
                this.plotBarChart(evictions_res);
                this.setState({plotlyTitle: "Evictions in " + cityObj.label});
            });
    }


    render() {
        return <>
            <div className={"row"}>
                <CitiesDropdown
                    onChange={this.changeHandler}
                />

                <Plot
                    data={this.state.plotlyData}
                    layout={{width: 1000, height: 400, title: this.state.plotlyTitle}}
                />
            </div>
        </>;
    }
}

