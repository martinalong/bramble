import React, { Component, useState, useEffect } from 'react'
import ScheduleCreator from './ScheduleCreator.js'
import moment from 'moment'
import instance from '../helpers'
import { FiChevronLeft, FiChevronRight, FiMenu, FiX, FiEdit2, FiCheck, FiPlus} from 'react-icons/fi'
import {
  DatePicker,
  TimePicker,
  DateTimePicker,
  MuiPickersUtilsProvider,
} from '@material-ui/pickers';
import Navbar from '../components/Navbar.js'

function Sidebar(props) {
    let input = props.input
    let titleValue, dateValue, saveValue, notesValue, apptValue, idValue
    if (moment.isMoment(input)) {
        titleValue = ""
        apptValue = ""
        dateValue = input
        saveValue = "new"
        notesValue = ""
        idValue = null
    } else {
        titleValue = input.first_name + " " + input.last_name
        apptValue = (props.apptTypes).filter((appt) => {
            if (appt.id === input.appt_id) return true;
            return false;
        })[0]
        dateValue = moment(input.start_time)
        saveValue = "update"
        notesValue = input.notes
        idValue = input.patient_id
    }
    //setting
    const [view, setView] = useState("details") //swap between details + messaging
    const [error, toggleError] = useState()
    //displayed values
    const [eventTitle, setTitle] = useState(titleValue) //displayed patient name
    //search values
    const [patients, setPatients] = useState([]) //patients retrieved from search
    //saved values
    const [patientId, setId] = useState(idValue) //hidden patient id
    const [appt, setAppt] = useState(apptValue)
    const [selectedDate, handleDateChange] = useState(dateValue);
    const [notes, setNotes] = useState(notesValue)
    useEffect(() => {
        async function searchPatients() {
            if (eventTitle.length) {
                try {
                    let response = await instance({
                        method: 'get',
                        url: "/schedule/provider/patient/" + eventTitle,
                    });
                    setPatients(response.data.patients)
                } catch (error) {
                    if (error.response) {
                        console.log(error.response.data.error);
                    } else {
                        console.log("We're having issues connecting right now")
                    }
                }
            } else {
                setPatients([])
            }
        }
        searchPatients()
    }, [eventTitle])
    let results = patients.map(patient => 
        <div key={patient.id} className="cal-search-result" onClick={() => {
            setTitle(patient.first_name + " " + patient.last_name)
            setId(patient.id)
            }}>
            <p className="cal-search-name">{patient.first_name + " " + patient.last_name}</p>
            <p className="cal-search-dob">{moment(patient.dob).format("MMM D, YYYY")}</p>
        </div>
    )
    let deleteEvent = async () => {
        try {
            await instance({
                method: 'delete',
                url: '/schedule/appt',
                data: {
                    id: input.id
                }
            })
        } catch (err) {
            console.log(err)
        } finally {
            props.close()
        }
    }
    let submit = async () => {
        if (!patientId || !appt) {
            toggleError("Please make sure all fields are filled out")
            return
        }
        let obj, method
        let len = appt.len
        let end_time = moment(selectedDate)
        if (saveValue === "new") {
            for (let unit in len) {
                end_time.add(len[unit], unit)
            }
            obj = {
                patient: patientId,
                start_time: selectedDate,
                notes,
                end_time,
                appt_type: appt.id
            }
            method = 'post'
        } else {
            obj = {id: input.id}
            if (appt.id !== input.appt_id) {
                obj["appt_type"] = appt.id
            }
            if (!selectedDate.isSame(input.start_time) || appt.id !== input.appt_id) {
                obj["start_time"] = selectedDate
                for (let unit in len) {
                    end_time.add(len[unit], unit)
                }
                obj["end_time"] = end_time
            }
            if (notes !== input.notes) {
                obj["notes"] = notes
            }
            method = 'put'
        }
        console.log(obj)
        try {
            if (Object.keys(obj).length > 1) {
                await instance({
                method: method,
                url: "/schedule/appt",
                data: obj
              });
            }
        } catch (error) {
            if (error.response) {
                console.log(error.response.data.error);
            } else {
                console.log("We're having issues connecting right now")
            }
        } finally {
            props.close()
        }
    }
    let apptTypes = (props.apptTypes).map(type => (
        <p key={type.id} className={type.color + " appt-type-option" + (type === appt ? " sidebar-selected" : "")} onClick={() => setAppt(type)}>{type.name}</p>))
    return (
        <div className="sidebar-page">
            <div className="sidebar-smoke" onClick={() => props.close()}></div>
            <div className="sidebar-panel">
                <div className="sidebar-top">
                    <FiX className="sidebar-icon" onClick={() => props.close()}/>
                    <h1 className="sidebar-title">{eventTitle || "New Appointment"}</h1>
                    <FiCheck className="sidebar-icon" onClick={submit}/>
                </div>
                <div className="sidebar-headers">
                    <h2 className={"sidebar-header" + (view === "details" ? "" : " light-underline")} onClick={() => setView("details")}>Details</h2>
                    <h2 className={"sidebar-header" + (view === "messaging" ? "" : " light-underline")} onClick={() => setView("messaging")}>Messaging</h2>
                </div>
                {view === "details" ? 
                <div className="sidebar-details">
                    <div className="sidebar-divider">
                        {saveValue === "new" ? 
                        <div style={{"position" : "relative"}}>
                            <input className={"sidebar-name-input" + (patientId ? " input-filled" : "")} type="text" value={eventTitle} onChange={e => {
                                setTitle(e.target.value)
                                if (patientId) {
                                    setId(null)
                                }
                                }} placeholder="Patient name..."/> 
                            {patients.length && !patientId ? <div className="cal-search-box">{results}</div> : <div></div>}
                        </div>:
                        <p className="sidebar-text sidebar-name bold">{eventTitle}</p>
                        }
                        {apptTypes}
                    </div>
                    <div className="sidebar-edit-datetime sidebar-divider"> 
                        <div>
                            <p id="sidebar-date-text">{selectedDate.format("dddd")}</p>
                            <DatePicker className="sidebar-picker date-picker" value={selectedDate} onChange={(date) => {handleDateChange(date)}}
                            labelFunc={(date) => {
                                if (date.year() !== moment().year()) {
                                    return date.format("MMM Do, YYYY")
                                } else {
                                    return date.format("MMM Do")
                                }
                            }}/>
                        </div>
                        <div id="sidebar-time-section">
                            <TimePicker className="sidebar-picker" value={selectedDate} onChange={(time) => {handleDateChange(time)}}
                            labelFunc={(date) => {return date.format("h:mm A")}}
                            />
                        </div>
                    </div> 
                    <div className="sidebar-notes">
                        <p className="sidebar-text bold">Notes:</p>
                        <textarea className="sidebar-textarea" placeholder="Write something..." rows="15" cols="15" value={notes} onChange={e => setNotes(e.target.value)}/>
                    </div>
                    <div className="sidebar-error">{error}</div>
                    {saveValue === "update" ? <div id="sidebar-delete" className="cal-jump" onClick={deleteEvent}>Delete</div> : <div></div>}
                </div> :
                <div className="sidebar-messaging"></div>
                }
            </div>
        </div>
    )
}


