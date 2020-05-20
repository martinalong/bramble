import React, { Component, useState } from 'react'
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
import { useForm } from "react-hook-form";

function SignupForm(props) {
    let [showPw, toggleShow] = useState(false)
    let [completed, markCompleted] = useState(false)
    let [error, toggleError] = useState()
    let [showAlert, toggleAlert] = useState(false)
    const { register, handleSubmit, errors } = useForm();
    const onSubmit = (data) => {
        let email = data.email
        let password = data.password
        const emailPasswordClient = Stitch.defaultAppClient.auth
        .getProviderClient(UserPasswordAuthProviderClient.factory);

        emailPasswordClient.registerWithEmail(email, password)
        .then(() => markCompleted(true))
        .catch((err) => {
            if (err.errorCode === 46) {
                toggleError("It looks like that email is already in use")
            }
        });
    } 
    
    let passwordMatch = (value) => {
        if (document.getElementById("password").value === value) return true;
        return false;
    }

    if (completed) {
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
            <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                <input 
                    id="email" 
                    className={errors.email ? "login-input red" : "login-input"} 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    ref={register({ required: true, pattern: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/ })}/>
                {errors.email && errors.email.type === "pattern" && <p className="login-text red-words">Please enter a valid email</p>}
                <input 
                    id="password" 
                    className={errors.password ? "login-input red" : "login-input"} 
                    type={showPw ? "text" : "password"} 
                    name="password" 
                    placeholder="Password" 
                    ref={register({ required: true, pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/ })}
                    onFocus={() => toggleAlert(true)}
                    onBlur={() => toggleAlert(false)}
                    />
                {showPw ? <FiEyeOff className="login-icon" onClick={() => toggleShow(false)}/> : <FiEye className="login-icon" onClick={() => toggleShow(true)}/>}
                <div className={showAlert || (errors.password && errors.password.type === "pattern") ? "full-height" : "zero-height"}>
                    <p className={errors.password && errors.password.type === "pattern" ? "login-subscript red-words" : "login-subscript"}>
                        <div>• Minimum eight characters</div>
                        <div>• Must contain one uppercase, one lowercase, and one number</div>
                    </p>
                </div>
                <input 
                    id="passwordConfirm" 
                    className={errors.passwordConfirm && errors.passwordConfirm.type === "required" ? "login-input login-confirm-pw red" : "login-input login-confirm-pw"} 
                    type="password" 
                    name="passwordConfirm" 
                    placeholder="Confirm your password" 
                    ref={register({ required: true, validate: passwordMatch })}/>
                {errors.passwordConfirm && errors.passwordConfirm.type === "validate" && <p className="login-text red-words">The passwords do not match</p>}
                {error && <p className="login-text red-words">{error}</p>}
                <button className="login-button" type="submit">Sign up</button>
                <p className="login-text login-centered">Already have an account? <Link to="/login">Log in</Link></p> 
            </form> 
        </div>
    )
}

function LoginForm(props) {
    let submit = props.submit 
    const { register, handleSubmit, errors } = useForm();
    const onSubmit = (data) => {
        let email = document.getElementById("email").value
        let password = document.getElementById("password").value
        const app = Stitch.defaultAppClient
        const credential = new UserPasswordCredential(email, password)
        app.auth.loginWithCredential(credential)
        .then((authedUser) => {
            submit(authedUser.id)
        })
        .catch(err => {
            console.log(err);
            toggleError("The email and password provided don't match our records");
        })
    } 
    let [showPw, toggleShow] = useState(false)
    let [error, toggleError] = useState()

    return (
        <div className="page">
            <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                <input id="email" className={errors.email ? "login-input red" : "login-input"} type="email" name="email" placeholder="Email" ref={register({ required: true})}/>
                <input id="password" className={errors.password ? "login-input red" : "login-input"} type={showPw ? "text" : "password"} name="password" placeholder="Password" ref={register({ required: true})}/>
                {showPw ? <FiEyeOff className="login-icon" onClick={() => toggleShow(false)}/> : <FiEye className="login-icon" onClick={() => toggleShow(true)}/>}
                <Link className="login-text login-subscript2" to="/password-reset">Forgot password?</Link>
                {errors.email || errors.password ?
                <p className="login-text red-words">Please make sure all fields are filled out</p> :
                error ? 
                <p className="login-text red-words">{error}</p> :
                <div></div>
                }
                <button type="submit" className="login-button">Sign in</button>
                <p className="login-text login-centered">Don't have an account? <Link to="/signup">Sign up</Link></p> 
            </form>
        </div>
    )
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