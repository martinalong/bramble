import React, { Component, useState } from 'react'
import { FiCheck, FiMinus, FiPlus, FiAlertCircle } from 'react-icons/fi'
import {useHistory, Link} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux';
import { patientCollection } from '../App.js'
import { useForm } from "react-hook-form";

class Insurance extends Component {
    constructor(props) {
        super(props)
        this.handleKeyUp = props.handleKeyUp.bind(this)
        this.handleCheck = props.handleCheck.bind(this)
        this.num = props.num
        this.toggleShow = props.toggleShow
    }

    render() {
        return (
            <div className="full-height">
                <div className="first-insurance">
                    <p className="login-text login-header">{this.num === 0 ? "Primary insurance" : this.num === 1 ? "Secondary insurance" : "Other insurance"}</p>
                    <input id={"insurance" + this.num} className="login-input required3" type="text" name="insuranceProvider" placeholder="Primary insurance provider" onBlur={this.handleCheck} required/>
                    <input id={"policy" + this.num} className="login-input required3" type="text" name="insurancePolicy" placeholder="Policy number" onBlur={this.handleCheck} required/>
                    <input id={"group" + this.num} className="login-input required3" type="text" name="insuranceGroup" placeholder="Group number" onBlur={this.handleCheck} required/>
                    <p id="subscriber-info" className="login-text">Subscriber Information</p> 
                    {/* <div className="login-checkbox">
                        <FiCheck className="login-checkbox-check"/>
                        <label className="login-text">
                            <input className="login-dot" type="checkbox" name="isSubscriber1" onChange={() => this.toggleShow("primarySubscriberHide")} value="isPrimary"/>
                            I'm the subscriber on this insurance
                        </label>
                    </div> */}
                    <input id={"subscriberFirstName" + this.num} className="login-input required3" type="text" name="insuranceFirstName" onBlur={this.handleCheck} placeholder="First name" required/>
                    <input id={"subscriberLastName" + this.num} className="login-input required3" type="text" name="insuranceLastName" onBlur={this.handleCheck} placeholder="Last name" required/>
                    <div className="two-col">
                        <div id="dob"> 
                            <input id={"month" + this.num} className="login-input month required3" type="text" name="insuranceMonth" placeholder="MM" maxLength="2" onBlur={this.handleCheck} onChange={this.handleKeyUp} required/>
                            <input id={"day" + this.num} className="login-input day required3" type="text" name="insuranceDay" placeholder="DD" maxLength="2" onBlur={this.handleCheck} onChange={this.handleKeyUp} required/>
                            <input id={"year" + this.num} className="login-input year required3" type="text" name="insuranceYear" placeholder="YYYY" maxLength="4" onBlur={this.handleCheck} onChange={this.handleKeyUp} required/>
                            <p className="login-text signup-subscript">Date of Birth</p>
                        </div>
                        <input id={"insuranceSSN" + this.num} className="login-input ssn" type="text" name="insuranceSSN" placeholder="Social security number" onBlur={this.handleCheck} maxLength="9"/>
                    </div>
                    {this.num > 0 ? 
                    <span className="login-expand" onClick={this.toggleShow}>
                        <FiMinus id="login-plus"/>
                        <p id="add-insurance">Delete this insurance</p>
                    </span> :
                    <div></div>
                    }
                </div>
            </div>
        )
    }   
}

