import React, { Component, useState } from 'react'
import {
    DatePicker,
    TimePicker,
    DateTimePicker,
    MuiPickersUtilsProvider,
  } from '@material-ui/pickers';
import TextField from '@material-ui/core/TextField';
import DateFnsUtils from '@date-io/date-fns';
import { FiCheck, FiMinus, FiPlus, FiInfo, FiXCircle } from 'react-icons/fi'
import { useForm } from "react-hook-form";

function AppointmentTypeWidget(props) {
    let deleteField = props.deleteField
    let num = props.num

    return (
        <div className="schedule-appointments">
            <FiXCircle id="schedule-adjust-x" className={(num > 0) ? "schedule-grey-icon" : "schedule-grey-icon hidden"} onClick={deleteField}/>
            <label className="schedule-text schedule-top-spacer-small" htmlFor="apptType">Appointment name</label>
            <input className="schedule-input" name="apptType" type="text" placeholder="Eg. Checkup"/>
            <label className="schedule-text schedule-top-spacer-small" htmlFor="apptDescript">Description</label>
            <textarea className="schedule-input" name="apptDescript" rows="4" cols="5" placeholder="Eg. Annual appointment to check general health and vitals"/>
            <span className="schedule-top-spacer">
                <p id="duration" className="schedule-text inline schedule-left">Duration</p>
                <span className="schedule-right">
                    <input className="schedule-input inline schedule-horizontal-spacer" type="number" min="0" max="12"/>
                    <p className="schedule-text inline">hrs</p>
                    <input className="schedule-input inline schedule-horizontal-spacer" type="number" min="0" max="60"/>
                    <p className="schedule-text inline">mins</p>
                </span>
            </span>
        </div>
    )
}

function ScheduleCreatorWidget(props) {
    let deleteField = props.deleteField
    let days = props.days
    let setDays = props.setDays
    let num = props.num
    const [inputNum, inputNumChange] = useState([])
    
    let weekdays = (["S", "M", "T", "W", "T", "F", "S"]).map((day, i) => (
        <p key={i} className={"schedule-button-day" + (days()[i] === -1 ? " unselected" : days()[i] === num ? " selected" : " null")} onClick={() => setDays(i)}>{day}</p>
    ))
    let inputFields = ([...inputNum]).map((i) => (
        <span className="schedule-available-time" key={i}>
            <TextField
                className="schedule-spacer"
                defaultValue="09:00"
                type="time"
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    step: 300, // 5 min
                }}
            />
            <TextField
                defaultValue="17:00"
                type="time"
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    step: 300, // 5 min
                }}
            />
        </span>
    ))
    return (
        <div className="schedule-availability">
            <FiXCircle className={(num > 0) ? "schedule-grey-icon" : "schedule-grey-icon hidden"} onClick={deleteField}/>
            <div>
                <div className="schedule-days">
                    {weekdays}
                </div>
            </div>
            <div className="schedule-availability-inputs">
                <span>
                    <p id="from" className="schedule-text">From</p>
                    <p id="to" className="schedule-text">To</p>
                </span>
                <div className="schedule-times">
                    <span>
                        <TextField
                            className="schedule-spacer"
                            defaultValue="09:00"
                            type="time"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                step: 300, // 5 min
                            }}
                        />
                        <TextField
                            defaultValue="17:00"
                            type="time"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                step: 300, // 5 min
                            }}
                        />
                    </span>
                    {inputFields}
                    <span id="schedule-add-time" className="schedule-add-text" onClick={() => (inputNumChange(inputNum + [inputNum.length]))}><FiPlus className="schedule-icon"/>Add another time</span>
                </div>
                {(inputNum.length != 0) && 
                <FiMinus id="schedule-minus" className="schedule-add-text schedule-icon" onClick={() => (inputNumChange(inputNum.slice(0, inputNum.length - 1)))}/>}
            </div>
        </div>
    )
}

class ScheduleCreator extends Component {
    constructor(props) {
        super(props);
        this.days = this.days.bind(this)
        this.addField = this.addField.bind(this)
        this.deleteField = this.deleteField.bind(this)
        this.setDays = this.setDays.bind(this)
        this.state = {
            days: [-1,-1,-1,-1,-1,-1,-1],
            availabilities: [0],
            appointments: [0, 1],
        }

    }

