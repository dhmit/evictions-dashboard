import axios from "axios";
import React from "react";
import Select from "react-select";

const baseURL = "/cities";

function formatCities(city) {
    // react-select expects {value: something, label: something}
    return {value: city, label: city.toUpperCase()};
}
export default class CitiesDropdown extends React.Component {
    state = {
        cities: []
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
        return <Select options={this.state.cities}/>;
    }
}
