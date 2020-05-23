import React, { Component, useState } from 'react'
import { FiCheck, FiMinus, FiPlus, FiInfo } from 'react-icons/fi'
import {useHistory, Redirect} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux';
import { patientCollection, providerCollection, practiceCollection } from '../App.js'
import { useForm } from "react-hook-form";
import { enUS } from 'date-fns/locale'
import { DatePicker } from 'react-nice-dates'
import 'react-nice-dates/build/style.css'

function ProviderOnboarding(props) {
    let submit = props.submit;
    let id = props.id;

    const { register, handleSubmit, watch, errors } = useForm();
    const onSubmit = (data) => {
        let practice = {
            name: data.practiceName,
            number: data.practicePhoneNumber,
            address: data.practiceAddress,
            address2: data.practiceAddress2,
            city: data.practiceCity,
            state: data.practiceState,
            zip: data.practiceZip,
            providers: [id], 
            user_id: id,
        }
        console.log(practice) //remove later
        practiceCollection.insertOne(practice)
        .then(result => {
            submitProviderInfo(data, String(result.insertedId))
            console.log(`Successfully inserted item with _id: ${result.insertedId}`)
        })
        .catch(err => {
            console.log(err)
        })
        // submitProviderInfo(data, "practiceIdHere")
    } 

    const submitProviderInfo = (data, practiceId) => {
        delete data.practiceName
        delete data.practicePhoneNumber
        delete data.practiceAddress
        delete data.practiceAddress2
        delete data.practiceCity
        delete data.practiceState
        delete data.practiceZip
        data.practice = practiceId
        data.accountType = "provider"
        data.schedule = null
        data.patients = [];
        data.user_id = id;
        console.log(data) //remove later
        providerCollection.insertOne(data)
        .then(result => {
            submit()
            console.log(`Successfully inserted item with _id: ${result.insertedId}`)
        })
        .catch(err => {
            console.log(err)
        })
    }

    let notDefault = (value) => {
        if (value === "DEFAULT") return false;
        return true;
    }
    
    return (
        <div className="page">
            <form className="login-form signup-form" onSubmit={handleSubmit(onSubmit)}>
                <input className={errors.firstName ? "login-input red" : "login-input"} type="text" name="firstName" placeholder="First name" ref={register({ required: true})}/>
                <input className={errors.lastName ? "login-input red" : "login-input"} type="text" name="lastName" placeholder="Last name"  ref={register({ required: true})}/>
                <div>
                    <select id="specialty" className="login-dropdown" name="specialty" defaultValue={"DEFAULT"}  ref={register({ required: true, validate: notDefault })}>
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
                    <div id="specialty-line" className={errors.specialty ? "line red" : "line"}/>
                </div>
                <input id="yearsPracticing" className={errors.yearsPracticing ? "login-input red" : "login-input"} type="number" name="yearsPracticing" placeholder="Years practicing" ref={register}/>
                <div>
                    <select id="sex" className="login-dropdown" name="sex" defaultValue={"DEFAULT"} ref={register({ required: true, validate: notDefault })}>
                        <option value="DEFAULT" className="login-hide" disabled>Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>   
                    <div className={errors.sex ? "line red" : "line"}/>
                </div>
                <div className="two-col">
                    <input id="phoneNumber" className={errors.phoneNumber ? "login-input red" : "login-input"} type="text" name="phoneNumber" placeholder="Work phone number" maxLength="10" ref={register({ required: true})}/>
                    <input id="extension" className="login-input" type="text" name="phoneNumber" placeholder="Extension (optional)" maxLength="10" ref={register}/>
                </div>
                <p className="login-text">Add a new practice to Bramble</p>
                <input className={errors.practicename ? "login-input red" : "login-input"} type="text" name="practiceName" placeholder="Practice Name" ref={register({ required: true})}/>
                <input className={errors.practicephoneNumber ? "login-input red" : "login-input"} type="text" name="practicePhoneNumber" placeholder="Phone number" maxLength="10" ref={register({ required: true})}/>
                <input className={errors.practiceaddress ? "login-input red" : "login-input"} type="text" name="practiceAddress" placeholder="Address" ref={register({ required: true})}/>
                <input className="login-input" type="text" name="practiceAddress2" placeholder="Address line 2 (optional)" ref={register}/>
                <input className={errors.practicecity ? "login-input red" : "login-input"} type="text" name="practiceCity" placeholder="City" ref={register({ required: true})}/>
                <div className="two-col"> 
                    <div id="state">
                        <select id="stateVal" className="login-dropdown" name="practiceState" defaultValue={"DEFAULT"} ref={register({ required: true, validate: notDefault })}>
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
                        <div id="line-state" className={errors.practicestate ? "line red" : "line"}/>
                    </div>
                    <input className={errors.practicezip ? "login-input red" : "login-input"} type="text" name="practiceZip" placeholder="ZIP code" maxLength="5" ref={register({ required: true})}/>
                </div>
                <button className="login-button" type="submit">Submit</button>
            </form>
        </div>
    )
}

