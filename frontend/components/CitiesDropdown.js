import axios from "axios";
import React from "react";
import Select from "react-select";
import PropTypes from "prop-types";

const baseURL = "/locales";

function formatCities(city) {
    // react-select expects {value: something, label: something}
    return {value: city, label: city.split("-").join(" ").toUpperCase()};
}

const FILTERS_MAJORITY = ["Black", "White", "Asian"];

export default class CitiesDropdown extends React.Component {
    static propTypes = {
        selectedCity: PropTypes.string,
        onChange: PropTypes.func,
        town: PropTypes.string,
    };
    constructor(props) {
        super(props);
        this.state = {
            cities: [],
            typeOfLocale: 'town', // TODO: show radio buttons for city/town choice
            filterMajority: undefined,
        };
    }

    changeHandler = (e) => {
        if (typeof this.props.onChange === "function") {
            this.props.onChange(e);
        }
    }
    updateFilter = (e) => {
        this.populateCities(e.target.value);
    }

    componentDidMount() {
        this.populateCities();
    }

    populateCities(filter) {
        let url = baseURL + "?type=" + this.state.typeOfLocale;
        if (filter) {
            url += "?filter=" + filter.toLowerCase();
        }

        axios.get(`${url}`)
            .then(res => {
                const cities_res = res.data.cities;
                const cities = cities_res.map(formatCities);
                this.setState({cities});
            });
    }

    render() {
        return <>
            <Select id={"cities-dropdown"}
                    className={"select"}
                    onChange={this.changeHandler}
                    options={this.state.cities}/>
        </>;
    }
}
