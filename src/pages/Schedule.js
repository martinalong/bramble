import React, { Component } from 'react'
import { patientData, providerData } from '../data/data'
import Login from './Login'

export default class Schedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: props.info,
            accountType: props.accountType,
        }
    }

    render() {
        if (this.state.accountType === "patient") {
            return (
                <div className="page">
                    Hello from patient schedule!
                </div>
            )
        } 
        if (this.state.accountType === "provider") {
            return (
                <div className="page">
                    Hello from provider schedule!
                </div>
            )
        }
    }
}
