import React, { Component } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import {useDispatch} from 'react-redux';
import {useHistory, useLocation, Link} from 'react-router-dom'

class LoginForm extends Component {
    constructor(props) {
        super(props)
        this.toggleShowPw = this.toggleShowPw.bind(this)
        this.login = props.login
        this.state = {
            isPatient: props.isPatient,
            showPw: false,
        }
    }

    toggleShowPw() {
        this.setState({showPw: !this.state.showPw});
    }

    render() {
        return (
            <div className="page">
                <form className="login-form">
                    <input className="login-input" type="email" name="email" placeholder="Email" required/>
                    <input className="login-input" type={this.state.showPw ? "text" : "password"} name="password" placeholder="Password" required/>
                    {this.state.showPw ? <FiEyeOff className="login-icon" onClick={this.toggleShowPw}/> : <FiEye className="login-icon" onClick={this.toggleShowPw}/>}
                    <Link className="login-text login-subscript" to={this.state.isPatient? "/patient/password-reset" : "/provider/password-reset"}>Forgot password?</Link>
                    <button className="login-button" onClick={this.login}>
                        Sign in
                    </button>
                    <p className="login-text login-centered">Don't have an account? <Link to={this.state.isPatient? "/patient/signup" : "/provider/signup"}>Sign up</Link></p>
                </form>
            </div>
        )
    }
}


export default function Login(props) {
    let isPatient = props.isPatient
    let authenticated = props.authenticated

    let history = useHistory();
    let location = useLocation();
    const dispatch = useDispatch();
    let logoutType = (isPatient ? "PATIENT_LOGOUT" : "DOC_LOGOUT")
    let loginType = (isPatient ? "PATIENT_LOGIN" : "DOC_LOGIN")

    let { from } = location.state || { from: { pathname: "/" } }

    let login = () => {
        dispatch({type: loginType, id: "p294817981"})
        history.replace(from)
    };
    
    let logout = () => {
        dispatch({type: logoutType})
    }
    
    if (authenticated) {
        return (
            <div className="page">
                <p>You are currently logged in. Would you like to log out?</p>
                <button className="login-button" onClick={logout}>
                    Sign out
                </button>
            </div>
        )
    } 
    /* to do: vary the form action depending on if it's patient or provider login */
    return (
        <LoginForm isPatient={isPatient} login={login}/>
    )
}