export default class ProviderSchedule extends Component {
    constructor(props) {
        super(props)
        this.toggleEdit = this.toggleEdit.bind(this)
        this.closeSidebar = this.closeSidebar.bind(this)
        this.jumpToday = this.jumpToday.bind(this)
        this.jumpRange = this.jumpRange.bind(this)
        this.updateRange = this.updateRange.bind(this)
        this.incrementCurrent = this.incrementCurrent.bind(this)
        this.addEvent = this.addEvent.bind(this)
        this.openEvent = this.openEvent.bind(this)
        this.toggleNav = this.toggleNav.bind(this)
        this.state = {
            edit: false,
            view: "week", //"week", "day", "month"
            current: moment(), 
            appts: [],
            apptTypes: [],
            sidebar: null,
            range: this.updateRange(moment()),
            nav: false,
            jump: [1, "month"],
        }
        this.morning = ([...Array(11).keys()]).map(hour => <div key={hour + 1} className="cal-hour">{hour + 1} AM</div>)
        this.afternoon = ([11, ...Array(11).keys()]).map(hour => <div key={hour + 1} className="cal-hour">{hour + 1} PM</div>)
        this.jump = [[1, "month"], [3, "month"], [6, "month"], [1, "year"], [2, "year"]]
        this.jumpTimes = this.jump.map((unit, i) => <option key={i} value={i} className="cal-jump-option" onClick={() => {
            this.jumpRange(...unit)
            this.setState({jump: unit})
            }}>{unit[0]} {unit[1] + (unit[0] > 1 ? "s" : "")} from now</option>)
    }
    
