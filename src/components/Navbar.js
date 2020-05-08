import React, { Component } from 'react'
import logo from '../images/logo_brown_red.svg'
import bramble from '../images/bramble_black.svg'
import { NavLink } from 'react-router-dom'

export default class Navbar extends Component {
    constructor(props) {
        super(props);
        // this.handleScroll = this.handleScroll.bind(this);
        this.state = {
            authenticated: props.authenticated,
            isPatient: props.isPatient,
            landingPage: props.landingPage,
            // scroll: false,
        }
    }

    // componentDidMount() {
    //     window.addEventListener('scroll', this.handleScroll);
    // }
    
    // componentWillUnmount() {
    //     window.removeEventListener('scroll', this.handleScroll);
    // }

    // handleScroll() {
    //     if (window.scrollY > 50) {
    //         if (!this.state.scroll) {
    //             this.setState({scroll: true});
    //         }
    //     } else {
    //         if (this.state.scroll) {
    //             this.setState({scroll: false});
    //         }
    //     }
    // }

     render() {
        if (this.state.landingPage) {
            return (
                <div className="nav">
                    <div className="nav-logo-container">
                        <img className="nav-logo" src={logo} alt="bramble logo"/>
                        <img className="nav-name" src={bramble} alt="bramble"/>
                    </div>
                    <div className="nav-links">
                        <a href="#patients">For patients</a>
                        <a href="#doctors">For doctors</a>
                        <NavLink className="nav-link" to="/login">Log in</NavLink>
                        <NavLink className="nav-button" to="/signup">Sign up</NavLink>
                    </div>
                </div>
            )
        }
        return (
            <div className="nav">
                <div className="nav-logo-container">
                    <img className="nav-logo" src={logo} alt="bramble logo"/>
                    <img className="nav-name" src={bramble} alt="bramble"/>
                </div>
                <div className="nav-links">
                    <NavLink className="nav-link" activeClassName="nav-link-underline" to={this.state.isPatient ? "/patient/doctors" : "/provider/patients"}>{this.state.isPatient ? "Doctors" : "Patients"}</NavLink>
                    <NavLink className="nav-link" activeClassName="nav-link-underline" to={this.state.isPatient ? "/patient/communication" : "/provider/communication"}>Communication</NavLink>
                    <NavLink className="nav-link" activeClassName="nav-link-underline" to={this.state.isPatient ? "/patient/appointments" : "/provider/appointments"}>{this.state.isPatient ? "Appointments" : "Schedule"}</NavLink>
                    {this.state.authenticated ? 
                        <NavLink className="nav-link" activeClassName="nav-link-underline" to={this.state.isPatient ? "/patient/account" : "/provider/account"}>Account</NavLink> :
                        <>
                            <NavLink className="nav-link" to={this.state.isPatient ? "/patient/login" : "/provider/login"}>Log in</NavLink>
                            <NavLink className="nav-button" to={this.state.isPatient ? "/patient/signup" : "/provider/signup"}>Sign up</NavLink>
                        </>
                        }
                </div>
            </div>
        )
    }
}