function PatientOnboarding(props) {
    let submit = props.submit;
    let id = props.id;
    const { register, handleSubmit, watch, errors } = useForm();
    const onSubmit = (data) => {
        data.dob = date;
        data.providers = [];
        data.practices = [];
        data.user_id = id;
        data.accountType = "patient";
        data.insurance = [];
        if (insurance >= 1) {
            data.insurance.push({
                provider: data.insuranceProvider,
                policy: data.insurancePolicy,
                group: data.insuranceGroup,
                firstName: data.insuranceFirstName,
                lastName: data.insuranceLastName,
                dob: insuranceDate,
                SSN: data.insuranceSSN
            })
            delete data.insuranceProvider
            delete data.insurancePolicy
            delete data.insuranceGroup
            delete data.insuranceFirstName
            delete data.insuranceLastName
            delete data.insuranceDate
            delete data.insuranceSSN
            if (insurance >= 2) {
                data.insurance.push({
                    provider: data.insuranceProvider2,
                    policy: data.insurancePolicy2,
                    group: data.insuranceGroup2,
                    firstName: data.insuranceFirstName2,
                    lastName: data.insuranceLastName2,
                    dob: insuranceDate2,
                    SSN: data.insuranceSSN2
                })
                delete data.insuranceProvider2
                delete data.insurancePolicy2
                delete data.insuranceGroup2
                delete data.insuranceFirstName2
                delete data.insuranceLastName2
                delete data.insuranceDate2
                delete data.insuranceSSN2
            }
        }
        console.log(data) //remove later
        patientCollection.insertOne(data)
        .then(result => {
            submit()
            console.log(`Successfully inserted item with _id: ${result.insertedId}`)
        })
        .catch(err => {
            console.log(err)
        })
    } 
    const [date, setDate] = useState()
    const [insuranceDate, setInsuranceDate] = useState()
    const [insuranceDate2, setInsuranceDate2] = useState()
    const [insurance, toggleInsurance] = useState(0)

    let notDefault = (value) => {
        if (value === "DEFAULT") return false;
        return true;
    }
    
    return (
        <div className="page">
            <form className="login-form signup-form" onSubmit={handleSubmit(onSubmit)}> 
                    <input className={errors.firstName ? "login-input red" : "login-input"} type="text" name="firstName" placeholder="First name" ref={register({ required: true})}/>
                    <input className="login-input" type="text" name="middleName" placeholder="Middle name (optional)" ref={register}/>
                    <input className={errors.lastName ? "login-input red" : "login-input"} type="text" name="lastName" placeholder="Last name" ref={register({ required: true})}/>
                    <div className="three-col">
                        <span>
                            <DatePicker date={date} onDateChange={setDate} locale={enUS}>
                            {({ inputProps, focused }) => ( 
                                <input
                                name="dob"
                                className={'input' + (focused ? ' -focused' : '') + (errors.dob ? ' red' : '')}
                                {...inputProps}
                                ref={register({ required: true})}
                                />
                            )}
                            </DatePicker>   
                        </span>
                        <p className="login-text signup-subscript">Date of birth</p>
                        <div id="gender">
                            <select id="sex" className="login-dropdown" name="sex" defaultValue={"DEFAULT"} ref={register({ required: true, validate: notDefault })}>
                                <option value="DEFAULT" className="login-hide" disabled>Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>   
                            <div className={errors.sex ? "line red" : "line"}/>
                        </div>
                    </div>
                    <div className="shift-up">
                        <input id="phoneNumber" className={errors.phoneNumber ? "login-input red" : "login-input"} type="text" name="phoneNumber" placeholder="Phone number" maxLength="10" ref={register({ required: true})}/>
                        <input id="address" className={errors.address ? "login-input red" : "login-input"} type="text" name="address" placeholder="Address" ref={register({ required: true})}/>
                        <input className="login-input" type="text" name="address2" placeholder="Address line 2 (optional)" ref={register}/>
                        <input id="city" className={errors.city ? "login-input red" : "login-input"} type="text" name="city" placeholder="City" ref={register({ required: true})}/>
                        <div className="two-col"> 
                            <div id="state">
                                <select id="stateVal" className="login-dropdown required2" name="state" defaultValue={"DEFAULT"} ref={register({ required: true, validate: notDefault })}>
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
                                <div id="line-state" className={errors.state ? "line red" : "line"}/>
                            </div>
                            <input className={errors.zip ? "login-input red" : "login-input"} type="text" name="zip" placeholder="ZIP code" maxLength="5" ref={register({ required: true})}/>
                        </div>
                    </div>
                    <div>
                        <div className="insurance">
                            <p className="login-text">Do you have insurance?</p>
                            <label className="login-text login-option"><input className="login-dot" type="radio" name="insured" value="yes" onClick={() => toggleInsurance(1)} ref={register({ required: true})}/>Yes</label>
                            <label className="login-text login-option"><input className="login-dot" type="radio" name="insured" value="no" onClick={() => toggleInsurance(0)} ref={register({ required: true})}/>No</label>
                            {errors.insured && <p id="login-radio-alert" className="login-text login-subscript red-words">Required</p>}
                        </div>
                        {insurance >= 1 && 
                        (<div className="insurance show-insurance">
                            <p className="login-text login-header">Primary insurance</p>
                            <input className={errors.insuranceProvider ? "login-input red" : "login-input"} type="text" name="insuranceProvider" placeholder="Primary insurance provider" ref={register({ required: true})}/>
                            <input className={errors.insurancePolicy ? "login-input red" : "login-input"} type="text" name="insurancePolicy" placeholder="Policy number" ref={register({ required: true})}/>
                            <input className={errors.insuranceGroup ? "login-input red" : "login-input"} type="text" name="insuranceGroup" placeholder="Group number" ref={register({ required: true})}/>
                            <p id="subscriber-info" className="login-text">Subscriber Information</p> 
                            <input className={errors.insuranceFirstName ? "login-input red" : "login-input"} type="text" name="insuranceFirstName" placeholder="First name" ref={register({ required: true})}/>
                            <input className={errors.insuranceLastName ? "login-input red" : "login-input"} type="text" name="insuranceLastName" placeholder="Last name" ref={register({ required: true})}/>
                            <div className="three-col">
                                <div>
                                    <DatePicker date={insuranceDate} onDateChange={setInsuranceDate} locale={enUS}>
                                    {({ inputProps, focused }) => ( 
                                        <input
                                        name="insuranceDate"
                                        className={'input' + (focused ? ' -focused' : '') + (errors.insuranceDate ? ' red' : '')}
                                        {...inputProps}
                                        ref={register({ required: true})}
                                        />
                                    )}
                                    </DatePicker>   
                                </div>
                                <p className="login-text signup-subscript">Date of birth</p>
                                <input className="login-input ssn" type="text" name="insuranceSSN" placeholder="Social security number" maxLength="9" ref={register}/>
                            </div>
                            {insurance < 2 && <span className="login-expand" onClick={() => toggleInsurance(insurance + 1)}>
                                <FiPlus id="login-plus"/>
                                <p id="add-insurance">Add an insurance</p>
                            </span>}
                        </div>)}
                        {insurance >= 2 && 
                        (<div className="insurance show-insurance">
                            <p className="login-text login-header">Secondary insurance</p>
                            <input className={errors.insuranceProvider2 ? "login-input red" : "login-input"} type="text" name="insuranceProvider2" placeholder="Primary insurance provider" ref={register({ required: true})}/>
                            <input className={errors.insurancePolicy2 ? "login-input red" : "login-input"} type="text" name="insurancePolicy2" placeholder="Policy number" ref={register({ required: true})}/>
                            <input className={errors.insuranceGroup2 ? "login-input red" : "login-input"} type="text" name="insuranceGroup2" placeholder="Group number" ref={register({ required: true})}/>
                            <p id="subscriber-info" className="login-text">Subscriber Information</p> 
                            <input className={errors.insuranceFirstName2 ? "login-input red" : "login-input"} type="text" name="insuranceFirstName2" placeholder="First name" ref={register({ required: true})}/>
                            <input className={errors.insuranceLastName2 ? "login-input red" : "login-input"} type="text" name="insuranceLastName2" placeholder="Last name" ref={register({ required: true})}/>
                            <div className="three-col">
                                <div>
                                    <DatePicker date={insuranceDate2} onDateChange={setInsuranceDate2} locale={enUS}>
                                    {({ inputProps, focused }) => ( 
                                        <input
                                        name="insuranceDate2"
                                        className={'input' + (focused ? ' -focused' : '') + (errors.insuranceDate2 ? ' red' : '')}
                                        {...inputProps}
                                        ref={register({ required: true})}
                                        />
                                    )}
                                    </DatePicker>   
                                </div>
                                <p className="login-text signup-subscript">Date of birth</p>
                                <input className="login-input ssn" type="text" name="insuranceSSN2" placeholder="Social security number" maxLength="9" ref={register}/>
                            </div>
                            <span className="login-expand" onClick={() => toggleInsurance(insurance - 1)}>
                                <FiMinus id="login-plus"/>
                                <p id="add-insurance">Delete this insurance</p>
                            </span>
                        </div>)}
                    </div>
                <button className="login-button" type="submit">Submit</button>
            </form>
        </div>
    )
}


export default function Onboarding(props) {
    let history = useHistory();
    const dispatch = useDispatch();
    const [type, handleClick] = useState()
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
        if (type === "patient") {
            return (
                <PatientOnboarding id={id} submit={update}/>
            )
        } else if (type === "provider") {
            return (
                <ProviderOnboarding id={id} submit={update}/>
            )
        }
        return (
            <div className="page">
                <form className="login-form"> 
                    <p className="login-text login-centered">Sign up as a:</p>
                    <div className="two-col">
                        <button type="button" className="login-button small-login-button" onClick={() => handleClick("patient")}>Patient</button>
                        <button type="button" className="login-button small-login-button" onClick={() => handleClick("provider")}>Provider</button>
                    </div>
                    
                </form>
            </div>
        )
    } else {
        return (
            <div></div>
        )
    }
}