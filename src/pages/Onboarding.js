import React, { Component, useState } from 'react'
import { FiMinus, FiPlus, FiInfo } from 'react-icons/fi'
import {useHistory, Redirect} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux';
import { useForm } from "react-hook-form";
import { enUS } from 'date-fns/locale'
import { DatePicker } from 'react-nice-dates'
import 'react-nice-dates/build/style.css'
import { states, specialties, insurances } from '../data.js'
import instance from '../helpers.js'

function ProviderOnboarding(props) {
    let submit = props.submit;
    const [insuranceNum, toggleInsurance] = useState([0])
    const [error, toggleError] = useState()
    const { register, handleSubmit, watch, errors } = useForm();

    const onSubmit = async (data) => {
        try {
            await instance({
                method: 'post',
                url: "/session/onboard/provider",
                data: data
              });
            submit()
        } catch (error) {
            if (error.response) {
                console.log(error.response.data.error);
                toggleError(error.response.data.error)
            } else {
                toggleError("We're having issues connecting right now")
            }
        }
    } 

    let notDefault = (value) => {
        if (value === "DEFAULT") return false;
        return true;
    }

    let stateOptions = states.map((state, i) => <option key={i} value={state}>{state}</option>)
    let specialtyOptions = specialties.map((specialty, i) => <option key={i} value={specialty}>{specialty}</option>)
    let alphabeticalStart = 7
    let insuranceOptions = insurances.map((insurance, i) => <option key={i} value={insurance}>{insurance}</option>)
    insuranceOptions.splice(alphabeticalStart, 0, <option key="a" value="NULL" disabled> </option>);
    insuranceOptions.splice(0, 0, <option key="b" value="No Insurance Accepted">No Insurance Accepted</option>);

    let insuranceInputs = insuranceNum.map((num) => 
        <select key={num} 
            className={num === 0 ? errors.insuranceProvider0 ? "login-dropdown full-wide red" : "login-dropdown full-wide" : "login-dropdown full-wide"} 
            name={"insuranceProvider" + num} 
            defaultValue={"DEFAULT"} 
            ref={num === 0 ? register({ required: true, validate: notDefault }) : register} 
            onChange={(e) => {e.target.className = "login-dropdown full-wide black-text"}}>
            <option value="DEFAULT" disabled>Insurance accepted</option>
            {insuranceOptions}
        </select> 
    )
    
    return (
        <div className="onboarding-container">
            <form className="onboarding-form" onSubmit={handleSubmit(onSubmit)}> 
                <p id="practice-info" className="onboarding-text login-title">Provider Signup</p>
                <input className={errors.firstName ? "onboarding-input red" : "onboarding-input"} type="text" name="firstName" placeholder="First name" ref={register({ required: true})}/>
                <input className={errors.lastName ? "onboarding-input red" : "onboarding-input"} type="text" name="lastName" placeholder="Last name"  ref={register({ required: true})}/>
                <select id="specialty" className={errors.specialty ? "login-dropdown full-wide red" : "login-dropdown full-wide"} name="specialty" defaultValue={"DEFAULT"}  ref={register({ required: true, validate: notDefault })} onChange={(e) => {e.target.className = "login-dropdown full-wide black-text"}}>
                    <option value="DEFAULT" className="login-hide" disabled>Specialty</option>
                    {specialtyOptions}
                </select>
                <input id="practicingSince" className={errors.practicingSince ? "onboarding-input red" : "onboarding-input"} type="number" name="practicingSince" placeholder="Practicing since year (optional)" ref={register}/>
                <select id="sex" className={errors.sex ? "login-dropdown full-wide red" : "login-dropdown full-wide"} name="sex" defaultValue={"DEFAULT"} ref={register({ required: true, validate: notDefault })} onChange={(e) => {e.target.className = "login-dropdown full-wide black-text"}}>
                    <option value="DEFAULT" className="login-hide" disabled>Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                <input id="phoneNumber" className={errors.phoneNumber ? "onboarding-input half-wide red" : "onboarding-input half-wide"} type="text" name="phoneNumber" placeholder="Work phone number" maxLength="10" ref={register({ required: true})}/>
                <input className="onboarding-input half-wide" type="text" name="extension" placeholder="Extension (optional)" maxLength="10" ref={register}/>
                <p id="practice-info" className="onboarding-text login-header">Your Practice</p>
                <p className="onboarding-text onboarding-spacer">Add a new practice to Bramble</p>
                <input className={errors.practiceName ? "onboarding-input red" : "onboarding-input"} type="text" name="practiceName" placeholder="Practice name" ref={register({ required: true})}/>
                <input className={errors.practicePhoneNumber ? "onboarding-input half-wide red" : "onboarding-input half-wide"} type="text" name="practicePhoneNumber" placeholder="Phone number" maxLength="10" ref={register({ required: true})}/>
                <input className="onboarding-input half-wide" type="text" name="practiceExtension" placeholder="Extension (optional)" maxLength="10" ref={register}/>
                <input className={errors.practiceAddress ? "onboarding-input red" : "onboarding-input"} type="text" name="practiceAddress" placeholder="Address" ref={register({ required: true})}/>
                <input className="onboarding-input" type="text" name="practiceAddress2" placeholder="Address line 2 (optional)" ref={register}/>
                <input className={errors.practiceCity ? "onboarding-input red" : "onboarding-input"} type="text" name="practiceCity" placeholder="City" ref={register({ required: true})}/>
                <select id="stateVal" className={errors.practiceState ? "login-dropdown red" : "login-dropdown"} name="practiceState" defaultValue={"DEFAULT"} ref={register({ required: true, validate: notDefault })} onChange={(e) => {e.target.className = "login-dropdown black-text"}}>
                    <option value="DEFAULT" className="login-hide" disabled>State</option>
                    {stateOptions}
                </select> 
                <input className={errors.practiceZip ? "onboarding-input half-wide red" : "onboarding-input half-wide"} type="text" name="practiceZip" placeholder="ZIP code" maxLength="5" ref={register({ required: true})}/>
                {insuranceInputs}
                <span className="login-expand" onClick={() => toggleInsurance([...insuranceNum, insuranceNum[insuranceNum.length-1] + 1])}>
                    <FiPlus id="login-plus"/>
                    <p id="add-insurance">Add an insurance</p>
                </span>
                {error && <p className="login-text login-centered red-words">{error}</p>}
                <button className="login-button" type="submit">Submit</button>
            </form>
        </div>
    )
}

