import React, { Component } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import {useDispatch} from 'react-redux';
import {useHistory, useLocation, Link} from 'react-router-dom'
import { Stitch, 
    RemoteMongoClient, 
    BSON, 
    UserPasswordAuthProviderClient, 
    UserPasswordCredential 
} from "mongodb-stitch-browser-sdk";
import { patientCollection } from '../App.js'

class SignupForm extends Component {
    constructor(props) {
        super(props)
        this.toggleShowPw = this.toggleShowPw.bind(this)
        this.handleCheck = this.handleCheck.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.catchError = this.catchError.bind(this)
        this.state = {
            showPw: false,
            emailValid: true,
            pwValid: true,
            pwMatch: true,
            alert: [false, false, false],
            error: false,
            completed: false,
        }
    }

    toggleShowPw() {
        this.setState({showPw: !this.state.showPw});
    }

    handleCheck(e) {
        let emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        //Minimum eight characters, at least one uppercase letter, one lowercase letter and one number. The symbols @$!%*?& are allowed
        let red = "#ec6b66";
        let blue = "#424e88";
        let id = e.target.attributes["id"].value
        let value = e.target.value
        
        if (id === "password") {
            if (!passwordRegex.test(value)) {
                this.setState({pwValid: false})
                document.getElementById(id).style.borderColor = red;
            } else {
                this.setState({pwValid: true})
                document.getElementById(id).style.borderColor = blue;
            }
        } else if (id === "passwordConfirm") {
            if (document.getElementById("password").value !== value) {
                this.setState({pwMatch: false})
                document.getElementById(id).style.borderColor = red;
            } else {
                this.setState({pwMatch: true})
                document.getElementById(id).style.borderColor = blue;
            }
        } else if (id === "email") {
            if (!emailRegex.test(value)) {
                this.setState({emailValid: false})
                document.getElementById(id).style.borderColor = red;
            } else {
                this.setState({emailValid: true})
                document.getElementById(id).style.borderColor = blue;
            }
        }
    }

    handleSubmit() {
        if (this.state.emailValid && this.state.pwValid && this.state.pwMatch) {
            let email = document.getElementById("email").value
            let password = document.getElementById("password").value
            const emailPasswordClient = Stitch.defaultAppClient.auth
            .getProviderClient(UserPasswordAuthProviderClient.factory);

            emailPasswordClient.registerWithEmail(email, password)
            .then(() => this.setState({completed: true}))
            .catch(err => this.catchError(err));
        } else {
            this.setState({error: "Please make sure all fields are filled out correctly"})
        }
    }

    catchError(err) {
        if (err.errorCode === 46) {
            this.setState({error: "It looks like that email is already in use"})
        } 
    }

    render() {
        if (this.state.completed) {
            return (
                <div className="login-form page">
                   <p className="login-text">
                        Signup successful! Please check your email for a confirmation link to finish signing up.
                        <Link to="/onboarding">Temp Link</Link>
                   </p> 
                </div>
            )
        }
        return (
            <div className="page">
                <form className="login-form">
                    <input id="email" className="login-input" type="email" name="email" placeholder="Email" onBlur={this.handleCheck} required/>
                    <input 
                        id="password" 
                        className="login-input" 
                        type={this.state.showPw ? "text" : "password"} 
                        pattern="/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/" 
                        title="Minimum eight characters. At least one uppercase letter, one lowercase letter, and one number. The symbols @$!%*?& are allowed" 
                        name="password" 
                        placeholder="Password" 
                        onBlur={this.handleCheck} 
                        required/>
                    {this.state.showPw ? <FiEyeOff className="login-icon" onClick={() => this.toggleShowPw("pw")}/> : <FiEye className="login-icon" onClick={() => this.toggleShowPw("pw")}/>}
                    <input id="passwordConfirm" className="login-input login-confirm-pw" type="password" name="passwordConfirm" placeholder="Confirm your password" onBlur={this.handleCheck} required/>
                    {this.state.error ? 
                    <p className="login-text login-red">{this.state.error}</p> :
                    <div></div>
                    }
                    <button className="login-button" type="button" onClick={this.handleSubmit}>Submit</button>
                    <p className="login-text login-centered">Already have an account? <Link to="/login">Log in</Link></p> 
                </form> 
            </div>
        )
    }
}

class LoginForm extends Component {
    constructor(props) {
        super(props)
        this.submit = props.submit 
        this.toggleShowPw = this.toggleShowPw.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.catchError = this.catchError.bind(this)
        this.state = {
            showPw: false,
            error: false,
        }
    }

    toggleShowPw() {
        this.setState({showPw: !this.state.showPw});
    }

    handleSubmit() {
        let email = document.getElementById("email").value
        let password = document.getElementById("password").value
        if (email && password) {
            const app = Stitch.defaultAppClient
            const credential = new UserPasswordCredential(email, password)
            app.auth.loginWithCredential(credential)
            .then((authedUser) => {
                this.submit(authedUser.id)
            })
            .catch(err => this.catchError(err))
        } else {
            this.setState({error: "Please make sure all fields are filled out"})
        }
    }

    catchError(err) {
        console.log(err)
        if (err.errorCode === 46) {
            this.setState({error: "The email and password provided don't match our records"})
        } 
    }

    render() {
        return (
            <div className="page">
                <form className="login-form">
                    <input id="email" className="login-input" type="email" name="email" placeholder="Email" required/>
                    <input id="password" className="login-input" type={this.state.showPw ? "text" : "password"} name="password" placeholder="Password" required/>
                    {this.state.showPw ? <FiEyeOff className="login-icon" onClick={this.toggleShowPw}/> : <FiEye className="login-icon" onClick={this.toggleShowPw}/>}
                    <Link className="login-text login-subscript" to={this.state.isPatient? "/patient/password-reset" : "/provider/password-reset"}>Forgot password?</Link>
                    {this.state.error ? 
                    <p className="login-text login-red">{this.state.error}</p> :
                    <div></div>
                    }
                    <button type="button" className="login-button" onClick={this.handleSubmit}>Sign in</button>
                    <p className="login-text login-centered">Don't have an account? <Link to="/signup">Sign up</Link></p> 
                </form>
            </div>
        )
    }
}


export default function Login(props) {
    let type = props.type
    let auth = props.auth //id if logged in, false if not
    let history = useHistory();
    let location = useLocation();
    const dispatch = useDispatch();

    let logout = () => {
        dispatch({type: "LOGOUT"})
    }

    if (auth) {
        return (
            <div className="page login-form">
                <p>You are currently logged in. Would you like to log out?</p>
                <button className="login-button" onClick={logout}>
                    Sign out
                </button>
            </div>
        )
    }

    let { from } = location.state || { from: { pathname: "/dashboard" } } 
    if (type === "first-login") {
        from = { pathname: "/onboarding" }
    } 

    let login = (auth) => {
        (patientCollection.findOne({"user_id": auth}))
        .then(info => {
            console.log("[MongoDB Stitch] Connected to Stitch. Logged in")
            dispatch({type: "LOGIN", auth: auth, info: info})
        })
        history.replace(from)
    }
    
    if (type === "signup") {
        return (
            <SignupForm/>
        )
    } else { 
        return (
            <LoginForm submit={login}/>
        )
    } 
}