    days() {
        return this.state.days
    }

    setDays(day, num) {
        let days = [...this.state.days]
        if (days[day] === num) {
            days[day] = -1
        } else {
            days[day] = num
        }
        this.setState({
            days: days
        })
    }

    addField(type) {
        if (type === "availability") {
            let a = this.state.availabilities
            a.push(a[a.length - 1] + 1)
            this.setState({
                availabilities: a 
            })
        } else {
            let a = this.state.appointments
            a.push(a[a.length - 1] + 1)
            this.setState({
                appointments: a 
            })
        }
    }

    deleteField(type, num) {
        if (type === "availability") {
            let a = [...this.state.availabilities]
            let i = a.indexOf(num)
            a = a.slice(0, i).concat(a.slice(i+1, a.length))
            console.log(a)
            this.setState({
                availabilities: a
            })
        } else {
            let a = [...this.state.appointments]
            let i = a.indexOf(num)
            a = a.slice(0, i).concat(a.slice(i+1, a.length))
            console.log(a)
            this.setState({
                appointments: a
            })
        }
        
    }

    // setAvailability(num, time) {
    //     console.log(time)
    //     let availability = [...this.state.availability]
    //     if (availability[num].has(time)) {
    //         console.log(availability)
    //         availability[num].delete(time)
    //         console.log(availability[num].has(time))
    //     } else {
    //         availability[num].add(time)
    //     }
    //     this.setState({
    //         availability: availability
    //     })
    // }

    render() {
        let availabilities = ([...this.state.availabilities]).map((num) => (
            <ScheduleCreatorWidget key={num} num={num} days={this.days} setDays={(day) => this.setDays(day, num)} deleteField={() => this.deleteField("availability", num)}/>
        ))
        let appointments = ([...this.state.appointments]).map((num) => (
            <AppointmentTypeWidget key={num} num={num} deleteField={() => this.deleteField("appointments", num)}/>
        ))
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <form className="schedule-creator">
                    <div className="schedule-section">
                        <h1 className="schedule-title">Set your Availability</h1>
                        {availabilities}
                    <span className="schedule-add-text schedule-indent" onClick={() => this.addField("availability")}><FiPlus className="schedule-icon"/>Add another day</span>
                    </div>
                    <div className="schedule-section">
                        <h1 className="schedule-title">Appointment Types</h1>
                        <div className="schedule-appointments-container">
                            {appointments}
                        </div>
                        <span className="schedule-add-text schedule-indent" onClick={() => this.addField("appointment")}><FiPlus className="schedule-icon"/>Add another type</span>
                    </div>
                    <div className="schedule-section">
                        <h1 className="schedule-title">Time between Appointments</h1>
                        <div className="schedule-breaks">
                            <span>
                                <p className="schedule-text inline">Leave</p>
                                <input name="bufferTime" className="schedule-input inline schedule-horizontal-spacer" type="number" min="0" max="60" defaultValue="0"/>
                                <p className="schedule-text inline">mins between appointments</p>
                            </span>
                            <span className="schedule-top-spacer">
                                <input name="minimizeGaps" type="checkbox"/>
                                <label id="minimize-gaps" className="schedule-text" htmlFor="minimizeGaps">Minimize small gaps in my schedule</label> 
                            </span>
                        </div>
                    </div>
                    <span className="schedule-right">
                        <button type="button" className="cancel-button">Cancel</button>
                        <button type="submit" className="submit-button">Save</button>
                    </span>
                    {this.message}
                </form>
            </MuiPickersUtilsProvider>
        )
    }
    
}

export default class ProviderSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: props.info,
            edit: false, //for editing schedule
        }
    }

    render() {
        return(
            <div className="page">
                <ScheduleCreator/>
            </div>
        )
        // if (!this.state.info.schedule || this.state.edit) {
        //     return (
        //         <ScheduleCreator/>
        //     )
        // }
        // return (
        //     <div className="page">
        //         Hello from provider schedule!
        //     </div>
        // )
    }
}