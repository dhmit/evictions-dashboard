import React from "react";
import PropTypes from 'prop-types';

export default class Stats extends React.PureComponent {
    static propTypes = {
        locale: PropTypes.object,
        evictions: PropTypes.number,
        stats: PropTypes.object,
        tract: PropTypes.array,
        setStats: PropTypes.func,
        toggleEntireTown: PropTypes.func,
        showEntireTown: PropTypes.bool,
        overwrittenFromDropdown: PropTypes.bool,
        clearStats: PropTypes.func,
    };

    constructor(props) {
        super(props);
    }

    selectTown = () => {
        this.props.toggleEntireTown();

    }
    capitalize = (str) => {
        let townParts = str.split(" ");
        let town = "";
        for (let i = 0; i < townParts.length; i++) {
            town += (townParts[i].charAt(0).toUpperCase() + townParts[i].slice(1).toLowerCase()) + " ";
        }
        return town;
    }

    render() {
        return (
            <>
                {this.props.locale.town &&
                <>
                    <button className={"btn-transparent"}
                            onClick={this.props.clearStats}>Reset map
                    </button>
                    &nbsp;&nbsp;
                    <button className={"btn-transparent"}
                            key={this.props.showEntireTown}
                            disabled={this.props.showEntireTown}
                            onClick={this.selectTown}>
                        Select all of {this.props.locale.town}
                    </button>
                </>
                }
                <br/><br/>
                {this.props.locale.town &&
                <>
                    <h5 className={"red-text"}>Statistics</h5>
                    <ul>
                        <li><span
                            className={"pink-text"}>Town:</span> {this.capitalize(this.props.locale.town)}
                        </li>
                        <li>
                            {this.props.tract.length < 2 && <>
                                <span className={"pink-text"}>Census tract:</span>
                                {this.props.tract}</>
                            }
                            {this.props.tract.length >= 2 && <>
                                <span className={"pink-text"}>Census tracts:</span>
                                <ul className="list-inline">
                                    {this.props.tract.map((tract, index) => (
                                        <li className="list-inline-item" key={index}>
                                            {tract}
                                        </li>
                                    ))}
                                </ul>
                            </>}
                        </li>
                        <li><span className={"pink-text"}>Evictions:</span> {this.props.evictions}
                        </li>
                    </ul>
                    {Object.keys(this.props.stats).length &&
                    <>
                        <h5 className={"red-text"}>Demography</h5>
                        <ul>
                            <li><span
                                className={"pink-text"}>Asian:</span> {this.props.stats.asian_pop}
                            </li>
                            <li><span
                                className={"pink-text"}>Black:</span> {this.props.stats.black_pop}
                            </li>
                            <li><span
                                className={"pink-text"}>Latinx:</span> {this.props.stats.latinx_pop}
                            </li>
                            <li><span
                                className={"pink-text"}>White:</span> {this.props.stats.white_pop}
                            </li>
                            <li><span
                                className={"pink-text"}>Under 18:</span> {this.props.stats.under18_pop}
                            </li>
                        </ul>
                    </>}
                </>}
            </>
        );
    }
}
