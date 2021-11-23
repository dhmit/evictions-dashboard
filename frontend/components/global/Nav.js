import React from "react";
import STYLES from "./Nav.module.scss";

const Nav = () => {

    return (
        <nav className="navbar navbar-dark bg-dark navbar-expand-sm">
            <a className={`navbar-brand ${STYLES.linkHome}`} href="/">Eviction dashboard</a>
            <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                </li>
            </ul>
            <a className={`font-weight-bold white-text ${STYLES.linkLab}`} href="https://digitalhumanities.mit.edu/" target="_blank" rel="noreferrer">
                    DH
            </a><span className={"font-weight-bold white-text"}> + </span>
            <a className={`font-weight-bold white-text ${STYLES.linkLab}`} href="https://dusp.mit.edu/">DUSP</a>
        </nav>
    );
};

export default Nav;
