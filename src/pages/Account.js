import React, { Component } from 'react'
import Login from './Login'

export default class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: true,
            isPatient: props.isPatient,
        }
    }

    render() {
        if (!this.state.authenticated) {
            return (
                <Login isPatient={this.state.isPatient}/>
            )
        }
        return (
            <div className="page">
                Hello from Account!
            </div>
        )
    }
}
