import React from 'react'
import logo from '../images/logo_brown_red.svg'
import bramble from '../images/bramble_black.svg'
import { NavLink } from 'react-router-dom'
import {useSelector} from 'react-redux';

export default function Navbar() {
    let info = useSelector(state => state.info)
    let accountType = null
    if (info) {
        accountType = info.accountType
    }
    console.log("navbar accountType", accountType)
    if (!accountType) {
        return (
            <div className="nav">
                <NavLink className="nav-logo-container" to="/">
                    <img className="nav-logo" src={logo} alt="bramble logo"/>
                    <img className="nav-name" src={bramble} alt="bramble"/>
                </NavLink>
                <div className="nav-links">
                    <a href="#patients" className="nav-link">For patients</a>
                    <a href="#doctors" className="nav-link">For doctors</a>
                    <NavLink className="nav-link" to="/login">Log in</NavLink>
                    <NavLink className="nav-button" to="/signup">Sign up</NavLink>
                </div>
            </div>
        )
    }
    return (
        <div className="nav">
            <NavLink className="nav-logo-container" to="/dashboard">
                <img className="nav-logo" src={logo} alt="bramble logo"/>
                <img className="nav-name" src={bramble} alt="bramble"/>
            </NavLink>
            <div className="nav-links">
                <NavLink className="nav-link" activeClassName="nav-link-underline" to={accountType === "patient" ? "/doctors" : "/patients"}>{accountType === "patient" ? "Doctors" : "Patients"}</NavLink>
                <NavLink className="nav-link" activeClassName="nav-link-underline" to="/communication">Communication</NavLink>
                <NavLink className="nav-link" activeClassName="nav-link-underline" to="/appointments">{accountType === "patient" ? "Appointments" : "Schedule"}</NavLink>
                <NavLink className="nav-link" activeClassName="nav-link-underline" to="/account">Account</NavLink> 
            </div>
        </div>
    )
}


// export default class Navbar extends Component {
//     constructor(props) {
//         super(props);
//         // this.handleScroll = this.handleScroll.bind(this);
//         this.state = {
//             accountType: props.accountType,
//             // scroll: false,
//         }
//     }

//     // componentDidMount() {
//     //     window.addEventListener('scroll', this.handleScroll);
//     // }
    
//     // componentWillUnmount() {
//     //     window.removeEventListener('scroll', this.handleScroll);
//     // }

//     // handleScroll() {
//     //     if (window.scrollY > 50) {
//     //         if (!this.state.scroll) {
//     //             this.setState({scroll: true});
//     //         }
//     //     } else {
//     //         if (this.state.scroll) {
//     //             this.setState({scroll: false});
//     //         }
//     //     }
//     // }

//      render() {
//         console.log("navbar accountType", this.state.accountType)
//         if (!this.state.accountType) {
//             return (
//                 <div className="nav">
//                     <NavLink className="nav-logo-container" to="/">
//                         <img className="nav-logo" src={logo} alt="bramble logo"/>
//                         <img className="nav-name" src={bramble} alt="bramble"/>
//                     </NavLink>
//                     <div className="nav-links">
//                         <a href="#patients" className="nav-link">For patients</a>
//                         <a href="#doctors" className="nav-link">For doctors</a>
//                         <NavLink className="nav-link" to="/login">Log in</NavLink>
//                         <NavLink className="nav-button" to="/signup">Sign up</NavLink>
//                     </div>
//                 </div>
//             )
//         }
//         return (
//             <div className="nav">
//                 <NavLink className="nav-logo-container" to="/dashboard">
//                     <img className="nav-logo" src={logo} alt="bramble logo"/>
//                     <img className="nav-name" src={bramble} alt="bramble"/>
//                 </NavLink>
//                 <div className="nav-links">
//                     <NavLink className="nav-link" activeClassName="nav-link-underline" to={this.state.accountType === "patient" ? "/doctors" : "/patients"}>{this.state.isPatient ? "Doctors" : "Patients"}</NavLink>
//                     <NavLink className="nav-link" activeClassName="nav-link-underline" to="/communication">Communication</NavLink>
//                     <NavLink className="nav-link" activeClassName="nav-link-underline" to="/appointments">{this.state.isPatient ? "Appointments" : "Schedule"}</NavLink>
//                     <NavLink className="nav-link" activeClassName="nav-link-underline" to="/account">Account</NavLink> 
//                 </div>
//             </div>
//         )
//     }
// }