function ProviderOnboarding(props) {
    this.submit = props.submit;
    this.id = props.id;

    const { register, handleSubmit, watch, errors } = useForm();
    const onSubmit = (data) => {
        console.log(data)
    } 
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input className={errors.firstName ? "login-input red" : "login-input"} type="text" name="firstName" placeholder="First name" ref={register({ required: true})}/>
            <input className={errors.lastName ? "login-input red" : "login-input"} type="text" name="lastName" placeholder="Last name"  ref={register({ required: true})}/>
            <div id="specialty">
                <select className="login-dropdown" name="specialty" defaultValue={"DEFAULT"}  ref={register({ required: true})}>
                    <option value="DEFAULT" className="login-hide" disabled>Specialty*</option>
                    <option value="Acupuncturist">Acupuncturist</option>
                    <option value="Allergist">Allergist</option>
                    <option value="Anesthesiologist">Anesthesiologist</option>
                    <option value="Audiologist">Audiologist</option>
                    <option value="Bariatric Physician">Bariatric Physician</option>
                    <option value="Cardiac Electrophysiologist">Cardiac Electrophysiologist</option>
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Cardiothoracic Surgeon">Cardiothoracic Surgeon</option>
                    <option value="Chiropractor">Chiropractor</option>
                    <option value="Colorectal Surgeon">Colorectal Surgeon</option>
                    <option value="Dentist">Dentist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Dietitian">Dietitian</option>
                    <option value="Ear, Nose & Throat Doctor">Ear, Nose & Throat Doctor</option>
                    <option value="Emergency Medicine Physician">Emergency Medicine Physician</option>
                    <option value="Endocrinologist">Endocrinologist</option>
                    <option value="Endodontist">Endodontist</option>
                    <option value="Family Physician">Family Physician</option>
                    <option value="Gastroenterologist">Gastroenterologist</option>
                    <option value="Geneticist">Geneticist</option>
                    <option value="Geriatrician">Geriatrician</option>
                    <option value="Hand Surgeon">Hand Surgeon</option>
                    <option value="Hematologist">Hematologist</option>
                    <option value="Immunologist">Immunologist</option>
                    <option value="Infectious Disease Specialist">Infectious Disease Specialist</option>
                    <option value="Integrative Health Medicine Specialist">Integrative Health Medicine Specialist</option>
                    <option value="Internist">Internist</option>
                    <option value="Medical Ethicist">Medical Ethicist</option>
                    <option value="Microbiologist">Microbiologist</option>
                    <option value="Midwife">Midwife</option>
                    <option value="Naturopathic Docto">Naturopathic Doctor</option>
                    <option value="Nephrologist">Nephrologist</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Neuropsychiatrist">Neuropsychiatrist</option>
                    <option value="Neurosurgeon">Neurosurgeon</option>
                    <option value="Nurse Practitioner">Nurse Practitioner</option>
                    <option value="Nutritionist">Nutritionist</option>
                    <option value="OB-GYN">OB-GYN</option>
                    <option value="Occupational Medicine Specialist">Occupational Medicine Specialist</option>
                    <option value="Oncologist">Oncologist</option>
                    <option value="Ophthalmologist">Ophthalmologist</option>
                    <option value="Optometrist">Optometrist</option>
                    <option value="Oral Surgeon">Oral Surgeon</option>
                    <option value="Orthodontist">Orthodontist</option>
                    <option value="Orthopedic Surgeon">Orthopedic Surgeon</option>
                    <option value="Pain Management Specialist">Pain Management Specialist</option>
                    <option value="Pathologist">Pathologist</option>
                    <option value="Pediatric Dentist">Pediatric Dentist</option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="Periodontist">Periodontist</option>
                    <option value="Physiatrist">Physiatrist</option>
                    <option value="Physical Therapist">Physical Therapist</option>
                    <option value="Physician Assistant">Physician Assistant</option>
                    <option value="Plastic Surgeon">Plastic Surgeon</option>
                    <option value="Podiatrist">Podiatrist</option>
                    <option value="Perventative Medicine Specialist">Perventative Medicine Specialist</option>
                    <option value="Primary Care Doctor">Primary Care Doctor</option>
                    <option value="Prosthodontist">Prosthodontist</option>
                    <option value="Psychiatrist">Psychiatrist</option>
                    <option value="Psychologist">Psychologist</option>
                    <option value="Psychosomatic Medicine Specialis">Psychosomatic Medicine Specialist</option>
                    <option value="Psychotherapist">Psychotherapist</option>
                    <option value="Pulmonologist">Pulmonologist</option>
                    <option value="Radiation Oncologist">Radiation Oncologist</option>
                    <option value="Radiologist">Radiologist</option>
                    <option value="Reproductive Endocrinologist">Reproductive Endocrinologist</option>
                    <option value="Rheumatologist">Rheumatologist</option>
                    <option value="Sleep Medicine Specialist">Sleep Medicine Specialist</option>
                    <option value="Sports Medicine Specialist">Sports Medicine Specialist</option>
                    <option value="Surgeon">Surgeon</option>
                    <option value="Surgical Oncologist">Surgical Oncologist</option>
                    <option value="Travel Medicine Specialist">Travel Medicine Specialist</option>
                    <option value="Urgent Care Specialist">Urgent Care Specialist</option>
                    <option value="Urological Surgeon">Urological Surgeon</option>
                    <option value="Urologist">Urologist</option>
                    <option value="Vascular Surgeon">Vascular Surgeon</option>
                </select>
                <div className={errors.specialty ? "line red" : "line"}/>
            </div>
            <input className={errors.yearsPracticing ? "login-input red" : "login-input"} type="number" name="yearsPracticing" placeholder="Years practicing" ref={register}/>
            <div>
                <select id="sex" className="login-dropdown" name="sex" defaultValue={"DEFAULT"} ref={register({ required: true})}>
                    <option value="DEFAULT" className="login-hide" disabled>Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>   
                <div className={errors.sex ? "line red" : "line"}/>
            </div>
            <div className="two-col">
                <input id="phoneNumber" className={errors.phoneNumber ? "login-input red" : "login-input"} type="text" name="phoneNumber" placeholder="Work phone number" maxLength="10" ref={register({ required: true})}/>
                <input id="phoneNumber" className="login-input" type="text" name="phoneNumber" placeholder="Extension (optional)" maxLength="10" ref={register}/>
            </div>
            <p className="login-text">Search for an existing practice on Bramble</p>
            <p className="login-text">Add a new practice to Bramble</p>
            <input id="practiceName" className={errors.practicename ? "login-input red" : "login-input"} type="text" name="practicename" placeholder="Practice Name" ref={register({ required: true})}/>
            <input id="practicePhoneNumber" className={errors.practicephoneNumber ? "login-input red" : "login-input"} type="text" name="practicephoneNumber" placeholder="Phone number" maxLength="10" ref={register({ required: true})}/>
            <input id="address" className={errors.practiceaddress ? "login-input red" : "login-input"} type="text" name="practiceaddress" placeholder="Address" ref={register({ required: true})}/>
            <input className="login-input" type="text" name="practiceaddress2" placeholder="Address line 2 (optional)" ref={register}/>
            <input id="city" className={errors.practicecity ? "login-input red" : "login-input"} type="text" name="practicecity" placeholder="City" ref={register({ required: true})}/>
            <div className="two-col"> 
                <div id="state">
                    <select id="stateVal" className="login-dropdown" name="practicestate" defaultValue={"DEFAULT"} ref={register({ required: true})}>
                        <option value="DEFAULT" className="login-hide" disabled>State</option>
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
                    <div className={errors.practicestate ? "line red" : "line"}/>
                </div>
                <input className={errors.practicezip ? "login-input red" : "login-input"} type="text" name="practicezip" placeholder="ZIP code" maxLength="5" ref={register({ required: true})}/>
            </div>
            <input className="login-button" type="submit">Submit</input>
        </form>
    )
}


