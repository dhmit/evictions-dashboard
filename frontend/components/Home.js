import axios from "axios";
import React from "react";
import CitiesGraph from "./CitiesGraph";
import Map from "./Map";
import Stats from "./Stats";
import EvictionDetails from "./EvictionDetails";
import STYLES from "./Home.module.scss";

let totals = {
    evictions: 0,
    asian_renters: 0,
    black_renters: 0,
    latinx_renters: 0,
    white_renters: 0,
    under18_pop: 0,
    tot_renters: 0,
};
const baseURL = "/statistics";
const TotalURL = baseURL + "/totals"

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

    componentDidMount = () => {
        this.clearStats();
    }

    getTractsStats(obj) {
        return axios.get(baseURL + "?tracts=" + obj.tract.join(","))
            .then((res) => {
                obj.stats.non_payment = res.data["non_payment%"]
                obj.stats.no_cause = res.data["no_cause%"]
                return obj
            })
    }

    setStats = (obj) => {
        if (obj.tract && obj.tract.length >= 1) {
            this.getTractsStats(obj).then((res) => {
                this.setState({
                    town: res.town ? res.town : this.state.town,
                    tract: res.tract ? res.tract : this.state.tract,
                    stats: res.stats ? res.stats : this.state.stats,
                })
            })
        } else {
            this.setState({
                town: obj.town ? obj.town : this.state.town,
                tract: obj.tract ? obj.tract : this.state.tract,
                stats: obj.stats ? obj.stats : this.state.stats,
            })
        }

    }

    setStateTotals = (totals) => {
        let newState = {
            stats: {
                evictions: totals.evictions,
                evictions_per_1000: 0,
                town_evictions_per_1000: 0,
                no_cause: totals["no_cause%"],
                non_payment: totals["non_payment%"],
                asian_renters: totals.demography.asian_renters,
                black_renters: totals.demography.black_renters,
                latinx_renters: totals.demography.latinx_renters,
                white_renters: totals.demography.white_renters,
                under18_pop: totals.demography.under18_pop,
            },
            tract: [],
            town: "Total",
        }
        this.setStats(newState)
    }
    clearStats = () => {
        totals = localStorage.getItem("totals");
        this.setState({town: "", showEntireTown: false});
        if (!totals) {
            axios.get(TotalURL).then((res) => {
                totals = res.data;
                localStorage.setItem("totals", JSON.stringify(totals));
                this.setStateTotals(totals)
            })
        } else {
            totals = JSON.parse(totals);
            this.setStateTotals(totals)
        }
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
                <div className={`${STYLES.map} p-0`} id={"map"}>
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

