import axios from "axios";
import React from "react";
import PropTypes from "prop-types";
import STYLES from "./EvictionDetails.module.scss";
import {fixNameCapitalization} from "./global/Helpers.js";

const baseURL = "/details/";

export default class EvictionDetails extends React.Component {
    static propTypes = {
        tract: PropTypes.array,
        town: PropTypes.string,
    };

    state = {
        town: "",
        tract: [],
        evictions: [],
        title: "",
        subtitle: "",
    }

    getEvictionDetails = () => {
        if (!this.props.town || this.props.town === " ") return;
        let url = `${baseURL}` + this.props.town;
        let town = fixNameCapitalization(this.props.town);
        let title = "";
        let subtitle = "";
        title = "Eviction details for " + town;
        if (this.props.tract.length === 1) {
            url = url + "?tract=" + this.props.tract[0];
            subtitle = "Showing results for a single tract: " + this.props.tract[0];
        }
        axios.get(url).then((res) => {
            this.setState({
                evictions: res.data,
                town: this.props.town,
                tract: this.props.tract,
                title: title,
                subtitle: subtitle
            })
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.town && prevProps.town !== this.props.town || prevProps.tract !== this.props.tract) {
            this.getEvictionDetails();
        }
    }

    render() {
        return <>
            {this.state.town && <>
                {!this.state.evictions.length && <>
                    No eviction data
                </>}
                {this.state.evictions.length > 0 &&
                <>
                    <h3 className="mb-3">{this.state.title}</h3>
                    <h4 className="subtitle">{this.state.subtitle}</h4>
                    <div className={STYLES.tableContainer}>
                        <table className={`${STYLES.table} table`}>
                            <thead>
                            <tr>
                                <th>Census Tract</th>
                                <th>Case Type</th>
                                <th>Plaintiff</th>
                                <th>Attorney</th>
                                <th>File date</th>
                                <th>Town</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.evictions.map((eviction, idx) =>
                                <tr key={idx}>
                                    <td><small>{eviction.census_tract}</small></td>
                                    <td><small>{eviction.case_type}</small></td>
                                    <td><small>{eviction.ptf}</small></td>
                                    <td><small>{eviction.ptf_atty}</small></td>
                                    <td><small>{eviction.file_date}</small></td>
                                    <td><small>{eviction.town_id}</small></td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </>}
            </>}
        </>
    }
}