class PatientOnboarding extends Component {
    constructor(props) {
        super(props);
        this.submit = props.submit;
        this.id = props.id;
        this.toggleShow = this.toggleShow.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)
        this.handleCheck = this.handleCheck.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.togglePatientStatus = this.togglePatientStatus.bind(this)
        this.state = {
            insurance: [false, false, false, false, false],
            num: 1,
            error: false,
        }
    }

    handleKeyUp(e) {
        if (e.target.value.length === parseInt(e.target.attributes["maxLength"].value)) {
            let id = e.target.attributes["id"].value;
            if (id.includes("month") || id.includes("day")) {
                document.getElementById(id).nextSibling.focus()
            }
        }
    }

    toggleShow(item) {
        let newInsurance = this.state.insurance
        let newNum = this.state.num
        if (item === "primaryShow") {
            newInsurance[0] = true
            // let insurances = document.getElementsByClassName("insurance")
            // for (let i = 0; i < insurances.length; i++) {
            //     insurances[i].required = true;
            // }
        } else if (item === "primaryHide") {
            newInsurance[0] = false
            // let primary = document.getElementsByClassName("primary")
            // for (let i = 0; i < primary.length; i++) {
            //     primary[i].required = false;
            // }
        } else {
            if (!newInsurance[item]) {
                newNum += 1
            }
            newInsurance[item] = !newInsurance[item]
        }
        this.setState({insurance: newInsurance, num: newNum});
    }

    // handleCheck(e) {
    //     let red = "#ec6b66";
    //     let blue = "#424e88";
    //     let id = e.target.attributes["id"].value
    //     if (e.target.type === "select-one") {
    //         if (e.target.selectedIndex > 0) {
    //             if (id === "stateVal") {
    //                 document.getElementById("line-state").style.borderColor = blue;
    //             } else if (id === "sex") {
    //                 document.getElementById("line-gender").style.borderColor = blue;
    //             } else if (id === "specialtyVal") {
    //                 document.getElementById("line-specialty").style.borderColor = blue;
    //             }
    //         } else {
    //             if (id === "stateVal") {
    //                 document.getElementById("line-state").style.borderColor = red;
    //             } else if (id === "sex") {
    //                 document.getElementById("line-gender").style.borderColor = red;
    //             } else if (id === "specialtyVal") {
    //                 document.getElementById("line-specialty").style.borderColor = red;
    //             }
    //         }
    //         return
    //     }
    //     let value = e.target.value
    //     if (!value || value.length === 0) {
    //         document.getElementById(id).style.borderColor = red;
    //         return
    //     } else {
    //         document.getElementById(id).style.borderColor = blue;
    //     }
    // }

    changeStep(change) {
        let unfilled = false
        if (change === 1) {
            let items = document.getElementsByClassName("required" + this.state.currStep)
            for (let item of items) {
                if (item.type === "select-one") {
                    if (item.selectedIndex === 0) {
                        unfilled = true
                    }
                } else if (item.type === "text") {
                    if (!item.value) {
                        unfilled = true 
                    }
                } 
            }
            if (this.state.currStep === 1) {
                let el = document.querySelector("div.required1 input[name='accountType']:checked")
                if (!el) {
                    unfilled = true
                }
            } else if (this.state.currStep === 3 && this.state.isPatient) {
                let el = document.querySelector("div.required3 input[name='insured']:checked")
                if (!el) {
                    unfilled = true
                }
            }
        }
        if (unfilled) {
            this.setState({error: "Please make sure all required fields are filled out"})
        } else {
            if (change === 1 && this.state.currStep === 3) {
                this.handleSubmit()
            } else {
                let newSteps = this.state.steps
                if (change === 1) {
                    newSteps[this.state.currStep - 1] = true
                }
                this.setState({
                    currStep: this.state.currStep + change, 
                    error: false,
                    steps: newSteps,
                })
            }
        }
    }

    handleSubmit() {
        //assert that date is a number
        const values = this.getFormObject()
        console.log(values)
        patientCollection.insertOne(values)
        .then(result => {
            console.log(`Successfully inserted item with _id: ${result.insertedId}`)
            this.submit()
        })
        .catch(err => {
            this.setState({error: "Looks like we're having a bit of trouble submitting your information right now"})
            console.log(err)
        })
    }

    togglePatientStatus(e) {
        if (e.target.value === "patient") {
            this.setState({isPatient: true})
        } else {
            this.setState({isPatient: false})
        }
    }

    getFormObject() {
        const formData = new FormData(document.forms['signup-form']);
        const values = {};
        for (let [key, value] of formData.entries()) {
            if (key.includes("insurance")) {
                if (! values[key]) {
                    values[key] = new Array();
                }
                values[key].push(value);
            } else {
                values[key] = value;
            }
        }
        if (this.state.isPatient) {
            values["dob"] = new Date(parseInt(values["year"]), parseInt(values["month"]) - 1, parseInt(values["day"]))
            delete values.year
            delete values.month
            delete values.day
            if (values.insuranceProvider) {
                values.insurance = []
                let plan;
                for (let i = 0; i < values.insuranceProvider.length; i++) {
                    plan = {}
                    plan.provider = values["insuranceProvider"][i]
                    plan.policy = values["insurancePolicy"][i]
                    plan.group = values["insuranceGroup"][i]
                    plan.firstName = values["insuranceFirstName"][i]
                    plan.lastName = values["insuranceLastName"][i]
                    plan.SSN = values["insuranceSSN"][i]
                    plan.dob = new Date(parseInt(values["insuranceYear"][i]), parseInt(values["insuranceMonth"][i]) - 1, parseInt(values["insuranceDay"][i]))
                    values.insurance.push(plan)
                }
                delete values.insuranceProvider
                delete values.insurancePolicy
                delete values.insuranceGroup
                delete values.insuranceFirstName
                delete values.insuranceLastName
                delete values.insuranceSSN
                delete values.insuranceYear
                delete values.insuranceMonth
                delete values.insuranceDay
            }
        }
        values.user_id = this.id
        values.appointments = []
        return values
    }

    render() {
        return (
            <div className="page">
                <form id="signup-form" className="login-form signup-form"> 
                    <div className={this.state.currStep === 1 ? "part-one required1" : "part-one hide required1"}>
                        <label className="login-text login-option"><input type="radio" className="login-dot" name="accountType" value="patient" onClick={this.togglePatientStatus}/>Patient</label>
                        <label className="login-text login-option"><input type="radio" className="login-dot" name="accountType" value="provider" onClick={this.togglePatientStatus}/>Provider</label>
                    </div> 
                    
                    <div className={this.state.currStep === 2 ? "part-two" : "part-two hide"}>
                        <input id="firstName" className="login-input required2" type="text" name="firstName" placeholder="First name*" onBlur={this.handleCheck} required/>
                        <input className="login-input" type="text" name="middleName" placeholder="Middle name (optional)"/>
                        <input id="lastName" className="login-input required2" type="text" name="lastName" placeholder="Last name*" onBlur={this.handleCheck} required/>
                        <div className="two-col">
                            <div id="dob"> 
                                <input className="login-input month required2" id="month" type="text" name="month" placeholder="MM" maxLength="2" onChange={this.handleKeyUp} onBlur={this.handleCheck} required/>
                                <input className="login-input day required2" id="day" type="text" name="day" placeholder="DD" maxLength="2" onChange={this.handleKeyUp} onBlur={this.handleCheck} required/>
                                <input className="login-input year required2" id="year" type="text" name="year" placeholder="YYYY" maxLength="4" onChange={this.handleKeyUp} onBlur={this.handleCheck} required/>
                                <p className="login-text signup-subscript">Date of Birth*</p>
                            </div>
                            <div id="gender">
                                <select id="sex" className="login-dropdown required2" name="sex" onBlur={this.handleCheck} onChange={this.handleCheck} defaultValue={"DEFAULT"} required>
                                    <option value="DEFAULT" className="login-hide" disabled>Gender*</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>   
                                <div className="line" id="line-gender"/>
                                <p className="login-text signup-subscript2"></p>
                            </div>
                        </div>
                        <div className="shift-up">
                            <input id="phoneNumber" className="login-input required2" type="text" name="phoneNumber" placeholder="Phone number*" maxLength="10" onBlur={this.handleCheck} required/>
                            <input id="address" className="login-input required2" type="text" name="address" placeholder="Address*" onBlur={this.handleCheck} required/>
                            <input className="login-input" type="text" name="address2" placeholder="Address line 2 (optional)"/>
                            <input id="city" className="login-input required2" type="text" name="city" placeholder="City*" onBlur={this.handleCheck} required/>
                            <div className="two-col"> 
                                <div id="state">
                                    <select id="stateVal" className="login-dropdown required2" name="state" onBlur={this.handleCheck} onChange={this.handleCheck} defaultValue={"DEFAULT"} required>
                                        <option value="DEFAULT" className="login-hide" disabled>State*</option>
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
                                <input id="zip" className="login-input required2" type="text" name="zip" placeholder="ZIP code*" maxLength="5" onBlur={this.handleCheck} required/>
                            </div>
                        </div>
                    </div> 
                    
                     
                    <div className={this.state.currStep === 3 ? "part-three" : "part-three hide"}>
                        <div>
                            <p className="login-text">Do you have insurance?*</p>
                            <div className="required3">
                                <label className="login-text login-option"><input className="login-dot" type="radio" name="insured" onClick={() => this.toggleShow("primaryShow")} value="yes" required/>Yes</label>
                                <label className="login-text login-option"><input className="login-dot" type="radio" name="insured" onClick={() => this.toggleShow("primaryHide")} value="no" required/>No</label>
                            </div>
                        </div>
                        {this.state.insurance[0] ? 
                        <Insurance handleKeyUp={this.handleKeyUp} handleCheck={this.handleCheck} num={0}/> :
                        <div></div>
                        }
                        {this.state.insurance[1] ? 
                        <Insurance handleKeyUp={this.handleKeyUp} handleCheck={this.handleCheck} toggleShow={() => this.toggleShow(1)} num={1}/> :
                        <div></div>
                        }
                        {this.state.insurance[2] ? 
                        <Insurance handleKeyUp={this.handleKeyUp} handleCheck={this.handleCheck} toggleShow={() => this.toggleShow(2)} num={2}/> :
                        <div></div>
                        }
                        {this.state.insurance[3] ? 
                        <Insurance handleKeyUp={this.handleKeyUp} handleCheck={this.handleCheck} toggleShow={() => this.toggleShow(3)} num={3}/> :
                        <div></div>
                        }
                        {this.state.insurance[4] ? 
                        <Insurance handleKeyUp={this.handleKeyUp} handleCheck={this.handleCheck} toggleShow={() => this.toggleShow(4)} num={4}/> :
                        <div></div>
                        }
                        {this.state.num < 5 ? 
                        <span className="login-expand" onClick={() => this.toggleShow(this.state.num)}>
                            <FiPlus id="login-plus"/>
                            <p id="add-insurance">Add an insurance</p>
                        </span> :
                        <div></div>}
                    </div> 
                    {this.state.error ? 
                    <p className="login-text login-red">{this.state.error}</p> :
                    <div></div>
                    }
                    <button className="login-button" type="button" onClick={() => this.changeStep(1)}>{this.state.currStep === 3 ? "Submit" : "Next Step"}</button>
                    {this.state.currStep === 1 ?
                    <div></div> :
                    <p className="login-text login-back" onClick={() => this.changeStep(-1)}>Go Back</p>}
                </form>
            </div>
        )
    }
}

