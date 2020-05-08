import React from 'react'
import logo from '../images/logo_brown_red.svg'
import bramble from '../images/bramble_black.svg'
import { NavLink } from 'react-router-dom'

export default function Landing() {
    return (
        <div>
            
            <div className="page">
                Hello from landing page
                <h4 id="patients">Patients section</h4>
                <p>
                    This is why you should use bramble!
                </p>
                <h4 id="doctors">Doctors section</h4>
                <p>
                    This is why you should use bramble!
                </p>
            </div>
        </div>
    )
}