    async componentDidMount() {
        document.getElementById("week-view-cont").scrollTop = 480
        let edit = false
        try {
            let apptResponse = await instance({
                method: 'post',
                url: "/schedule/provider/appt-times/",
                data: {
                    start_date: this.state.range[0],
                    end_date: this.state.range[this.state.range.length - 1].add(1, "day")
                }
              });
            let apptTypeResponse = await instance({
                method: 'get',
                url: "/schedule/provider/appt-types",
            });
            console.log(apptTypeResponse)
            if (apptTypeResponse.data.apptTypes.length === 0) { //if haven't filled out the form yet
                edit = true
            }
            this.setState({appts: apptResponse.data.appts, apptTypes: apptTypeResponse.data.apptTypes, edit})
        } catch (error) {
            if (error.response) {
                console.log(error.response.data.error);
            } else {
                console.log("We're having issues connecting right now")
            }
        }
    }

    updateRange(current) {
        let first = current.subtract(current.day(), "days")
        let range = []
        for (let i = 0; i < 7; i++) {
            range.push(first.clone().add(i, "days"))
        }
        return range
    }

    // //change from week to day to month view
    // updateView(newView) {
    //     let curr = this.state.current.clone()
    //     if (newView === "month") {
    //         curr = curr.date(1)
    //     } else if (newView == "week") {
    //         curr = curr.subtract(curr.day(), "days")
    //     }
    //     this.setState({
    //         current: curr, 
    //         view: newView
    //     })
    // }

    // daysInMonth(date) {
    //     let month = date.month()
    //     let year = date.year()
    //     if (month == 1 && (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0))) {
    //         return 29
    //     } else {
    //         return [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month]
    //     }
    // }

    jumpToday() {
        this.setState({
            current: moment(),
            range: this.updateRange(moment())
        })
    }

    //jump to CHANGE number of UNITs from today. From *today*
    jumpRange(change, unit) { //unit = "day", "month", "week" or this.state.view
        let curr = moment().add(change, unit + "s")
        let range = this.updateRange(curr)
        this.setState({
            current: curr, 
            range
        })
    }

    //increment CURRENT view date by one VIEW unit in DIRECTION specified. From *current view date*
    incrementCurrent(direction) { //direction = 1 or -1
        let curr = this.state.current.clone().add(direction, this.state.view + "s")
        let range = this.updateRange(curr)
        this.setState({
            current: curr, 
            range
        })
    }

    toggleEdit() {
        this.setState({edit: !this.state.edit})
    }

    toggleNav() {
        this.setState({nav: !this.state.nav})
    }

    addEvent(day, hour, minute) {
        let time 
        if (day != null && hour != null && minute != null) {
            //range is current range of days, contains moments with d/m/y
            //day is from 0 to 7 depending on displayed
            time = this.state.range[day].clone().hour(hour).minute(minute)
        } else {
            time = this.state.current.hour(moment().hour()).minute(0)
        }
        this.setState({sidebar: time})
    }

    openEvent(event) {
        this.setState({sidebar: event})
    }

    async closeSidebar() {
        this.setState({sidebar: null, change: null})
    }

