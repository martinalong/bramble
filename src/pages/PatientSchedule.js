import React, { useState, useEffect } from 'react'
import moment from 'moment'
import instance from '../helpers'

function Booking(props) {
    let practices = props.practices.map(p => (
        <div>{p.name}</div>
    ))
    return (
        <div className="white-box">
            <input type="text" className="search-bar" placeholder="Add a new provider"/>
            {practices}
        </div>
    )
}

function Upcoming(props) {
    let appts = props.appts
    appts = appts.map(a => (
        <div>
            <p>{a.first_name} {a.last_name}  •  {a.practice}</p>
            <p>{a.apptType}</p>
            <p>
                <span>{moment(a.start_time).minute() === 0 ? moment(a.start_time).format("h A") : moment(a.start_time).format("h:mm A")} </span>
                <span>{moment(a.start_time).isSame(moment(), "year") ? moment(a.start_time).format("dddd MMM D") : moment(a.start_time).format("dddd MMM D, YYYY")}</span>
            </p>
        </div>
    ))
    return (
        <div className="white-box">
            <h1>Upcoming</h1>
            {appts}
        </div>
    )
}

function Past(props) {
    let appts = props.appts
    appts = appts.map((a) => (
        <div>
            <p>{a.first_name} {a.last_name}  •  {a.practice}</p>
            <p>{a.appttype}</p>
            <p>
                <span>{moment(a.start_time).minute() === 0 ? moment(a.start_time).format("h A") : moment(a.start_time).format("h:mm A")} </span>
                <span>{moment(a.start_time).isSame(moment(), "year") ? moment(a.start_time).format("dddd MMM D") : moment(a.start_time).format("dddd MMM D, YYYY")}</span>
            </p>
        </div>
    ))
    return (
        <div className="white-box">
            <h1>Past</h1>
            {appts}
        </div>
    )
}

export default function PatientSchedule() {
    const [retrieve, toggleRetrieve] = useState(true)
    const [past, setPast] = useState([])
    const [upcoming, setUpcoming] = useState([])
    const [practices, setPractices] = useState([])
    useEffect(() => {
        async function getAppts() {
            try {
                let response = await instance({
                    method: 'get',
                    url: "/schedule/patient/appt-times"
                });
                let practices = await instance ({
                    method: 'get',
                    url: "/user/patient/practices" 
                })
                if (response) {
                    setUpcoming(response.data.upcoming)
                    setPast(response.data.past) 
                }
                if (practices) {
                    setPractices(practices.data.practices)
                }
            } catch (err) {
                console.log(err)
            }
        }
        getAppts()
    }, [retrieve])
    return (
        <div className="page">
            <div className="patient-sched">
                <Booking practices={practices}/>
                <Upcoming appts={upcoming}/>
                <Past appts={past}/>
            </div>
        </div>
    )
}