import React from "react";
import Plot from "react-plotly.js";
import CitiesDropdown from "./CitiesDropdown.js";
import axios from "axios";
import PropTypes from "prop-types";

const baseURL = "/evictions/";
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const log = false
const colors = [[255, 166, 166], [255, 49, 49], [61, 113, 210], [44, 170, 115], [212, 30, 33], [90, 200, 48]];
export default class CitiesGraph extends React.Component {
    static propTypes = {
        setStats: PropTypes.func,
        town: PropTypes.string
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

    componentDidUpdate = () => {
        let town = this.state.updatedDropdown ? this.state.currentTown : this.props.town;

        // console.log("componentDidUpdate", town)
        if (!town) return;
        this.populateGraph(town).then((res) => {
            this.setState({currentTown: town, updatedDropdown: false})

            console.log("populateGraph after", town)
        })
    }

    shouldComponentUpdate(nextProps, nextState) {
        let shouldIt = nextProps.town !== nextState.currentTown || nextState.updatedDropdown;
        this.printout("shouldComponentUpdate, props: " + nextProps.town + " state: " + nextState.currentTown + " dropdownUpdate? " + nextState.updatedDropdown, "gray");
        this.printout("SHOULD IT UPDATE?? " + !shouldIt, "green")
        return shouldIt
    }

    populateGraph = (town) => {
        // todo: allow switching between town and city
        this.printout("populateGraph " + town, "orange")
        if (!(town)) return;
        return axios.get(`${baseURL}` + town + "?type=town")
            .then(res => {
                this.printout("<< populateGraph after " + town, "orange")
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
        console.log('setState')
        this.setState({plotlyData});
    }
    printout = (msg, color) => {
        if (!(log)) return;
        console.log("GRAPH %c" + msg, "color:" + color + ";font-weight:bold;")
    }
    changeHandler = (townObj) => {
        this.printout("changeHandler " + townObj.value, "blue");
        // if (this.state.currentTown !== townObj.value)
        this.setState({
            updatedDropdown: true,
            currentTown: townObj.value
        });
        this.props.setStats({
            locale: {
                city: "",
                town: townObj.value
            },
        })
        this.populateGraph(townObj.value);
    }
    // componentDidMount = (prevProps, prevState) => {
    //     // if (prevProps.town !== this.props.town) {
    //     //     console.log('props updated', this.props.town)
    //     // }
    //     // let town = this.state.updatedDropdown ? this.state.currentTown : this.props.town;
    //     this.populateGraph().then((res) => {
    //         // this.setState({plotlyTitle: "Evictions in " + this.props.town});
    //         console.log("CitiesGraph, componentDidMount", this.props.town)
    //     });
    //     //     if (this.props.town) {
    //     //     } else {
    //     //         this.populateGraph('BOSTON', 'Boston');
    //     //     }
    // }

    render() {
        // this.populateGraph(this.props.town);
        // const {town} = this.props.town
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
