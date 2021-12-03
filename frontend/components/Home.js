import React from "react";
import CitiesGraph from "./CitiesGraph";
import Map from "./Map";
import Stats from "./Stats";
import EvictionDetails from "./EvictionDetails";
import STYLES from "./Home.module.scss";

export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locale: {"city": "", "town": ""},
            evictions: 0,
            stats: {},
            tract: [],
            showEntireTown: false,
            overwrittenFromDropdown: false,
        };
    }

    setStats = (stats) => {
        this.clearStats();
        this.setState({
            locale: stats.locale ? stats.locale : this.state.locale,
            evictions: stats.evictions ? stats.evictions : this.state.evictions,
            stats: stats.stats ? stats.stats : this.state.stats,
            tract: stats.tract ? stats.tract : this.state.tract,
        })
    }
    clearStats = () => {
        this.setState({
            locale: {town: "", city: ""},
            evictions: 0,
            stats: {
                asian_pop: 0,
                black_pop: 0,
                latinx_pop: 0,
                white_pop: 0,
                under18_pop: 0,
                foreign_born: 0,
            },
            tract: []
        })
    }

    toggleEntireTown = () => {
        this.setState({showEntireTown: !this.state.showEntireTown})
    }
    overwriteFromDropdown = (value) => {
        this.setState({overwrittenFromDropdown: value, showEntireTown: value})
    }

    render() {
        return <>
            <div className={STYLES.dashboard} id={"dashboard"}>
                <div className={STYLES.map} id={"map"}>
                    <Map town={this.state.locale.town}
                         showEntireTown={this.state.showEntireTown}
                         toggleEntireTown={this.toggleEntireTown.bind(this)}
                         stats={this.state.stats}
                         setStats={this.setStats.bind(this)}/>
                </div>
                <div className={STYLES.stats} id={"stats"}>
                    <Stats locale={this.state.locale}
                           evictions={this.state.evictions}
                           tract={this.state.tract}
                           toggleEntireTown={this.toggleEntireTown.bind(this)}
                           clearStats={this.clearStats.bind(this)}
                           showEntireTown={this.state.showEntireTown}
                           setStats={this.setStats.bind(this)}
                           stats={this.state.stats}/>
                </div>
                <div className={STYLES.cities} id={"cities"}>
                    <CitiesGraph setStats={this.setStats.bind(this)}
                                 overwriteFromDropdown={this.overwriteFromDropdown.bind(this)}
                                 showEntireTown={this.state.showEntireTown}
                                 town={this.state.locale.town}/>
                </div>
                <div className={STYLES.details}>
                    <EvictionDetails
                        tract={this.state.tract}
                        town={this.state.locale.town} />
                </div>
            </div>
        </>;
    }
}

