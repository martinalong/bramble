import React, { Component } from 'react'
import logo from '../images/logo_brown_red.svg'
import bramble from '../images/bramble_black.svg'
import { NavLink } from 'react-router-dom'

export default class Navbar extends Component {
    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
        this.state = {
            authenticated: false,
            isPatient: props.isPatient,
            scroll: false,
        }
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }
    
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll() {
        if (window.scrollY > 50) {
            if (!this.state.scroll) {
                this.setState({scroll: true});
            }
        } else {
            if (this.state.scroll) {
                this.setState({scroll: false});
            }
        }
    }

    render() {
        return (
            <div className={this.state.scroll ? "nav-scroll" : "nav-top"}>
                <div className={this.state.scroll ? "nav-scroll-logo-container" : "nav-top-logo-container"}>
                    <img className={this.state.scroll ? "nav-scroll-logo" : "nav-top-logo"} src={logo} alt="bramble logo"/>
                    <img className={this.state.scroll ? "nav-scroll-name" : "nav-top-name"} src={bramble} alt="bramble"/>
                </div>
                <div className={this.state.scroll ? "nav-links nav-scroll-links" : "nav-links nav-top-links"}>
                    <NavLink className="nav-link" activeClassName="nav-link-underline" to={this.state.isPatient ? "/patient/doctors" : "/provider/patients"}>{this.state.isPatient ? "Doctors" : "Patients"}</NavLink>
                    <NavLink className="nav-link" activeClassName="nav-link-underline" to={this.state.isPatient ? "/patient/communication" : "/provider/communication"}>Communication</NavLink>
                    <NavLink className="nav-link" activeClassName="nav-link-underline" to={this.state.isPatient ? "/patient/appointments" : "/provider/appointments"}>{this.state.isPatient ? "Appointments" : "Schedule"}</NavLink>
                    <NavLink className={this.state.authenticated ? "nav-link" : "nav-button"} activeClassName="nav-link-underline" to={this.state.isPatient ? "/patient/account" : "/provider/account"}>{this.state.authenticated ? "Account" : "Log in"}</NavLink>
                </div>
            </div>
        )
    }

     render() {
        return (
            <div className={this.state.scroll ? "nav-scroll" : "nav-top"}>
                <div className={this.state.scroll ? "nav-scroll-logo-container" : "nav-top-logo-container"}>
                    <img className={this.state.scroll ? "nav-scroll-logo" : "nav-top-logo"} src={logo} alt="bramble logo"/>
                    <img className={this.state.scroll ? "nav-scroll-name" : "nav-top-name"} src={bramble} alt="bramble"/>
                </div>
                <div className={this.state.scroll ? "nav-links nav-scroll-links" : "nav-links nav-top-links"}>
                    <NavLink className="nav-link" activeClassName="nav-link-underline" to={this.state.isPatient ? "/patient/doctors" : "/provider/patients"}>{this.state.isPatient ? "Doctors" : "Patients"}</NavLink>
                    <NavLink className="nav-link" activeClassName="nav-link-underline" to={this.state.isPatient ? "/patient/communication" : "/provider/communication"}>Communication</NavLink>
                    <NavLink className="nav-link" activeClassName="nav-link-underline" to={this.state.isPatient ? "/patient/appointments" : "/provider/appointments"}>{this.state.isPatient ? "Appointments" : "Schedule"}</NavLink>
                    <NavLink className={this.state.authenticated ? "nav-link" : "nav-button"} activeClassName="nav-link-underline" to={this.state.isPatient ? "/patient/account" : "/provider/account"}>{this.state.authenticated ? "Account" : "Log in"}</NavLink>
                </div>
            </div>
        )
    }
}