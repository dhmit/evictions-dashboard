import React from "react";
import CitiesGraph from "./CitiesGraph";
import Map from "./Map";
import Stats from "./Stats";
import STYLES from "./Home.module.scss";

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
            <div className={STYLES.dashboard} id={"dashboard"}>
                <div className={STYLES.map} id={"map"}>
                    <Map setStats={this.setStats.bind(this)}
                    />
                </div>
                <div className={STYLES.stats} id={"stats"}>
                    <Stats locale={this.state.locale}
                           evictions={this.state.evictions}
                           stats={this.state.stats}/>
                </div>
                <div className={STYLES.cities} id={"cities"}>
                    <CitiesGraph setStats={this.setStats.bind(this)}
                                 town={this.state.locale.town}/>
                </div>
                <div className={STYLES.details}>
                    hello</div>
            </div>
        </>;
    }
}

