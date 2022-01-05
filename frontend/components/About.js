import React from "react";

export default class About extends React.Component {
    render() {
        return <div id={"about-page"}>
            <section>
                <h1>About</h1>
                This project is a collaboration between&nbsp;
                <a href={"https://dusp.mit.edu"}
                   rel="noreferrer" target="_blank">MIT's
                    Department of Urban Studies & Planning </a> and
                MIT's <a href={"digitalhumanities.mit.edu"} rel="noreferrer" target="_blank">
                Digital Humanities Lab</a>.
            </section>
            <section>
                If you see data issues, please open a ticket&nbsp;
                <a href={"https://github.com/dhmit/evictions-dashboard/issues"}>on Github</a>.
            </section>
        </div>
    }
}
