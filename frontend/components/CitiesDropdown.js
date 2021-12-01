import axios from "axios";
import React from "react";
import Select from "react-select";
import PropTypes from "prop-types";

const baseURL = "/locales";

function formatCities(city) {
    // react-select expects {value: something, label: something}
    return {value: city, label: city.split("-").join(" ").toUpperCase()};
}

const customStyles = {
    menu: (provided, state) => ({
        ...provided,
        width: state.selectProps.width,
        color: 'black',
        backgroundColor: "gray",
        margin: 20,
        borderRadius: 0,
    }),

    control: (_, {selectProps: {width}}) => ({
        width: width
    }),

    singleValue: (provided, state) => {
        const color = 'white';
        const fontSize = '24px';
        const transition = 'opacity 300ms';
        return {...provided, fontSize, color, transition};
    }
}


export default class CitiesDropdown extends React.Component {
    static propTypes = {
        selectedCity: PropTypes.string,
        onChange: PropTypes.func,
        town: PropTypes.string,
        value: PropTypes.string,
    };

    constructor(props) {
        super(props);
        this.state = {
            cities: [],
            selectedValue: {},
            typeOfLocale: 'town',
        };
    }

    changeHandler = (e) => {
        /* Sending update back up to CitiesGraph */
        if (typeof this.props.onChange === "function") {
            this.props.onChange(e);
        }
    }

    componentDidMount() {
        this.populateCities();
    }


    static getDerivedStateFromProps(props, state) {
        if (props.town && state.selectedValue.value !== props.town) {
            return {
                selectedValue: {label: props.town, value: props.town}
            }
        }
        return null
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
                    styles={customStyles}
                    className={"select"}
                    onChange={this.changeHandler}
                    value={this.state.selectedValue}
                    options={this.state.cities}/>
        </>;
    }
}
