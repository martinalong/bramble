import React, { useState, useEffect } from 'react'
import moment from 'moment'
import instance from '../helpers'
import { FiSearch } from 'react-icons/fi'
import logo from '../images/filler_icon.svg'
import profile from '../images/filler_profile.svg'
import { Link } from 'react-router-dom'

function Booking(props) {
    const [search, setSearch] = useState("")
    const [focus, setFocus] = useState(false)
    const [results, setResults] = useState([])
    useEffect(() => {
        async function searchProviders() {
            if (search.length) {
                try {
                    let response = await instance({
                        method: 'get', 
                        url: '/user/practices/' + search
                    })
                    setResults(response.data.practices)
                } catch (err) {
                    console.log(err)
                }
            }
        }
        searchProviders()
    }, [search])
    let practices = props.practices.map(p => (
        <div key={p.id}>
            <Link to={"/book/" + p.id} className="section-text practice-listing">
                <img className="practice-logo" src={logo} alt=""/>
                <div>{p.name}</div>
            </Link>
        </div>
    ))
    let searchResults = results.map(p => 
        <div key={p.id} className="section-text search-listing">
            <Link to={"/book/" + p.id} className="search-item">
                <img className="practice-logo" src={logo} alt=""/>
                <div>{p.name}</div>
            </Link>
        </div>
    )
    return (
        <div className="white-box">
            <h1 className="section-header">Book an appointment</h1>
            <div style={{"position" : "relative"}}>
                <input id="patient-sched-search" type="text" className="search-bar" value={search} onChange={e => setSearch(e.target.value)} placeholder="Add a new provider"/>
                <FiSearch className="search-bar-icon"/>
                {search.length > 0 && results.length > 0 ? 
                    <div id="search-results" className="search-results">
                        {searchResults}
                    </div> :
                    <div></div>
                }
            </div>
            <div className="your-practices">{practices}</div>
        </div>
    )
}

function Appointments(props) {
    let appts = props.appts
    let type = props.type
    appts = appts.map((a, i) => (
        <div key={a.id} className={"appt-listing" + (i === appts.length - 1 ? "" : " bottom-border")}>
            <img className="doctor-image" src={profile} alt=""/>
            <div>
                <p className="section-text section-item-title">{a.first_name} {a.last_name}</p>
                <p className="section-text light-text">{a.practice}</p>
                <p className="section-text">{a.appttype}</p>
                <p className="section-text">
                    <span className="bold">{moment(a.start_time).minute() === 0 ? moment(a.start_time).format("h A") : moment(a.start_time).format("h:mm A")}</span>
                    <span>, {moment(a.start_time).isSame(moment(), "year") ? moment(a.start_time).format("dddd MMM D") : moment(a.start_time).format("dddd MMM D, YYYY")}</span>
                </p>
            </div>
        </div>
    ))
    return (
        <div className="white-box">
            <h1 className="section-header">{type === "upcoming" ? "Upcoming" : "Past"}</h1>
            {appts.length ? appts : <p className="section-text">You have no {type} appointments</p>}
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
                <div id="appt-list">
                    <Appointments appts={upcoming} type="upcoming"/>
                    <Appointments appts={past} type="past"/>
                </div>
                <Booking practices={practices}/>
            </div>
        </div>
    )
}