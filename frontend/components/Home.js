import React from "react";
import Plot from "react-plotly.js";
import CitiesDropdown from "./CitiesDropdown.js";
import axios from "axios";

const baseURL = "/evictions/";
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export default class Home extends React.Component {
    state = {
        city: "",
        plotlyData: [
            {
                x: [1, 2, 3],
                y: [2, 6, 3],
                type: "scatter",
                mode: "lines+markers",
                marker: {color: "red"}
            },
            {type: "bar", x: [1, 2, 3], y: [2, 5, 3]}
        ]

    }
    randomRGB = () => {
        return Math.floor(Math.random() * 256);
    }
    getPlotlyDataObject = () => {
        return {
            x: months,
            y: [],
            type: "bar",
            name: "Evictions in 2020",
            marker: {
                color: `rgb(${this.randomRGB()},${this.randomRGB()},${this.randomRGB()})`,
                opacity: 0.7
            }
        };
    }

    plotBarChart = (evictions) => {

        const plotlyData = [];
        console.log('evictions:', evictions);
        for (let year in evictions) {
            let data = this.getPlotlyDataObject();
            console.log(year);
            for (let month = 0; month < evictions[year].length; month++) {
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
                // this.setState({evictions});
            });
    }


    render() {
        return <>
            <CitiesDropdown
                onChange={this.changeHandler}
            />
            <Plot
                data={this.state.plotlyData}
                layout={{width: 600, height: 400, title: "Evictions Per City"}}
            />
        </>;
    }
}

