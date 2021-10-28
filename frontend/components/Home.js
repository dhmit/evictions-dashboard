import React from "react";
import Plot from "react-plotly.js";
import CitiesDropdown from "./CitiesDropdown.js";


export default class Home extends React.Component {
    state = {
        city: ""
    }

    changeHandler = (value) => {
        this.setState({
            city: value
        });
    }

    render() {
        return <>
            <CitiesDropdown
                onChange={this.changeHandler}
            />
            <Plot
                data={[
                    {
                        x: [1, 2, 3],
                        y: [2, 6, 3],
                        type: "scatter",
                        mode: "lines+markers",
                        marker: {color: "red"}
                    },
                    {type: "bar", x: [1, 2, 3], y: [2, 5, 3]}
                ]}
                layout={{width: 600, height: 400, title: "A Fancy Plot"}}
            />
        </>;
    }
}

