import axios from "axios";
import React from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import {fixNameCapitalization} from "./global/Helpers.js";

const baseURL = "/locales";

function formatCities(city) {
    // react-select expects {value: something, label: something}
    return {value: city, label: city.split("-").join(" ").toUpperCase()};
}

const customStyles = {
    menu: (provided) => ({
        ...provided,
        // width: state.selectProps.width,
        color: "black",
        padding: 0,
        // margin: 20,
        // borderRadius: 0,
    }),
    input: (provided) => ({
        ...provided,
        // backgroundColor: 'blue',
        color: 'white',
        padding: 0
    }),
    indicatorsContainer: (provided) => ({
        ...provided,
        backgroundColor: "#1a1b23",
    }),
    control: (provided) => ({
        ...provided,
        backgroundColor: "#1a1b23",
        border: "0.02em solid #565656",
        borderRadius: 0,
    }),
    option: (provided, state) => ({
        ...provided,
        borderBottom: "1px dotted #565656",
        color: state.isSelected ? "pink" : "white",
        padding: 20,
        backgroundColor: "#1f202a"
    }),
    singleValue: (provided, state) => ({
        ...provided,
        opacity: state.isDisabled ? 0.5 : 1,
        color: "#ffffff",
        transition: "opacity 300ms",

        // return {...provided, opacity, backgroundColor, transition};
    })
    //
    // control: (_, {selectProps: {width}}) => ({
    //     width: width
    // }),

    // singleValue: (provided) => {
    //     color: "white";
    //     const fontSize = "24px";
    //     const transition = "opacity 300ms";
    //     return {...provided, fontSize, color, transition};
    // }
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
            typeOfLocale: "town",
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
                selectedValue: {label: fixNameCapitalization(props.town), value: props.town}
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
                    className="select"
                    onChange={this.changeHandler}
                    value={this.state.selectedValue}
                    options={this.state.cities}/>
        </>;
    }
}
