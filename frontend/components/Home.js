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
            town: "",
            stats: {
                evictions: 0,
            },
            tract: [],
            showEntireTown: false,
            overwrittenFromDropdown: false,
        };
    }

    setStats = (obj) => {
        this.clearStats();
        console.log('HOMEjs setStats', obj)
        this.setState({
            town: obj.town ? obj.town : this.state.town,
            tract: obj.tract ? obj.tract : this.state.tract,
            stats: obj.stats ? obj.stats : this.state.stats,
        })
        console.log('HOMEjs setStats state, after', this.state)
    }
    clearStats = () => {
        this.setState({
            stats: {
                evictions: 0,
                evictions_per_1000: 0,
                town_evictions_per_1000: 0,
                asian_renters: 0,
                black_renters: 0,
                latinx_renters: 0,
                white_renters: 0,
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
                    <Map town={this.state.town}
                         showEntireTown={this.state.showEntireTown}
                         toggleEntireTown={this.toggleEntireTown.bind(this)}
                         stats={this.state.stats}
                         setStats={this.setStats.bind(this)}/>
                </div>
                <div className={STYLES.stats} id={"stats"}>
                    <Stats toggleEntireTown={this.toggleEntireTown.bind(this)}
                           clearStats={this.clearStats.bind(this)}
                           showEntireTown={this.state.showEntireTown}
                           setStats={this.setStats.bind(this)}
                           town={this.state.town}
                           tract={this.state.tract}
                           stats={this.state.stats}/>
                </div>
                <div className={STYLES.cities} id={"cities"}>
                    <CitiesGraph setStats={this.setStats.bind(this)}
                                 overwriteFromDropdown={this.overwriteFromDropdown.bind(this)}
                                 showEntireTown={this.state.showEntireTown}
                                 town={this.state.town}/>
                </div>
                <div className={STYLES.details}>
                    <EvictionDetails
                        tract={this.state.tract}
                        town={this.state.town}/>
                </div>
            </div>
        </>;
    }
}

