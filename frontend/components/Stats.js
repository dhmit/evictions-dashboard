import React from "react";
import PropTypes from "prop-types";
import {fixNameCapitalization} from "./global/Helpers.js";

export default class Stats extends React.PureComponent {
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
    }

    selectTown = () => {
        this.props.toggleEntireTown();
    }

    render() {
        return (
            <>
                {this.props.town && this.props.town !== "Total" &&
                <>
                    <button className={"btn-transparent"}
                            onClick={this.props.clearStats}>Reset
                    </button>
                    &nbsp;&nbsp;

                    <button className={"btn-transparent"}
                            key={this.props.showEntireTown}
                            disabled={this.props.showEntireTown}
                            onClick={this.selectTown}>
                        Select all of {fixNameCapitalization(this.props.town)}
                    </button>
                </>
                }
                <br/><br/>

                {this.props.town &&
                <>
                    <h5 className={"red-text"}>Statistics</h5>
                    <ul>
                        <li>
                            <span
                                className={"pink-text"}>Town:</span> {fixNameCapitalization(this.props.town)}
                        </li>
                        <li>
                            {this.props.tract.length === 1 && <>
                                <span className={"pink-text"}>Census tract: </span>
                                {this.props.tract}</>
                            }
                            {this.props.tract.length >= 2 && <>
                                <span className={"pink-text"}>Census tracts:</span>
                                <ul className="list-inline">
                                    {this.props.tract.map((tract, index) => (
                                        <li className="list-inline-item" key={index}>
                                            <small>{tract}</small>
                                        </li>
                                    ))}
                                </ul>
                            </>}
                        </li>
                        <li>
                            {!this.props.showEntireTown && this.props.stats.evictions_per_1000 > 0 && <>
                            <span
                                className={"pink-text"}>
                                Tract evictions per 1000: </span> {this.props.stats.evictions_per_1000.toLocaleString()}
                            </>
                            }
                            {this.props.showEntireTown && this.props.stats.town_evictions_per_1000 && <>
                                 <span
                                     className={"pink-text"}>
                                Town evictions per 1000: </span> {this.props.stats.town_evictions_per_1000.toLocaleString()}
                            </>}
                        </li>
                        <li>
                            <span className={"pink-text"}>
                                Total evictions: </span> {this.props.stats.evictions.toLocaleString()}
                        </li>

                    </ul>
                    {Object.keys(this.props.stats).length &&
                    <>
                        <h5 className={"red-text"}>Demography of renters</h5>
                        <ul>
                            <li><span
                                className={"pink-text"}>Asian:&nbsp;</span>
                                {this.props.stats.asian_renters.toLocaleString()}
                            </li>
                            <li><span
                                className={"pink-text"}>Black:&nbsp;</span>
                                {this.props.stats.black_renters.toLocaleString()}
                            </li>
                            <li><span
                                className={"pink-text"}>Latinx:&nbsp;</span>
                                {this.props.stats.latinx_renters.toLocaleString()}
                            </li>
                            <li><span
                                className={"pink-text"}>White:&nbsp;</span>
                                {this.props.stats.white_renters.toLocaleString()}
                            </li>
                        </ul>
                        <h5 className={"red-text"}>Other demography</h5>
                        <span
                                className={"pink-text"}>Under 18:&nbsp;</span>
                                {this.props.stats.under18_pop.toLocaleString()}

                    </>}
                </>}
            </>
        );
    }
}
