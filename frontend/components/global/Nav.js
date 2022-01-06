import React from "react";
import STYLES from "./Nav.module.scss";

const Nav = () => {

    return (
        <nav className="navbar navbar-dark bg-dark navbar-expand-sm">
            <a className={`navbar-brand ${STYLES.linkHome}`} href="/">Massachusetts evictions
                dashboard</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse"
                    data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                    aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"/>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item float-right">
                        <a className="nav-link" href="/">
                            HOME
                        </a>
                    </li>
                    <li className="nav-item float-right">
                        <a className="nav-link" href="/about">
                            ABOUT
                        </a>
                    </li>
                </ul>
                <a className={`font-weight-bold white-text ${STYLES.linkLab}`}
                   href="https://digitalhumanities.mit.edu/" target="_blank" rel="noreferrer">
                    DH
                </a><span className={"font-weight-bold white-text"}> + </span>
                <a className={`font-weight-bold white-text ${STYLES.linkLab}`}
                   href="https://dusp.mit.edu/">DUSP</a>
            </div>
        </nav>
    );
};

export default Nav;