function PatientOnboarding(props) {
    let submit = props.submit;
    const [error, toggleError] = useState()
    const [date, setDate] = useState()
    const [insuranceDate, setInsuranceDate] = useState()
    const [insuranceDate2, setInsuranceDate2] = useState()
    const [insurance, toggleInsurance] = useState(0)
    const { register, handleSubmit, watch, errors } = useForm();

    const onSubmit = async (data) => {
        data.dob = date.toLocaleString('en-us', {year: 'numeric', month: '2-digit', day: '2-digit'})
            .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');
        if (insuranceDate) {
            data.insuranceDob = insuranceDate.toLocaleString('en-us', {year: 'numeric', month: '2-digit', day: '2-digit'})
                .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');
        }
        if (insuranceDate2) {
            data.insuranceDob2 = insuranceDate2.toLocaleString('en-us', {year: 'numeric', month: '2-digit', day: '2-digit'})
                .replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$1-$2');
        }
        try {
            await instance({
                method: 'post',
                url: "/session/onboard/patient",
                data: data
              });
            submit()
        } catch (error) {
            if (error.response) {
                console.log(error.response.data.error);
                toggleError(error.response.data.error)
            } else {
                toggleError("We're having issues connecting right now")
            }
        }
    }

    let notDefault = (value) => {
        if (value === "DEFAULT") return false;
        return true;
    }

    let stateOptions = states.map((state, i) => <option key={i} value={state}>{state}</option>)
    let alphabeticalStart = 7
    let insuranceOptions = insurances.map((insurance, i) => <option key={i} value={insurance}>{insurance}</option>)
    insuranceOptions.splice(alphabeticalStart, 0, <option key="a" value="NULL" disabled> </option>);
    
    return (
        <div className="onboarding-container">
            <form className="onboarding-form" onSubmit={handleSubmit(onSubmit)}> 
                <p id="practice-info" className="onboarding-text login-title">Patient Signup</p>
                <input className={errors.firstName ? "onboarding-input red" : "onboarding-input"} type="text" name="firstName" placeholder="First name" ref={register({ required: true})}/>
                <input className="onboarding-input" type="text" name="middleName" placeholder="Middle name (optional)" ref={register}/>
                <input className={errors.lastName ? "onboarding-input red" : "onboarding-input"} type="text" name="lastName" placeholder="Last name" ref={register({ required: true})}/>
                <p id="dob" className="onboarding-text">Date of birth</p>
                <DatePicker date={date} onDateChange={setDate} locale={enUS}>
                {({ inputProps, focused }) => ( 
                    <input
                    name="dob"
                    className={'onboarding-input input' + (focused ? ' -focused' : '') + (errors.dob ? ' red' : '')}
                    {...inputProps}
                    ref={register({ required: true})}
                    />
                )}
                </DatePicker>  
                <div id="gender">
                    <select id="sex" className={errors.sex ? "login-dropdown red" : "login-dropdown"} name="sex" defaultValue={"DEFAULT"} ref={register({ required: true, validate: notDefault })} onChange={(e) => {e.target.className = "login-dropdown black-text"}}>
                        <option value="DEFAULT" disabled>Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <input className={errors.phoneNumber ? "onboarding-input red" : "onboarding-input"} type="text" name="phoneNumber" placeholder="Phone number" maxLength="10" ref={register({ required: true})}/>
                <input id="address" className={errors.address ? "onboarding-input red" : "onboarding-input"} type="text" name="address" placeholder="Address" ref={register({ required: true})}/>
                <input className="onboarding-input" type="text" name="address2" placeholder="Address line 2 (optional)" ref={register}/>
                <input id="city" className={errors.city ? "onboarding-input red" : "onboarding-input"} type="text" name="city" placeholder="City" ref={register({ required: true})}/>
                <select id="stateVal" className={errors.state ? "login-dropdown red" : "login-dropdown"} name="state" defaultValue={"DEFAULT"} ref={register({ required: true, validate: notDefault })} onChange={(e) => {e.target.className = "login-dropdown black-text"}}>
                    <option value="DEFAULT" disabled>State</option>
                    {stateOptions}
                </select>   
                <input id="bottom-spacer" className={errors.zip ? "onboarding-input half-wide red" : "onboarding-input half-wide"} type="text" name="zip" placeholder="ZIP code" maxLength="5" ref={register({ required: true})}/>
                <p id="insurance-text" className={errors.insured ? "onboarding-text red-words" : "onboarding-text"}>Do you have insurance?</p>
                <label className="login-text login-option"><input className="login-dot" type="radio" name="insured" value="yes" onClick={() => toggleInsurance(1)} ref={register({ required: true})}/>Yes</label>
                <label className="login-text login-option"><input className="login-dot" type="radio" name="insured" value="no" onClick={() => toggleInsurance(0)} ref={register({ required: true})}/>No</label>
                {insurance >= 1 && 
                (<div className="show-insurance insurance-form">
                    <p className="onboarding-text login-header">Primary Insurance</p>
                    <select className={errors.insuranceProvider ? "login-dropdown full-wide red" : "login-dropdown full-wide"} name="insuranceProvider" defaultValue={"DEFAULT"} ref={register({ required: true, validate: notDefault })} onChange={(e) => {e.target.className = "login-dropdown full-wide black-text"}}>
                        <option value="DEFAULT" disabled>Insurance provider</option>
                        {insuranceOptions}
                    </select> 
                    <input className={errors.insurancePolicy ? "onboarding-input red" : "onboarding-input"} type="text" name="insurancePolicy" placeholder="Policy number" ref={register({ required: true})}/>
                    <input className={errors.insuranceGroup ? "onboarding-input red" : "onboarding-input"} type="text" name="insuranceGroup" placeholder="Group number" ref={register({ required: true})}/>
                    <p id="subscriber-info" className="onboarding-text onboarding-wide-spacer">Subscriber Information</p> 
                    <input className={errors.insuranceFirstName ? "onboarding-input red" : "onboarding-input"} type="text" name="insuranceFirstName" placeholder="First name" ref={register({ required: true})}/>
                    <input className={errors.insuranceLastName ? "onboarding-input red" : "onboarding-input"} type="text" name="insuranceLastName" placeholder="Last name" ref={register({ required: true})}/>
                    <p id="dob" className="onboarding-text">Date of birth</p>
                    <DatePicker date={insuranceDate} onDateChange={setInsuranceDate} locale={enUS}>
                    {({ inputProps, focused }) => ( 
                        <input
                        name="insuranceDob"
                        className={'onboarding-input input' + (focused ? ' -focused' : '') + (errors.dob ? ' red' : '')}
                        {...inputProps}
                        ref={register({ required: true})}
                        />
                    )}
                    </DatePicker>  
                    <input className="onboarding-input half-wide" type="text" name="insuranceSSN" placeholder="Social security number" maxLength="9" ref={register}/>
                    {insurance < 2 && <span className="login-expand" onClick={() => toggleInsurance(insurance + 1)}>
                        <FiPlus id="login-plus"/>
                        <p id="add-insurance">Add an insurance</p>
                    </span>}
                </div>)}
                {insurance >= 2 && 
                (<div className="show-insurance insurance-form">
                    <p className="onboarding-text login-header">Secondary Insurance</p>
                    <select className={errors.insuranceProvider2 ? "login-dropdown full-wide red" : "login-dropdown full-wide"} name="insuranceProvider2" defaultValue={"DEFAULT"} ref={register({ required: true, validate: notDefault })} onChange={(e) => {e.target.className = "login-dropdown full-wide black-text"}}>
                        <option value="DEFAULT" disabled>Insurance provider</option>
                        {insuranceOptions}
                    </select> 
                    <input className={errors.insurancePolicy2 ? "onboarding-input red" : "onboarding-input"} type="text" name="insurancePolicy2" placeholder="Policy number" ref={register({ required: true})}/>
                    <input className={errors.insuranceGroup2 ? "onboarding-input red" : "onboarding-input"} type="text" name="insuranceGroup2" placeholder="Group number" ref={register({ required: true})}/>
                    <p id="subscriber-info" className="onboarding-text onboarding-spacer">Subscriber Information</p> 
                    <input className={errors.insuranceFirstName2 ? "onboarding-input red" : "onboarding-input"} type="text" name="insuranceFirstName2" placeholder="First name" ref={register({ required: true})}/>
                    <input className={errors.insuranceLastName2 ? "onboarding-input red" : "onboarding-input"} type="text" name="insuranceLastName2" placeholder="Last name" ref={register({ required: true})}/>
                    <p id="dob" className="onboarding-text">Date of birth</p>
                    <DatePicker date={insuranceDate2} onDateChange={setInsuranceDate2} locale={enUS}>
                    {({ inputProps, focused }) => ( 
                        <input
                        name="insuranceDob2"
                        className={'onboarding-input input' + (focused ? ' -focused' : '') + (errors.dob ? ' red' : '')}
                        {...inputProps}
                        ref={register({ required: true})}
                        />
                    )}
                    </DatePicker>  
                    <input className="onboarding-input half-wide" type="text" name="insuranceSSN2" placeholder="Social security number" maxLength="9" ref={register}/>
                    <span className="login-expand" onClick={() => toggleInsurance(insurance - 1)}>
                        <FiMinus id="login-plus"/>
                        <p id="add-insurance">Delete this insurance</p>
                    </span>
                </div>)}
                {error && <p className="login-text login-centered red-words">{error}</p>}
                <button className="login-button" type="submit">Submit</button>
            </form>
        </div>
    )
}


export default function Onboarding(props) {
    let history = useHistory();
    let from = { pathname: "/dashboard" }

    let update = () => {
        history.replace(from)
    }

    if (props.type === "patient") {
        return (
            <PatientOnboarding submit={update}/>
        )
    } else if (props.type === "provider") {
        return (
            <ProviderOnboarding submit={update}/>
        )
    }
}