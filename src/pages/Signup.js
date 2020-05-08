import React, { Component } from 'react'
import {useDispatch} from 'react-redux';
import { FiEye, FiEyeOff, FiCheck, FiMinus, FiPlus } from 'react-icons/fi'
import {useHistory, Link} from 'react-router-dom'

class SignupForm extends Component {
    constructor(props) {
        super(props)
        this.toggleShow = this.toggleShow.bind(this)
        this.signup = props.signup
        this.stepCompleted = this.stepCompleted.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)
        this.state = {
            isPatient: props.isPatient,
            showPw: false,
            secondInsurance: false,
            steps: [false, false, false],
            currStep: 1,
        }
    }

    handleKeyUp(e) {
        if (e.target.value.length === parseInt(e.target.attributes["maxLength"].value)) {
            if (e.target.attributes["name"].value === "month") {
                document.getElementById("day").focus()
            } else if (e.target.attributes["name"].value  === "day") {
                document.getElementById("year").focus()
            }
        }
    }

    toggleShow(item) {
        if (item === "pw") {
            this.setState({showPw: !this.state.showPw});
        } else if (item === "insurance") {
            this.setState({secondInsurance: !this.state.secondInsurance});
        }
    }


    stepCompleted(step) {
        let newSteps = this.state.steps
        newSteps[step - 1] = true
        this.setState({steps: newSteps})
    }

    changeStep(change) {
        console.log(this.state.currStep + change)
        this.setState({currStep: this.state.currStep + change})
    }

    render() {
        return (
            <div className="page">
                <div className="login-steps">
                    <div className="login-step">
                        {this.state.steps[0] ? <FiCheck className="login-step-number login-step-check"/> : <h2 className="login-step-number">1</h2>}
                        <p className="login-step-text">Account info</p>
                    </div>
                    <div className="login-step">
                        {this.state.steps[1] ? <FiCheck className="login-step-number login-step-check"/> : <h2 className="login-step-number">2</h2>}
                        <p className="login-step-text">Personal info</p>
                    </div>
                    <div className="login-step">
                        {this.state.steps[2] ? <FiCheck className="login-step-number login-step-check"/> : <h2 className="login-step-number">3</h2>}
                        <p className="login-step-text">Insurance info</p>
                    </div>
                </div>
                <form className="login-form signup-form"> 
                    <div className={this.state.currStep === 1 ? "part-one" : "part-one hide"}>
                        <p>Already have an account? <Link to={this.state.isPatient? "/patient/login" : "/provider/login"}>Log in</Link></p>
                        <input className="login-input" type="email" name="email" placeholder="Email" required/>
                        <input className="login-input" type={this.state.showPw ? "text" : "password"} name="password" placeholder="Choose a password" required/>
                        {this.state.showPw ? <FiEyeOff className="login-icon" onClick={() => this.toggleShow("pw")}/> : <FiEye className="login-icon" onClick={() => this.toggleShow("pw")}/>}
                        <input className="login-input login-confirm-pw" type="password" name="password_confirm" placeholder="Confirm your password" required/>
                    </div> 
                    <div className={this.state.currStep === 2 ? "part-two" : "part-two hide"}>
                        <input className="login-input" type="text" name="firstName" placeholder="First name" required/>
                        <input className="login-input" type="text" name="lastName" placeholder="Middle name (optional)"/>
                        <input className="login-input" type="text" name="lastName" placeholder="Last name" required/>
                        <div className="two-col">
                            <div id="dob"> 
                                <input className="login-input" id="month" type="text" name="month" placeholder="MM" maxLength="2" onChange={this.handleKeyUp} required/>
                                <input className="login-input" id="day" type="text" name="day" placeholder="DD" maxLength="2" onChange={this.handleKeyUp} required/>
                                <input className="login-input" id="year" type="text" name="year" placeholder="YYYY" maxLength="4" onChange={this.handleKeyUp} required/>
                                <p className="login-text signup-subscript">Date of Birth</p>
                            </div>
                            <div id="gender">
                                <select className="login-dropdown" name="sex" required>
                                    <option className="login-hide" disabled selected value>Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>   
                                <div className="line"/>
                                <p className="login-text signup-subscript2"></p>
                            </div>
                        </div>
                        <div className="shift-up">
                            <input id="phoneNumber" className="login-input" type="text" name="phoneNumber" placeholder="Phone number" maxLength="10" required/>
                            <input className="login-input" type="text" name="address" placeholder="Address" required/>
                            <input className="login-input" type="text" name="address2" placeholder="Address line 2 (optional)"/>
                            <input className="login-input" type="text" name="city" placeholder="City" required/>
                            <div className="two-col"> 
                                <div id="state">
                                    <select className="login-dropdown" name="state" required>
                                        <option className="login-hide" disabled selected value>State</option>
                                        <option value="Alabama">Alabama</option>
                                        <option value="Alaska">Alaska</option>
                                        <option value="Arizona">Arizona</option>
                                        <option value="Arkansas">Arkansas</option>
                                        <option value="California">California</option>
                                        <option value="Colorado">Colorado</option>
                                        <option value="Connecticut">Connecticut</option>
                                        <option value="Delaware">Delaware</option>
                                        <option value="District of Columbia">District of Columbia</option>
                                        <option value="Florida">Florida</option>
                                        <option value="Georgia">Georgia</option>
                                        <option value="Hawaii">Hawaii</option>
                                        <option value="Idaho">Idaho</option>
                                        <option value="Illinois">Illinois</option>
                                        <option value="Indiana">Indiana</option>
                                        <option value="Iowa">Iowa</option>
                                        <option value="Kansas">Kansas</option>
                                        <option value="Kentucky">Kentucky</option>
                                        <option value="Louisiana">Louisiana</option>
                                        <option value="Maine">Maine</option>
                                        <option value="Maryland">Maryland</option>
                                        <option value="Massachusetts">Massachusetts</option>
                                        <option value="Michigan">Michigan</option>
                                        <option value="Minnesota">Minnesota</option>
                                        <option value="Mississippi">Mississippi</option>
                                        <option value="Missouri">Missouri</option>
                                        <option value="Montana">Montana</option>
                                        <option value="Nebraska">Nebraska</option>
                                        <option value="Nevada">Nevada</option>
                                        <option value="New Hampshire">New Hampshire</option>
                                        <option value="New Jersey">New Jersey</option>
                                        <option value="New Mexico">New Mexico</option>
                                        <option value="New York">New York</option>
                                        <option value="North Carolina">North Carolina</option>
                                        <option value="North Dakota">North Dakota</option>
                                        <option value="Ohio">Ohio</option>
                                        <option value="Oklahoma">Oklahoma</option>
                                        <option value="Oregon">Oregon</option>
                                        <option value="Pennsylvania">Pennsylvania</option>
                                        <option value="Puerto Rico">Puerto Rico</option>
                                        <option value="Rhode Island">Rhode Island</option>
                                        <option value="South Carolina">South Carolina</option>
                                        <option value="South Dakota">South Dakota</option>
                                        <option value="Tennessee">Tennessee</option>
                                        <option value="Texas">Texas</option>
                                        <option value="Utah">Utah</option>
                                        <option value="Vermont">Vermont</option>
                                        <option value="Virginia">Virginia</option>
                                        <option value="Washington">Washington</option>
                                        <option value="West Virginia">West Virginia</option>
                                        <option value="Wisconsin">Wisconsin</option>
                                        <option value="Wyoming">Wyoming</option>
                                    </select>   
                                    <div className="line"/>
                                </div>
                                <input id="zip" className="login-input" type="text" name="zip" placeholder="ZIP code" maxLength="5" required/>
                            </div>
                        </div>
                    </div> 
                    <div className={this.state.currStep === 3 ? "part-three" : "part-three hide"}>
                        <div>
                            <p className="login-text login-header">Primary insurance</p>
                            <input className="login-input" type="text" name="insurance" placeholder="Primary insurance provider" required/>
                            <input className="login-input" type="text" name="policy" placeholder="Policy number"/>
                            <input className="login-input" type="text" name="group" placeholder="Group number" required/>
                            <p id="subscriber-info" className="login-text">Subscriber Information</p>
                            <input className="login-input" type="text" name="subscriberFirstName" placeholder="First name" required/>
                            <input className="login-input" type="text" name="subscriberLastName" placeholder="Last name" required/>
                            <div className="two-col">
                                <div id="dob"> 
                                    <input className="login-input" id="month" type="text" name="month" placeholder="MM" maxLength="2" onChange={this.handleKeyUp} required/>
                                    <input className="login-input" id="day" type="text" name="day" placeholder="DD" maxLength="2" onChange={this.handleKeyUp} required/>
                                    <input className="login-input" id="year" type="text" name="year" placeholder="YYYY" maxLength="4" onChange={this.handleKeyUp} required/>
                                    <p className="login-text signup-subscript">Date of Birth</p>
                                </div>
                                <input id="ssn" className="login-input" type="text" name="subscriberName" placeholder="Social security number" maxLength="9"/>
                            </div>
                        </div>
                        <span className="login-expand" onClick={() => this.toggleShow("insurance")}>
                            {this.state.secondInsurance ? <FiMinus id="login-plus"/> : <FiPlus id="login-plus"/>}
                            <p id="add-insurance">Add another insurance</p>
                        </span>
                        <div className={this.state.secondInsurance ? "full-height" : "zero-height"}>
                            <p className="login-text login-header">Secondary insurance</p>
                            <input className="login-input" type="text" name="insurance" placeholder="Secondary insurance provider"/>
                            <input className="login-input" type="text" name="policy" placeholder="Policy number"/>
                            <input className="login-input" type="text" name="group" placeholder="Group number"/>
                            <p id="subscriber-info" className="login-text">Subscriber Information</p>
                            <input className="login-input" type="text" name="subscriberFirstName" placeholder="First name"/>
                            <input className="login-input" type="text" name="subscriberLastName" placeholder="Last name"/>
                            <div className="two-col">
                                <div id="dob"> 
                                    <input className="login-input" id="month" type="text" name="month" placeholder="MM" maxLength="2" onChange={this.handleKeyUp}/>
                                    <input className="login-input" id="day" type="text" name="day" placeholder="DD" maxLength="2" onChange={this.handleKeyUp}/>
                                    <input className="login-input" id="year" type="text" name="year" placeholder="YYYY" maxLength="4" onChange={this.handleKeyUp}/>
                                    <p className="login-text signup-subscript">Date of Birth</p>
                                </div>
                                <input id="ssn" className="login-input" type="text" name="subscriberName" placeholder="Social security number" maxLength="9"/>
                            </div>
                        </div>
                    </div>
                    {this.state.currStep === 3 ?
                    <button className="login-button" type="submit">Submit</button> :
                    <button className="login-button" onClick={() => this.changeStep(1)}>Next Step</button>}
                    {this.state.currStep === 1 ?
                    <div></div> :
                    <p className="login-text login-back" onClick={() => this.changeStep(-1)}>Go Back</p>}
                </form>
            </div>
        )
    }
}


export default function Signup(props) {
    let isPatient = props.isPatient
    let history = useHistory();
    let authenticated = props.authenticated
    const dispatch = useDispatch();
    let loginType = (isPatient ? "PATIENT_LOGIN" : "DOC_LOGIN")
    let logoutType = (isPatient ? "PATIENT_LOGOUT" : "DOC_LOGOUT")

    let signup = () => {
        //create the account, then login to it
        dispatch({type: loginType, id: "p294817982"})
        isPatient? history.push("/patient") : history.push("/provider")
    };
    
    let logout = () => {
        dispatch({type: logoutType})
    }
    
    if (authenticated) {
        return (
            <div className="page">
                <p>You are currently logged in. Would you like to log out?</p>
                <button className="login-button" onClick={logout}>Sign out</button>
            </div>
        )
    } 
    return (
        <SignupForm isPatient={isPatient} signup={signup}/>
    )
}
