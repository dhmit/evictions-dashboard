import axios from "axios";
import React from "react";
import Select from "react-select";
import PropTypes from "prop-types";

const baseURL = "/cities";

function formatCities(city) {
    // react-select expects {value: something, label: something}
    return {value: city, label: city.split("-").join(" ").toUpperCase()};
}

const FILTERS_MAJORITY = ["Black", "White", "Asian"];

export default class CitiesDropdown extends React.Component {
    static propTypes = {
        selectedCity: PropTypes.string,
        onChange: PropTypes.func
    };
    state = {
        cities: [],
        filterMajority: undefined,
        radios: FILTERS_MAJORITY.reduce(
            (options, option) => ({
                ...options,
                [option]: false

            })
        )
    }

    resetRadios = () => {
        Object.keys(this.state.radios).forEach(radio => {
            this.setState(prevState => ({
                radios: {
                    ...prevState.radios,
                    [radio]: false
                }
            }));
        });
    }

    createRadios = () => {
        return FILTERS_MAJORITY.map(this.createRadio);
    }

    createRadio = option => (
        <div className="input-group-text">
            <input type={"radio"}
                   aria-label={"Radio input for majority " + option + "filter"}
                   key={option}
                   onChange={this.updateFilter}
                   value={option}/>
            &nbsp;Majority {option} population
        </div>
    );

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
        let url = baseURL;
        if (filter) {
            url += "?filter=" + filter.toLowerCase();
        }
        console.log("populateCities:",url);
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
                    className={"select col-6"}
                    onChange={this.changeHandler}
                    options={this.state.cities}/>


            {/*<div className="input-group mb-3">*/}
            {/*    <div className="input-group-prepend">*/}
            {/*        {this.createRadios()}*/}
            {/*        <div className="input-group-text">*/}
            {/*            <input type={"button"}*/}
            {/*                   onClick={this.resetRadios}*/}
            {/*                   value={"reset"}/>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*</div>*/}
        </>
            ;
    }
}
