import React from "react";
import PropTypes from "prop-types";
import {fixNameCapitalization} from "./global/Helpers.js";
import STYLES from "./Stats.module.scss";

export default class Stats extends React.Component {
    static propTypes = {
        town: PropTypes.string,
        stats: PropTypes.object,
        tract: PropTypes.array,
        setStats: PropTypes.func,
        toggleEntireTown: PropTypes.func,
        showEntireTown: PropTypes.bool,
        clearStats: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            showAllTracts: false
        }
    }

    selectTown = () => {
        this.props.toggleEntireTown();
    }

    toggleTracts = () => {
        this.setState({showAllTracts: !this.state.showAllTracts})
    }

    render() {
        return (
            <>
                {this.props.town && this.props.town !== "Total" &&
                <div className={`${STYLES.btnGroup} mb-3`}>
                    <button className={"btn btn-outline-light btn-sm"}
                            onClick={this.props.clearStats}>Reset map & stats
                    </button>
                    &nbsp;&nbsp;

                    <button className={"btn btn-outline-light btn-sm"}
                            key={this.props.showEntireTown}
                            disabled={this.props.showEntireTown}
                            onClick={this.selectTown}>
                        Select all of {fixNameCapitalization(this.props.town)}
                    </button>

                </div>
                }

                {this.props.town &&
                <div className={STYLES.main}>
                    <div className={STYLES.overview}>
                        <p className={"section-header font-weight-bold mb-0"}>Statistics</p>
                        <ul>
                            <li>
                                {this.props.town !== "Total" && <span
                                    className={"stats-label font-weight-semibold"}>Town:</span>} {fixNameCapitalization(this.props.town)}
                            </li>
                        </ul>
                        <ul>
                            <li>
                                {this.props.tract.length === 1 && <>
                                    <span className={"stats-label font-weight-semibold"}>Census tract: </span>
                                    {this.props.tract}</>
                                }
                                {this.props.tract.length > 1 && <>
                                    <span className={"stats-label font-weight-semibold"}>Census tracts:
                                        {this.state.showAllTracts && <>
                                            <button type="button"
                                                    className="btn btn-close btn-close-white btn-sm"
                                                    aria-label="Close"
                                                    onClick={this.toggleTracts}/>
                                        </>}
                                    </span>
                                </>}
                                {this.props.tract.length > 1 && this.props.tract.length <= 3 && <>
                                    <ul className="list-inline">
                                        {this.props.tract.map((tract, index) => (
                                            <li className="list-inline-item" key={index}>
                                                <small>{tract}</small>
                                            </li>
                                        ))}
                                    </ul>
                                </>}
                                {this.props.tract.length > 3 && <>
                                    <ul className="list-inline">
                                        {this.props.tract.slice(0, 3).map((tract, index) => (
                                            <li className="list-inline-item" key={index}>
                                                <small>{tract}</small>
                                            </li>
                                        ))}
                                    </ul>
                                    {!this.state.showAllTracts && <>
                                        <button type="button"
                                                className="btn btn-outline-light btn-sm"
                                                onClick={this.toggleTracts}>...
                                        </button>
                                    </>
                                    }
                                    {this.state.showAllTracts && <>
                                        <ul className="list-inline">
                                            {this.props.tract.slice(4).map((tract, index) => (
                                                <li className="list-inline-item" key={index}>
                                                    <small>{tract}</small>
                                                </li>
                                            ))}
                                        </ul>
                                    </>}
                                </>}
                                <br/>
                            </li>
                            <li>
                                {!this.props.showEntireTown && this.props.stats.evictions_per_1000 > 0 && <>
                            <span
                                className={"stats-label font-weight-semibold"}>
                                Tract evictions per 1000: </span> {this.props.stats.evictions_per_1000.toLocaleString()}
                                </>
                                }
                                {this.props.showEntireTown && this.props.stats.town_evictions_per_1000 && <>
                                 <span
                                     className={"stats-label font-weight-semibold"}>
                                Town evictions per 1000: </span> {this.props.stats.town_evictions_per_1000.toLocaleString()}
                                </>}
                            </li>
                            <li>
                            <span className={"stats-label font-weight-semibold"}>
                                Total evictions: </span> {this.props.stats.evictions.toLocaleString()}
                            </li>
                            {this.props.stats.evictions_pct > 0 &&

                            <li>
                            <span className={"stats-label font-weight-semibold"}>
                                Evictions rate: </span>

                                {this.props.stats.evictions_pct.toLocaleString()}%
                            </li>
                            }

                        </ul>
                        <p className={"section-header font-weight-bold mb-0"}>Eviction types</p>
                        <ul>
                            <li><span className={"stats-label font-weight-semibold"}>
                            Non-payment of rent:
                        </span>&nbsp;
                                {this.props.stats.non_payment}%
                            </li>
                            <li><span className={"stats-label font-weight-semibold"}>
                            No cause:
                        </span>&nbsp;
                                {this.props.stats.no_cause}%
                            </li>
                        </ul>
                    </div>

                    {Object.keys(this.props.stats).length &&

                    <div className={STYLES.demo}>
                        <p className={"section-header font-weight-bold mb-0"}>Renter statistics</p>
                        <ul>
                            <li><span
                                className={"stats-label font-weight-semibold"}>Asian:&nbsp;</span>
                                {this.props.stats.asian_renters}
                            </li>
                            <li><span
                                className={"stats-label font-weight-semibold"}>Black:&nbsp;</span>
                                {this.props.stats.black_renters}
                            </li>
                            <li><span
                                className={"stats-label font-weight-semibold"}>Latinx:&nbsp;</span>
                                {this.props.stats.latinx_renters}
                            </li>
                            <li><span
                                className={"stats-label font-weight-semibold"}>White:&nbsp;</span>
                                {this.props.stats.white_renters}
                            </li>
                        </ul>
                        <p className={"section-header font-weight-bold mb-0"}>Overall population
                            statistics</p>
                        <span
                            className={"stats-label font-weight-semibold"}>Under 18:&nbsp;</span>
                        {this.props.stats.under18_pop.toLocaleString()}

                    </div>
                    }
                </div>}</>
        );
    }
}
