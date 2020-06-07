import React, { Component, useState } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import {useDispatch} from 'react-redux';
import {useHistory, useLocation, Link} from 'react-router-dom'
import { useForm } from "react-hook-form";
import serverAddress from '../helpers.js'
import instance from '../helpers.js'

function SignupForm(props) {
    let submit = props.submit
    let [showPw, toggleShow] = useState(false)
    let [completed, markCompleted] = useState(false)
    let [error, toggleError] = useState()
    let [showAlert, toggleAlert] = useState(false)
    const { register, handleSubmit, errors } = useForm();

    const onSubmit = async (data) => {
        const {email, password, type} = data
        let person = { email, password, type }
        try {
            await instance({
                method: 'post',
                url: "/session/register",
                data: person
            });
            submit(type, "/onboarding/" + type)
        } catch (error) {
            if (error.response) {
                console.log(error.response.data.error);
                toggleError(error.response.data.error)
            } else {
                toggleError("We're having issues connecting right now")
            }
        }
    } 
    
    let passwordMatch = (value) => {
        if (document.getElementById("password").value === value) return true;
        return false;
    }

    return (
        <div className="page">
            <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                <input 
                    id="email" 
                    className={errors.email ? "login-input red" : "login-input"} 
                    type="text" 
                    name="email" 
                    placeholder="Email" 
                    ref={register({ required: true, pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ })}/>
                {errors.email && errors.email.type === "pattern" && <p className="login-text red-words">Please enter a valid email</p>}
                <div id="password-container">
                    <input 
                        id="password" 
                        className={errors.password ? "login-input login-input2 red" : "login-input login-input2"} 
                        type={showPw ? "text" : "password"} 
                        name="password" 
                        placeholder="Password" 
                        ref={register({ required: true, pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/ })}
                        onFocus={() => toggleAlert(true)}
                        onBlur={() => toggleAlert(false)}
                        />
                    {showPw ? <FiEyeOff className="login-icon" onClick={() => toggleShow(false)}/> : <FiEye className="login-icon" onClick={() => toggleShow(true)}/>}
                </div>
                <div className={showAlert || (errors.password && errors.password.type === "pattern") ? "full-height" : "zero-height"}>
                    <p className={errors.password && errors.password.type === "pattern" ? "login-text red-words" : "login-text"}>
                        Minimum eight characters. Must contain one uppercase, one lowercase, and one number.
                    </p>
                </div>
                <input 
                    id="passwordConfirm" 
                    className={errors.passwordConfirm ? "login-input red" : "login-input"} 
                    type="password" 
                    name="passwordConfirm" 
                    placeholder="Confirm your password" 
                    ref={register({ required: true, validate: passwordMatch })}/>
                {errors.passwordConfirm && errors.passwordConfirm.type === "validate" && <p className="login-text red-words">The passwords do not match</p>}
                <div className="login-type">
                    <label className={errors.type ? "login-text red-words login-option" : "login-text login-option"}><input className="login-dot" type="radio" name="type" value="patient" ref={register({ required: true})}/>Patient</label>
                    <label className={errors.type ? "login-text red-words login-option" : "login-text login-option"}><input className="login-dot" type="radio" name="type" value="provider" ref={register({ required: true})}/>Provider</label>
                </div>
                {error && <p className="login-text login-centered red-words">{error}</p>}
                <button className="login-button" type="submit">Sign up</button>
                <p id="switch-login" className="login-text login-centered">Already have an account? <Link to="/login">Log in</Link></p> 
            </form> 
        </div>
    )
}

function LoginForm(props) {
    let submit = props.submit 
    const { register, handleSubmit, errors } = useForm();
    let [showPw, toggleShow] = useState(false)
    let [error, toggleError] = useState()

    const onSubmit = async (data) => {
        try {
            let response = await instance({
                method: 'post',
                url: "/session/login",
                data: {
                    email: data.email, 
                    password: data.password 
                }
              });
            console.log("success")
            submit(response.data.type)
        } catch (error) {
            if (error.response) {
                toggleError(error.response.data.error)
            } else {
                toggleError("We're having issues connecting right now")
            }
        }
    } 
    
    return (
        <div className="page">
            <form className="login-form" onSubmit={handleSubmit(onSubmit)}>
                <input id="email" className={errors.email ? "login-input red" : "login-input"} type="email" name="email" placeholder="Email" ref={register({ required: true})}/>
                <div id="password-container">
                    <input id="password" className={errors.password ? "login-input login-input2 red" : "login-input login-input2"} type={showPw ? "text" : "password"} name="password" placeholder="Password" ref={register({ required: true})}/>
                    {showPw ? <FiEyeOff className="login-icon" onClick={() => toggleShow(false)}/> : <FiEye className="login-icon" onClick={() => toggleShow(true)}/>}
                </div>
                <Link className="login-text" to="/password-reset">Forgot password?</Link>
                {errors.email || errors.password ?
                <p className="login-text login-centered red-words">Please make sure all fields are filled out</p> :
                error ? 
                <p className="login-text login-centered red-words">{error}</p> :
                <div></div>
                }
                <button id="sign-in" type="submit" className="login-button">Log in</button>
                <p id="switch-login" className="login-text login-centered">Don't have an account? <Link to="/signup">Sign up</Link></p> 
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

    let login = (type) => {
        dispatch({type: "LOGIN", accountType: type}) 
        // history.replace({ pathname: "/onboarding/provider" })
        history.replace(from)
    }

    let register = (type, path) => {
        dispatch({type: "LOGIN", accountType: type}) 
        history.replace({ pathname: path })
    }
    
    if (type === "signup") {
        return (
            <SignupForm submit={register}/>
        )
    } else { 
        return (
            <LoginForm submit={login}/>
        )
    } 
}