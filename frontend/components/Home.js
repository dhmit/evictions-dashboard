import React from "react";
import CitiesGraph from "./CitiesGraph";
import Map from "./Map.js"

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locale: {"city": "", "town": ""},
            evictions: 0,
            stats: {}
        };
    }

    setStats = (stats) => {
        this.setState({
            locale: stats.locale,
            evictions: stats.evictions,
            stats: stats.stats
        })
    }

    render() {
        return <>
            <div id={"dashboard"}>
                <div id={"map"}>
                    <Map setStats={this.setStats.bind(this)}
                    />
                </div>
                <div id={"cities"}>
                    <CitiesGraph/>
                </div>
            </div>
        </>;
    }
}