class OnboardingComponent extends Component {
    constructor(props) {
        this.id = props.id
        this.submit = props.submit
        this.handleClick = this.handleClick.bind(this)
        this.state = {
            type: null,
        }
    }

    handleClick(type) {
        this.setState({type: type})
    }

    render() {
        if (this.state.type === "patient") {
            return (
                <PatientOnboarding id={this.id} submit={this.submit}/>
            )
        } else if (this.state.type === "provider") {
            return (
                <ProviderOnboarding id={this.id} submit={this.submit}/>
            )
        }
        return (
            <form id="signup-form" className="login-form signup-form"> 
                <p className="login-text">Sign up as a:</p>
                <p className="login-button" onClick={() => this.handleClick("patient")}>Patient</p>
                <p className="login-button" onClick={() => this.handleClick("provider")}>Provider</p>
            </form>
        )
    }
}


export default function Onboarding(props) {
    let history = useHistory();
    const dispatch = useDispatch();

    let from = { pathname: "/dashboard" }

    let update = () => {
        (patientCollection.findOne({"user_id": props.auth}))
        .then(info => {
            console.log("[MongoDB Stitch] Connected to Stitch. Onboarded")
            dispatch({type: "LOGIN", auth: props.auth, info: info})
        })
        history.replace(from)
    }

    let id = useSelector(state => state.auth)
    if (id) {
        return (
            <OnboardingComponent id={id} submit={update}/>
        )
    } else {
        return (
            <div></div>
        )
    }
}