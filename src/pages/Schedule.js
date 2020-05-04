import React, { Component } from 'react'
import { patientData, providerData } from '../data/data'
import Login from './Login'

export default class Schedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: true,
            isPatient: props.isPatient,
            id: "p00000001"
        }
    }

    render() {
        if (!this.state.authenticated) {
            return (
                <Login isPatient={this.props.isPatient}/>
            )
        }
        return (
            <div className="page">
                Hello from schedule!
            </div>
        )
    }
}
