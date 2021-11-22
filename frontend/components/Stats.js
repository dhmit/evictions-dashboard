import React from "react";
import PropTypes from 'prop-types';

export default class Stats extends React.PureComponent {
    static propTypes = {
        locale: PropTypes.object,
        evictions: PropTypes.number,
        stats: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                {this.props.locale.town &&
                <>
                    <h1>Town: {this.props.locale.town.toLowerCase()}</h1>
                    <h3>Evictions: {this.props.evictions}</h3>
                    {Object.keys(this.props.stats).length &&
                    <>
                        <h3>Demography</h3>
                        <ul>
                            <li>Asian: {this.props.stats.asian_pop}</li>
                            <li>Black: {this.props.stats.black_pop}</li>
                            <li>Latinx: {this.props.stats.latinx_pop}</li>
                            <li>White: {this.props.stats.white_pop}</li>
                        </ul>
                    </>}
                </>}
            </>
        );
    }
}
