import axios from "axios";
import React from "react";
import PropTypes from "prop-types";
import STYLES from './EvictionDetails.module.scss';

const baseURL = "/details/";

export default class EvictionDetails extends React.Component {
    static propTypes = {
        tract: PropTypes.array,
        town: PropTypes.string,
    };

    state = {
        town: '',
        tract: [],
        evictions: []
    }

    getEvictionDetails = () => {
        if (!this.props.town) return;
        let url = `${baseURL}` + this.props.town
        url = this.props.tract.length === 1 ?
            url + '?tract=' + this.props.tract[0] : url
        axios.get(url).then((res) => {
            this.setState({
                evictions: res.data,
                town: this.props.town,
                tract: this.props.tract
            })
        })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.town && prevProps.town !== this.props.town || prevProps.tract !== this.props.tract) {
            this.getEvictionDetails();
        }
    }

    render() {
        return <>

            {!this.state.evictions.length && <>
                No eviction data
            </>}
            {this.state.evictions.length > 0 &&
            <>
                <h5>Eviction details for {this.props.town}</h5>
                <div className={STYLES.tableContainer}>
                    <table className={`${STYLES.table} table table-dark`}>
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
        </>
    }
}
