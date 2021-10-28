import axios from "axios";
import React from "react";
import Select from "react-select";
import PropTypes from 'prop-types';

const baseURL = "/cities";

function formatCities(city) {
    // react-select expects {value: something, label: something}
    return {value: city, label: city.split("-").join(" ").toUpperCase()};
}

export default class CitiesDropdown extends React.Component {
    static propTypes = {
        selectedCity: PropTypes.string,
        onChange: PropTypes.func
    };
    state = {
        cities: []
    }
    changeHandler = (e) => {
        if (typeof this.props.onChange === "function") {
            this.props.onChange(e);
        }
    }

    componentDidMount() {
        axios.get(`${baseURL}`)
            .then(res => {
                const cities_res = res.data.cities;
                const cities = cities_res.map(formatCities);
                this.setState({cities});
            });
    }

    render() {
        return <Select onChange={this.changeHandler} options={this.state.cities}/>;
    }
}