    render() {
        if (this.state.edit) {
            return (
                <div className="page">
                    <ScheduleCreator toggleEdit={this.toggleEdit}/>
                </div>
            )
        }
        let week = (this.state.range).map((day, i) => <h2 key={i} className="cal-weekday">{day.isSame(this.state.current, "month") ? day.format("ddd D") : day.format("ddd, MMM D")}</h2>)
        let weekDays = []
        for (let day = 0; day < 7; day++) {
            for (let hour = 0; hour < 24; hour++) {
                weekDays.push(<div key={day*100+hour+"a"} className={"cal-no-box" + (this.state.range[day].isSame(moment(), "day") ? " grey-background" : "")} onClick={() => this.addEvent(day, hour, 0)}></div>)
                weekDays.push(<div key={day*100+hour+"b"} className={"cal-box" + (this.state.range[day].isSame(moment(), "day") ? " grey-background" : "")} onClick={() => this.addEvent(day, hour, 30)}></div>)
            }
        }
        let current = this.state.current
        let events = (this.state.appts).filter(event => {
            if (moment(event.start_time).isSame(this.state.current, this.state.view)) return true;
            return false;
        })
        .map(event => {
            let start = moment(event.start_time)
            let end = moment(event.end_time)
            let mins = Math.floor(end.diff(start, "minutes") / 15) * 15
            return (<div className={"event " + event.color} 
                onClick={() => this.openEvent(event)}
                key={event.last_name + event.start_time}
                style={{
                    "height" : mins + "px", 
                    "gridArea" : (4*start.hour() + Math.floor(start.minute() / 15) + 1) + "/" + (start.day() + 1)  + "/" + (4*start.hour() + Math.floor(start.minute() / 15)+ 2) + "/" + (start.day() + 2)
                    }}>
                    <div className="event-person">{event.first_name} {event.last_name}</div>
                    {mins > 30 ? 
                    <div>
                        <div className="event-type">{event.name}</div> 
                        {mins > 45 ? <div className="event-type">{start.minute() == 0 ? start.format("h") : start.format("h:mm")}{start.format("a") === end.format("a") ? "" : start.format("a")} - {end.minute() == 0 ? end.format("h a") : end.format("h:mm a")}</div> : <div></div>}
                    </div> :
                    <div></div>
                    }
                </div>)
        })
        return (
            <div className="cal-page">
                {this.state.nav ? 
                <Navbar/> :
                <div></div>
                }
                <div className="cal-top">
                    <h1 className="cal-month">
                        <div>
                            <FiMenu className="cal-menu" onClick={this.toggleNav}/>
                            <span className="cal-arrows">
                                <FiChevronLeft className="cal-arrow" onClick={() => this.incrementCurrent(-1)}/>
                                <FiChevronRight className="cal-arrow" onClick={() => this.incrementCurrent(1)}/>
                            </span>
                            <p className="cal-current-month">{current.format("MMMM") + (current.isSame(moment(), "year") ? "" : current.format(" YYYY"))}</p>
                        </div>
                        <div className="cal-top-right">
                            <p className="cal-jump" onClick={this.jumpToday}>Today</p>
                            <div style={{"display": "inline-block", "position": "relative"}}>
                                <select className="cal-select-jump" onChange={(e) => {
                                    let newJump = this.jump[e.target.selectedIndex]
                                    this.jumpRange(...newJump)
                                    this.setState({jump: newJump})
                                }}>
                                    {this.jumpTimes}
                                </select> 
                                <p className="cal-jump cal-selection-jump" onClick={() => this.jumpRange(...this.state.jump)}>{this.state.jump[0]} {this.state.jump[1] + (this.state.jump[0] > 1 ? "s" : "")} from now</p>
                            </div>
                        </div>
                    </h1>
                    <div className="cal-weekdays">
                        <div></div>
                        {week}
                    </div>
                </div>
                <div id="week-view-cont" className="week-view-cont">
                    <div className="week-view">
                        <div className="cal-times">
                            {this.morning}
                            {this.afternoon}
                        </div>
                        <div className="week-view-events">
                            {weekDays}
                        </div>
                    </div>
                    <div className="week-content">
                        <div className="week-padding">
                            {this.state.current.isSame(moment(), this.state.view) ?
                            <div className="timeline" style={{"top" : (moment().get("hour") * 60 + moment().get("minute")) + "px"}}></div> :
                            <div></div>
                            }
                            {events}
                        </div>
                    </div>
                </div>
                <div className="cal-floating-icons">
                    <div id="cal-edit-cont" className="cal-icon-container" onClick={this.toggleEdit}><FiEdit2 id="edit-cal"/></div>
                    <div id="cal-add-cont" className="cal-icon-container" onClick={() => this.addEvent(this.state.current.day(), moment().hour(), 0)}><FiPlus id="add-event"/></div>
                </div>
                {this.state.sidebar ? <Sidebar input={this.state.sidebar} apptTypes={this.state.apptTypes} close={this.closeSidebar}/> : <div></div>}
            </div>
        )
    }
}