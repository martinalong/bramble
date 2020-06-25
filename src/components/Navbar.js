import React from 'react'
import logo from '../images/logo_brown_yellow.svg'
import bramble from '../images/bramble_black.svg'
import { NavLink } from 'react-router-dom'
import {useSelector} from 'react-redux';

export default function Navbar() {
    let accountType = useSelector(state => state.accountType)
    let login = useSelector(state => state.login)
    if (!accountType) {
        return (
            <div id="nav">
                <NavLink id="nav-logo-container" to="/">
                    <img className="nav-logo" src={logo} alt="bramble logo"/>
                    <img className="nav-name" src={bramble} alt="bramble"/>
                </NavLink>
                <div className="nav-links">
                    <a href="#patients" className="nav-link">For patients</a>
                    <a href="#doctors" className="nav-link">For doctors</a>
                    <NavLink className="nav-link" to="/login">Log in</NavLink>
                    <NavLink className="nav-button" to="/signup">Sign up</NavLink>
                </div>
            </div>
        )
    }
    return (
        <div id="nav">
            <NavLink id="nav-logo-container" to="/dashboard">
                <img className="nav-logo" src={logo} alt="bramble logo"/>
                <img className="nav-name" src={bramble} alt="bramble"/>
            </NavLink>
            <div className="nav-links">
                <NavLink className="nav-link" activeClassName="nav-link-underline" to={accountType === "patient" ? "/doctors" : "/patients"}>{accountType === "patient" ? "Doctors" : "Patients"}</NavLink>
                <NavLink className="nav-link" activeClassName="nav-link-underline" to="/communication">Communication</NavLink>
                <NavLink className="nav-link" activeClassName="nav-link-underline" to="/appointments">{accountType === "patient" ? "Appointments" : "Schedule"}</NavLink>
                {login ? 
                <NavLink className="nav-link" activeClassName="nav-link-underline" to="/account">Account</NavLink> 
                :
                <div>
                <NavLink className="nav-link" to="/login">Log in</NavLink>
                <NavLink className="nav-button" to="/signup">Sign up</NavLink>
                </div>
                }
            </div>
        </div>
    )
}