import React from "react";
import CitiesGraph from "./CitiesGraph";
import Map from "./Map.js"
import STYLES from "./global/Base.module.scss";

export default class Home extends React.Component {
    render() {
        return <>
            <div id={STYLES.dashboard}>
                <div id={"map"}>
                    <Map/>
                </div>
                <div id={"cities"}>
                    <CitiesGraph/>
                </div>
            </div>
        </>;
    }
}

