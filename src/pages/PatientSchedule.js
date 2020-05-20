import React, { Component } from 'react'

export default class Schedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: props.info,
        }
    }

    render() {
        if (this.state.info.accountType === "patient") {
            return (
                <div className="page">
                    Hello from patient schedule!
                </div>
            )
        } 
    }
}