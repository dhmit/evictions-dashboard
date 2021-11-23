import React from "react";
import PropTypes from 'prop-types';

export default class Stats extends React.PureComponent {
    static propTypes = {
        locale: PropTypes.object,
        evictions: PropTypes.number,
        stats: PropTypes.object,
        tract: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

    reset = () => {
        // TODO: how does this travel to the map component??
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
                <button className={"btn-transparent"}>Reset map</button>
                <br/><br/>
                {this.props.locale.town &&
                <>
                    <h5 className={"red-text"}>Statistics</h5>
                    <ul>
                        <li><span
                            className={"pink-text"}>Town:</span> {this.capitalize(this.props.locale.town)}
                        </li>
                        <li><span className={"pink-text"}>Census tract:</span> {this.props.tract}
                        </li>
                        <li><span className={"pink-text"}>Evictions:</span> {this.props.evictions}
                        </li>
                    </ul>
                    {Object.keys(this.props.stats).length &&
                    <>
                        <h5 className={"red-text"}>Demography</h5>
                        <ul>
                            <li><span className={"pink-text"}>Asian:</span> {this.props.stats.asian_pop}</li>
                            <li><span className={"pink-text"}>Black:</span> {this.props.stats.black_pop}</li>
                            <li><span className={"pink-text"}>Latinx:</span> {this.props.stats.latinx_pop}</li>
                            <li><span className={"pink-text"}>White:</span> {this.props.stats.white_pop}</li>
                        </ul>
                    </>}
                </>}
            </>
        );
    }
}
