import React, { Component, useState } from 'react'
import logo from '../images/filler_icon.svg'
import profile from '../images/filler_profile.svg'
import { Link } from 'react-router-dom'
import moment from 'moment'
import instance from '../helpers'
import { enUS } from 'date-fns/locale'
import { DatePickerCalendar } from 'react-nice-dates'
import 'react-nice-dates/build/style.css'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

function Calendar() {
    const [date, setDate] = useState()
    return (
        <div id="calendar-popup">
            <DatePickerCalendar date={date} onDateChange={setDate} locale={enUS} />
        </div>
    )
}

export default class BookingTimes extends Component {
    constructor(props) {
        super(props)
        this.id = props.match.params.appttype
        this.getAvail = this.getAvail.bind(this)
        this.updateRange = this.updateRange.bind(this)
        this.incrementCurrent = this.incrementCurrent.bind(this)
        this.submit = this.submit.bind(this)
        this.state = {
            calendar: false,
            current: moment(),
            range: this.updateRange(moment()),
            providers: [],
            times: [],
            selected: null
        }
    }

    async getAvail() {
        try {
            let response = await instance({
                method: 'post',
                url: '/schedule/appt-avail',
                data: {
                    providers: this.state.providers,
                    day: this.state.current,
                    type_id: this.id
                }
            })
            this.setState({times: response.data.obj || [], len: response.data.len})
        } catch (err) {
            return
        }
    }

    async componentDidMount() {
        try {
            let response = await instance({
                method: 'get',
                url: '/schedule/appt-providers/' + this.id
            })
            this.setState({providers: response.data.providers || []}, this.getAvail)
        } catch (err) {
            return
        }
    }

    async submit() {
        let len = this.state.len
        let end_time = moment(this.state.selected[0])
        for (let unit in len) {
            end_time.add(len[unit], unit)
        }
        try {
            await instance({
                method: 'post',
                url: '/schedule/appt',
                data: {
                    provider: this.state.selected[1].id,
                    start_time: this.state.selected[0],
                    notes: document.getElementById("textarea").value,
                    end_time,
                    appt_type: this.id
                }
            })
        } catch (err) {
            console.log(err)
        }
    }

    updateRange(current) {
        let first = current.clone().subtract(current.day(), "days")
        let range = []
        for (let i = 0; i < 7; i++) {
            range.push(first.clone().add(i, "days"))
        }
        return range
    }

    incrementCurrent(direction) {
        let curr = this.state.current.clone().add(direction, "weeks")
        let range = this.updateRange(curr)
        this.setState({
            current: curr, 
            range
        }, this.getAvail)
    }

    render() {
        let selected
        let doctor
        if (this.state.selected) {
            selected = moment(this.state.selected[0])
            let doc = this.state.selected[1]
            doctor = (doc.prefix ? doc.prefix + " " : "") + doc.first_name + " " + doc.last_name + (doc.suffix ? " " + doc.suffix : "")
        }
        let curr = this.state.current
        let dates = this.state.range.map(day => (
            <div onClick={() => this.setState({current: day}, this.getAvail)} 
                className={"select-day" + (day.isSame(curr, "month") ? "" : " grey-day") + 
                (day.isSame(curr, "day") ? " selected-day" : "") + 
                (day.isSame(moment(), "day") ? " grey-circle" : "")}>
                {day.format("D")}
            </div>
        ))
        let boxes = []
        for (let p of this.state.providers) {
            let times
            if (this.state.times[p.id]) {
                times = (this.state.times[p.id]).map(t => (
                    <p key={moment(t).format("h:mma")} className="grey-border section-text time-choice" onClick={() => this.setState({selected: [t, p]})}>
                        {moment(t).format("h:mm a")}
                    </p>
                )) 
            } else {
                times = (<p className="section-text">No availabilities</p>)
            }
            if (times.length) {
                boxes.push(
                    <div className="white-box">
                        <Link to={"/doctor/" + p.id} className="practice-listing">
                            <img className="practice-logo" src={profile} alt=""/>
                            <p className="section-text">{(p.prefix ? p.prefix : "") + " " + p.first_name + " " + p.last_name + " " + (p.suffix ? p.suffix : "")}</p>
                        </Link>
                        <div className="times-list">
                            {times}
                        </div>
                    </div>
                )
            }
        }
        return (
            <div className="page"> 
                <div className="month-display">{curr.isSame(moment(), "year") ? curr.format("MMMM") : curr.format("MMMM YYYY")}</div>
                {this.state.calendar ? <Calendar/> : <div></div>}
                <div className="dates-bar">
                    <FiChevronLeft className="chevrons" onClick={() => this.incrementCurrent(-1)}/>
                    {dates}
                    <FiChevronRight className="chevrons" onClick={() => this.incrementCurrent(1)}/>
                </div>
                {this.state.selected ? 
                <div className="white-box confirm-window">
                    <p className="confirm-header section-header">Appointment with {doctor}</p>
                    <p className="confirm-header section-text">{selected.isSame(moment(), "year") ? selected.format("ddd, MMMM Do") : selected.format("ddd, MMMM Do YYYY")} - <span className="bold">{selected.format("h:mm a")}</span></p>
                    <textarea id="textarea" className="confirm-textarea" placeholder="Reason for your visit:" rows="8" cols="30"/>
                    <button type="button" className="square-button" onClick={this.submit}>Book</button>
                </div>:
                <div className="avail-providers">{boxes}</div>
                }
            </div>
        )
    }
}
