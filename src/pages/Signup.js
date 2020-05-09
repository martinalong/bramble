import React, { Component } from 'react'
import {useDispatch} from 'react-redux';
import { FiEye, FiEyeOff, FiCheck, FiMinus, FiPlus, FiAlertCircle } from 'react-icons/fi'
import {useHistory, Link} from 'react-router-dom'

class SignupForm extends Component {
    constructor(props) {
        super(props)
        this.toggleShow = this.toggleShow.bind(this)
        this.signup = props.signup
        this.stepCompleted = this.stepCompleted.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)
        this.handleCheck = this.handleCheck.bind(this)
        this.state = {
            isPatient: props.isPatient,
            showPw: false,
            firstInsurance: false,
            secondInsurance: false,
            steps: [false, false, false],
            currStep: 3,
            pwValid: true,
            pwMatch: true,
            isPrimarySub: false,
            isSecondarySub: false,
            sameAsPrimary: false,
            //completed: 15, //23 if primary insurance, 31 if secondary insurance
        }
    }

    handleKeyUp(e) {
        if (e.target.value.length === parseInt(e.target.attributes["maxLength"].value)) {
            let id = e.target.attributes["id"].value;
            if (id.includes("month")) {
                document.getElementById("day" + id.charAt(id.length - 1)).focus()
            } else if (id.includes("day")) {
                document.getElementById("year" + id.charAt(id.length - 1)).focus()
            }
        }
    }

    toggleShow(item) {
        if (item === "pw") {
            this.setState({showPw: !this.state.showPw});
        } else if (item === "secondary") {
            let secondary = document.getElementsByClassName("secondary")
            for (let i = 0; i < secondary.length; i++) {
                secondary[i].required = !secondary[i].required;
            }
            this.setState({secondInsurance: !this.state.secondInsurance});
        } else if (item === "primaryShow") {
            let primary = document.getElementsByClassName("primary")
            for (let i = 0; i < primary.length; i++) {
                primary[i].required = true;
            }
            this.setState({firstInsurance: true});
        } else if (item === "primaryHide") {
            let primary = document.getElementsByClassName("primary")
            for (let i = 0; i < primary.length; i++) {
                primary[i].required = false;
            }
            this.setState({firstInsurance: false});
        } else if (item === "primarySubscriberShow") {
            this.setState({isPrimarySub: true});
        } else if (item === "primarySubscriberHide") {
            this.setState({isPrimarySub: false});
        } else if (item === "secondarySubscriberShow") {
            this.setState({isSecondarySub: true});
        } else if (item === "secondarySubscriberHide") {
            this.setState({isSecondarySub: false});
        } else if (item === "sameAsPrimary") {
            this.setState({sameAsPrimary: true});
        }
    }

    handleCheck(e) {
        let id = e.target.attributes["id"].value
        if (e.target.type === "select-one") {
            if (e.target.selectedIndex > 0) {
                if (id === "stateVal") {
                    document.getElementById("line-state").style.borderColor = "#424e88";
                } else if (id === "sex") {
                    document.getElementById("line-gender").style.borderColor = "#424e88";
                }
            } else {
                if (id === "stateVal") {
                    document.getElementById("line-state").style.borderColor = "#ec6b66";
                } else if (id === "sex") {
                    document.getElementById("line-gender").style.borderColor = "#ec6b66";
                }
            }
            return
        }
        let value = e.target.value
        if (!value || value.length === 0) {
            document.getElementById(id).style.borderColor = "#ec6b66";
            return
        } else {
            document.getElementById(id).style.borderColor = "#424e88";
        }
        let regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/; 
        //Minimum eight characters, at least one uppercase letter, one lowercase letter and one number. The symbols @$!%*?& are allowed
        if (id === "password") {
            if (!regex.test(value)) {
                this.setState({pwValid: false})
                document.getElementById(id).style.borderColor = "#ec6b66";
            } else {
                document.getElementById(id).style.borderColor = "#424e88";
            }
        } else if (id === "passwordConfirm") {
            if (document.getElementById("password").value !== value) {
                this.setState({pwMatch: false})
                document.getElementById(id).style.borderColor = "#ec6b66";
            } else {
                document.getElementById(id).style.borderColor = "#424e88";
            }
        } 
    }

    stepCompleted(step) {
        let newSteps = this.state.steps
        newSteps[step - 1] = true
        this.setState({steps: newSteps})
    }

    changeStep(change) {
        //set it up to not progress unless filled out required
        // if (change === 1) {
        //     if (this.state.currStep === 1) {

        //     } else if (this.state.currStep === 2) {

        //     } else if (this.state.currStep === 3) {

        //     }
        // }
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
                        <input id="email" className="login-input" type="email" name="email" placeholder="Email" onBlur={this.handleCheck} required/>
                        <input 
                            id="password" 
                            className="login-input" 
                            type={this.state.showPw ? "text" : "password"} 
                            pattern="/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/" 
                            title="Minimum eight characters. At least one uppercase letter, one lowercase letter, and one number. The symbols @$!%*?& are allowed" 
                            name="password" 
                            placeholder="Choose a password" 
                            onBlur={this.handleCheck} 
                            required/>
                        {this.state.showPw ? <FiEyeOff className="login-icon" onClick={() => this.toggleShow("pw")}/> : <FiEye className="login-icon" onClick={() => this.toggleShow("pw")}/>}
                        <input id="passwordConfirm" className="login-input login-confirm-pw" type="password" name="passwordConfirm" placeholder="Confirm your password" onBlur={this.handleCheck} required/>
                    </div> 
                    <div className={this.state.currStep === 2 ? "part-two" : "part-two hide"}>
                        <input id="firstName" className="login-input" type="text" name="firstName" placeholder="First name" onBlur={this.handleCheck} required/>
                        <input className="login-input" type="text" name="lastName" placeholder="Middle name (optional)"/>
                        <input id="lastName" className="login-input" type="text" name="lastName" placeholder="Last name" onBlur={this.handleCheck} required/>
                        <div className="two-col">
                            <div id="dob"> 
                                <input className="login-input" id="month1" type="text" name="month" placeholder="MM" maxLength="2" onChange={this.handleKeyUp} onBlur={this.handleCheck} required/>
                                <input className="login-input" id="day1" type="text" name="day" placeholder="DD" maxLength="2" onChange={this.handleKeyUp} onBlur={this.handleCheck} required/>
                                <input className="login-input" id="year1" type="text" name="year" placeholder="YYYY" maxLength="4" onChange={this.handleKeyUp} onBlur={this.handleCheck} required/>
                                <p className="login-text signup-subscript">Date of Birth</p>
                            </div>
                            <div id="gender">
                                <select id="sex" className="login-dropdown" name="sex" onBlur={this.handleCheck} onChange={this.handleCheck} required>
                                    <option className="login-hide" disabled selected value>Gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>   
                                <div className="line" id="line-gender"/>
                                <p className="login-text signup-subscript2"></p>
                            </div>
                        </div>
                        <div className="shift-up">
                            <input id="phoneNumber" className="login-input" type="text" name="phoneNumber" placeholder="Phone number" maxLength="10" onBlur={this.handleCheck} required/>
                            <input id="address" className="login-input" type="text" name="address" placeholder="Address" onBlur={this.handleCheck} required/>
                            <input className="login-input" type="text" name="address2" placeholder="Address line 2 (optional)"/>
                            <input id="city" className="login-input" type="text" name="city" placeholder="City" onBlur={this.handleCheck} required/>
                            <div className="two-col"> 
                                <div id="state">
                                    <select id="stateVal" className="login-dropdown" name="state" onBlur={this.handleCheck} onChange={this.handleCheck} required>
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
                                    <div className="line" id="line-state"/>
                                </div>
                                <input id="zip" className="login-input" type="text" name="zip" placeholder="ZIP code" maxLength="5" onBlur={this.handleCheck} required/>
                            </div>
                        </div>
                    </div> 
                    <div className={this.state.currStep === 3 ? "part-three" : "part-three hide"}>
                        <div>
                            <p className="login-text">Do you have insurance?</p>
                            <label className="login-text login-option"><input className="login-dot" type="radio" name="hasInsurance" onClick={() => this.toggleShow("primaryShow")} value="yes" required/>Yes</label>
                            <label className="login-text login-option"><input className="login-dot" type="radio" name="hasInsurance" onClick={() => this.toggleShow("primaryHide")} value="no" required/>No</label>
                        </div>
                        <div className={this.state.firstInsurance ? "full-height" : "zero-height"}>
                            <div>
                                <p className="login-text login-header">Primary insurance</p>
                                <input id="primaryInsurance" className="login-input primary" tabIndex={this.state.firstInsurance ? 0 : -1} type="text" name="insurance" placeholder="Primary insurance provider" onBlur={this.handleCheck}/>
                                <input id="primaryPolicy" className="login-input primary" tabIndex={this.state.firstInsurance ? 0 : -1} type="text" name="policy" placeholder="Policy number" onBlur={this.handleCheck}/>
                                <input id="primaryGroup" className="login-input primary" tabIndex={this.state.firstInsurance ? 0 : -1} type="text" name="group" placeholder="Group number" onBlur={this.handleCheck}/>
                                <p id="subscriber-info" className="login-text">Subscriber Information</p> 
                                <div className="login-checkbox">
                                    <FiCheck className="login-checkbox-check"/>
                                    <label className="login-text">
                                        <input className="login-dot" type="checkbox" name="isSubscriber1" onChange={() => this.toggleShow("primarySubscriberHide")} value="isPrimary"/>
                                        I'm the subscriber on this insurance
                                    </label>
                                </div>
                                <input id="primaryFirst" className="login-input primary" tabIndex={!this.state.isPrimarySub ? 0 : -1} tabIndex={this.state.firstInsurance ? 0 : -1} type="text" name="subscriberFirstName" onBlur={this.handleCheck} placeholder="First name"/>
                                <input id="primaryLast" className="login-input primary" tabIndex={this.state.firstInsurance ? 0 : -1} type="text" name="subscriberLastName" onBlur={this.handleCheck} placeholder="Last name"/>
                                <div className="two-col">
                                    <div id="dob"> 
                                        <input id="month2" className="login-input primary" tabIndex={this.state.firstInsurance ? 0 : -1} type="text" name="month" placeholder="MM" maxLength="2" onBlur={this.handleCheck} onChange={this.handleKeyUp}/>
                                        <input id="day2" className="login-input primary" tabIndex={this.state.firstInsurance ? 0 : -1} type="text" name="day" placeholder="DD" maxLength="2" onBlur={this.handleCheck} onChange={this.handleKeyUp}/>
                                        <input id="year2" className="login-input primary" tabIndex={this.state.firstInsurance ? 0 : -1} type="text" name="year" placeholder="YYYY" maxLength="4" onBlur={this.handleCheck} onChange={this.handleKeyUp}/>
                                        <p className="login-text signup-subscript">Date of Birth</p>
                                    </div>
                                    <input id="primarySSN" className="login-input ssn primary" tabIndex={this.state.firstInsurance ? 0 : -1} type="text" name="subscriberName" placeholder="Social security number" onBlur={this.handleCheck} maxLength="9"/>
                                </div>
                                <span className="login-expand" onClick={() => this.toggleShow("secondary")}>
                                    {this.state.secondInsurance ? <FiMinus id="login-plus"/> : <FiPlus id="login-plus"/>}
                                    <p id="add-insurance">Add another insurance</p>
                                </span>
                            </div>
                            <div className={this.state.secondInsurance ? "full-height" : "zero-height"}>
                                <p className="login-text login-header">Secondary insurance</p>
                                <input id="secondaryInsurance" className="login-input secondary" tabIndex={this.state.secondInsurance ? 0 : -1} type="text" name="insurance" onBlur={this.handleCheck} placeholder="Secondary insurance provider"/>
                                <input id="secondaryPolicy" className="login-input secondary" tabIndex={this.state.secondInsurance ? 0 : -1} type="text" name="policy" onBlur={this.handleCheck} placeholder="Policy number"/>
                                <input id="secondaryGroup" className="login-input secondary" tabIndex={this.state.secondInsurance ? 0 : -1} type="text" name="group" onBlur={this.handleCheck} placeholder="Group number"/>
                                <p id="subscriber-info" className="login-text">Subscriber Information</p>
                                <input id="secondaryFirst" className="login-input secondary" tabIndex={this.state.secondInsurance ? 0 : -1} type="text" name="subscriberFirstName" onBlur={this.handleCheck} placeholder="First name"/>
                                <input id="secondaryLast" className="login-input secondary" tabIndex={this.state.secondInsurance ? 0 : -1} type="text" name="subscriberLastName" onBlur={this.handleCheck} placeholder="Last name"/>
                                <div className="two-col">
                                    <div id="dob"> 
                                        <input id="month3" className="login-input secondary" tabIndex={this.state.secondInsurance ? 0 : -1} type="text" name="month" placeholder="MM" maxLength="2" onBlur={this.handleCheck} onChange={this.handleKeyUp}/>
                                        <input id="day3" className="login-input secondary" tabIndex={this.state.secondInsurance ? 0 : -1} type="text" name="day" placeholder="DD" maxLength="2" onBlur={this.handleCheck} onChange={this.handleKeyUp}/>
                                        <input id="year3" className="login-input secondary" tabIndex={this.state.secondInsurance ? 0 : -1} type="text" name="year" placeholder="YYYY" maxLength="4" onBlur={this.handleCheck} onChange={this.handleKeyUp}/>
                                        <p className="login-text signup-subscript">Date of Birth</p>
                                    </div>
                                    <input id="secondarySSN" className="login-input ssn secondary" tabIndex={this.state.secondInsurance ? 0 : -1} type="text" name="subscriberName" onBlur={this.handleCheck} placeholder="Social security number" maxLength="9"/>
                                </div>
                            </div>
                        </div>
                    </div>
                    {this.state.currStep === 3 ?
                    <button className="login-button" type="submit">Submit</button> :
                    <button className="login-button" type="button" onClick={() => this.changeStep(1)}>Next Step</button>}
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
