import React, { useState, useEffect } from 'react'
import logo from '../images/filler_icon.svg'
import { Link } from 'react-router-dom'
import instance from '../helpers'

export default function Booking(props) {
    let id = props.match.params.practice
    const [types, setTypes] = useState([])
    const [name, setName] = useState()
    useEffect(() => {
        async function getTypes() {
            let response = await instance({
                method: 'get',
                url: '/user/practice/appt-types/' + id
            })
            if (response.data.types.length) {
                setTypes(response.data.types)
            }
            setName(response.data.name)
        }
        getTypes()
    }, [id])
    let apptTypes = types.map(t => 
        <Link to={"/book/appt/" + t.id} className="grey-border">
            <p className="bold-title">{t.name}</p>
            <p className="section-text">{t.descript}</p>
        </Link>
    )
    return (
        <div className="page">
            <div className="white-box booking-page">
                <Link to={"/practice/" + id} className="section-text practice-listing">
                    <img className="practice-logo" src={logo} alt=""/>
                    <div>{name}</div>
                </Link>
                {types.length ? 
                <div className="two-col">{apptTypes}</div> :
                <p id="empty-message" className="section-text">It looks like this provider hasn't set up appointments yet</p>
                }
            </div>
        </div>
    )
}
