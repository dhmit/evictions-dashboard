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
    }

    getEvictionDetails = () => {
        if (!this.props.town || this.props.town === " ") return;
        let url = `${baseURL}` + this.props.town;
        let town = fixNameCapitalization(this.props.town);
        let title = "";
        if (this.props.tract.length === 1) {
            url = url + "?tract=" + this.props.tract[0];
            title = "Eviction details for census tract " + this.props.tract[0] + " in " + town;
        } else {
            title = "Eviction details for " + town;
        }
        axios.get(url).then((res) => {
            this.setState({
                evictions: res.data,
                town: this.props.town,
                tract: this.props.tract,
                title: title
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
                    <h6 className="mb-3">{this.state.title}</h6>
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
