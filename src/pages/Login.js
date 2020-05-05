import React, { Component } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import {useDispatch} from 'react-redux';
import {useHistory, useLocation} from 'react-router-dom'

function LoginComponent() {
    let history = useHistory();
    let location = useLocation();
    const dispatch = useDispatch();

    let { from } = location.state || { from: { pathname: "/" } };
    let login = () => {
        dispatch({type: "LOGIN", id: "p294817981"})
        history.replace(from);
    };
	
	return (
		<button className="login-button" onClick={login}>
			Sign in
		</button>
	)
}

function LogoutComponent({isPatient}) {
    let history = useHistory();
    const dispatch = useDispatch();
    
    let logout = () => {
        dispatch({type: "LOGOUT"})
        isPatient ? history.push("/patient") : history.push("/provider")
    }

	return (
		<button className="login-button" onClick={logout}>
			Sign out
		</button>
	)
}

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.toggleHasAccount = this.toggleHasAccount.bind(this);
        let isPatient = true;
        if (props.authenticated) {
            isPatient = (props.authenticated.charAt(0) == "p")
        }
        this.state = {
            authenticated: props.authenticated,
            isPatient: isPatient,
            showPw: false,
            hasAccount: true,//props.hasAccount,
        }
    }

    toggleHasAccount() {
        this.setState({hasAccount: !this.state.hasAccount});
    }

    toggleShowPw() {
        this.setState({showPw: !this.state.showPw});
    }

    render() {
        if (this.state.authenticated) {
            return (
                <div className="page">
                    <p>You are currently logged in. Would you like to log out?</p>
                    <LogoutComponent isPatient={this.state.isPatient}/>
                </div>
            )
        }
        if (this.state.hasAccount) {
            return (
                <div className="page">
                    <form className="login-form">
                        <input className="login-input" type="text" name="email" placeholder="Email"/>
                        <input className="login-input" type="password" name="password" placeholder="Password"/>
                        {this.state.showPw ? <FiEyeOff className="login-icon"/> : <FiEye className="login-icon"/>}
                        <p>Forgot password?</p>
                        <LoginComponent/>
                        <p>Don't have an account? <span onClick={this.toggleHasAccount}>Sign up</span></p>
                    </form>
                </div>
            )
        } else {
            return (
                <div className="page">
                    <form>
                        <p>Already have an account? <span onClick={this.toggleHasAccount}>Sign in</span></p>
                        <input className="login-input" type="text" name="email" placeholder="Email"/>
                        <input className="login-input" type={this.state.showPw ? "text" : "password"} name="password" placeholder="Password"/>
                        {this.state.showPw ? <FiEyeOff className="login-icon" onClick={this.toggleShowPw}/> : <FiEye className="login-icon" onClick={this.toggleShowPw}/>}
                        <input className="login-input" type="password" name="password" placeholder="Confirm Password"/>
                        <button className="login-button" type="submit">Sign up</button>
                    </form>
                </div>
            )
        }
    }
}
