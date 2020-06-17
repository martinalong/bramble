import React, { useState } from 'react'
import TextField from '@material-ui/core/TextField';
import { FiMinus, FiPlus, FiXCircle } from 'react-icons/fi'
import { useForm } from "react-hook-form";
import instance from '../helpers.js'

function AppointmentTypeWidget(props) {
    let register = props.register
    let errors = props.errors
    let deleteField = props.deleteField
    let num = props.num

    let oneSelected = () => {
        if (document.getElementById("hrs" + num).value || document.getElementById("mins" + num).value) {
            return true
        } 
        return false
    }

    return (
        <div className="schedule-appointments">
            <FiXCircle id="schedule-adjust-x" className={(num > 0) ? "schedule-grey-icon" : "schedule-grey-icon hidden"} onClick={deleteField}/>
            <label className="schedule-text schedule-top-spacer-small" htmlFor="apptType">Appointment name</label>
            <input className={errors["apptType" + num] ? "schedule-input red" : "schedule-input"} name={"apptType" + num} type="text" placeholder="Eg. Checkup" ref={register({ required: true })}/>
            <label className="schedule-text schedule-top-spacer-small" htmlFor="apptDescript">Description</label>
            <textarea className="schedule-input" name={"apptDescript" + num} rows="4" cols="5" placeholder="Eg. Annual appointment to check general health and vitals" ref={register}/>
            <span className="schedule-top-spacer">
                <p id="duration" className="schedule-text inline schedule-left">Duration</p>
                <span className="schedule-right">
                    <input className={"schedule-input inline schedule-horizontal-spacer" + (errors["hrs" + num] ? " red" : "")} 
                        id={"hrs" + num} name={"hrs" + num} type="number" min="0" max="12" ref={register({ validate: oneSelected })}/>
                    <p className="schedule-text inline">hrs</p>
                    <input className={"schedule-input inline schedule-horizontal-spacer" + (errors["mins" + num] ? " red" : "")} 
                        id={"mins" + num} name={"mins" + num} type="number" min="0" max="60" ref={register({ validate: oneSelected })}/>
                    <p className="schedule-text inline">mins</p>
                </span>
            </span>
        </div>
    )
}

function ScheduleCreatorWidget(props) {
    let errors = props.errors
    let setAvail = props.setAvail
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
                className={"schedule-spacer" + (errors()[num] && errors()[num][Number(i)+1] ? " red-curved" : "")}
                defaultValue="09:00"
                type="time"
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    step: 300, // 5 min
                }}
                onChange={(e) => setAvail(e.target.value, Number(i)+1, 0)}
            />
            <TextField
                className={errors()[num] && errors()[num][Number(i)+1] ? " red-curved" : ""}
                defaultValue="17:00"
                type="time"
                InputLabelProps={{
                    shrink: true,
                }}
                inputProps={{
                    step: 300, // 5 min
                }}
                onChange={(e) => setAvail(e.target.value, Number(i)+1, 1)}
            />
        </span>
    ))
    return (
        <div className={"schedule-availability" + (errors()[num] && (errors()[num]["day"] || errors()[num]["overlap"]) ? " red" : "")}>
            <FiXCircle className={(num > 0) ? "schedule-grey-icon" : "schedule-grey-icon hidden"} onClick={deleteField}/>
            <div className="schedule-days">
                {weekdays}
            </div>
            {errors()[num] && errors()[num]["day"] && 
            <p id="day-error" className="schedule-error">Please select a day</p>}
            {(errors()[num] && errors()[num]["overlap"]) &&
            <p id="overlap-error" className="schedule-error">Time ranges must not overlap</p>}
            {(errors()[num] && errors()[num]["order"]) &&
            <p id="order-error" className="schedule-error">Start times must be before end times</p>}
            <div className="schedule-availability-inputs">
                <span>
                    <p id="from" className="schedule-text">From</p>
                    <p id="to" className="schedule-text">To</p>
                </span>
                <div className="schedule-times">
                    <span>
                        <TextField
                            className={"schedule-spacer" + (errors()[num] && errors()[num][0] ? " red-curved" : "")}
                            defaultValue="09:00"
                            type="time"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                step: 300, // 5 min
                            }}
                            onChange={(e) => setAvail(e.target.value, 0, 0)}
                        />
                        <TextField
                            className={errors()[num] && errors()[num][0] ? " red-curved" : ""}
                            defaultValue="17:00"
                            type="time"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                step: 300, // 5 min
                            }}
                            onChange={(e) => setAvail(e.target.value, 0, 1)}
                        />
                    </span>
                    {inputFields}
                    <span id="schedule-add-time" className="schedule-add-text" 
                        onClick={() => {
                            inputNumChange(inputNum + [inputNum.length])
                            setAvail("add", 0, 0)
                        }}>
                        <FiPlus className="schedule-icon"/>Add another time
                    </span>
                </div>
                {(inputNum.length !== 0) && 
                <FiMinus id="schedule-minus" className="schedule-add-text schedule-icon" 
                    onClick={() => {
                        inputNumChange(inputNum.slice(0, inputNum.length - 1))
                        setAvail("sub", 0, 0)
                    }}/>}
            </div>
        </div>
    )
}

export default function ScheduleCreator (props) {
    const { register, handleSubmit, errors } = useForm();
    const [appointments, apptState] = useState([0, 1])
    const [availabilities, availState] = useState([0])
    const [days, dayState] = useState([-1,-1,-1,-1,-1,-1,-1])
    const [times, availTimes] = useState({0: [["09:00","17:00"]]})
    const [schedErrors, setErrors] = useState({})
    const [error, toggleError] = useState()

    let setDays = (day, num) => {
        let newDays = [...days]
        if (newDays[day] === num) {
            newDays[day] = -1
        } else {
            newDays[day] = num
        }
        dayState(newDays)
    }

    let setAvail = (time, i, j, num) => {
        let newTimes = times
        if (time === "add") {
            newTimes[num].push(["09:00","17:00"])
        } else if (time === "sub") {
            newTimes[num].pop()
        } else {
            newTimes[num][i][j] = time //num = which widget, i = which time pair, j = start or end
        }
        availTimes(newTimes)
    }

    let addField = (type) => {
        if (type === "availability") {
            let a = [...availabilities]
            let val = a[a.length - 1] + 1
            a.push(val)
            availState(a)
            let newTimes = times
            newTimes[val] = [["09:00","17:00"]]
            availTimes(newTimes)
        } else {
            let a = [...appointments]
            a.push(a[a.length - 1] + 1)
            apptState(a)
        }
    }

    let deleteField = (type, num) => {
        if (type === "availability") {
            let a = [...availabilities]
            let i = a.indexOf(num)
            a = a.slice(0, i).concat(a.slice(i+1, a.length))
            availState(a)
            let newTimes = times
            delete newTimes[num]
            availTimes(newTimes)
        } else {
            let a = [...appointments]
            let i = a.indexOf(num)
            a = a.slice(0, i).concat(a.slice(i+1, a.length))
            apptState(a)
        }
    }

    let compareTimes = (t1, t2) => {
        t1 = 100 * Number(t1.slice(0,2)) + t1.slice(3)
        t2 = 100 * Number(t2.slice(0,2)) + t2.slice(3)
        return t1 - t2
    }

    //prefill fields based upon existing data
    let onSubmit = async (data) => {
        let customErrors = schedErrors
        let timeSlots = []
        let progress = true
        for (let num in times) {
            customErrors[num] = {}
            let applyDays = days.reduce((res, n, i) => {
                if (n === Number(num)) {
                    res = [...res, i]
                }
                return res
            }, [])
            if (!applyDays.length) {
                customErrors[num]["day"] = true
                progress = false
            }
            let currTimes = [...times[num]]
            currTimes.sort((r1, r2) => compareTimes(r1[0], r2[0]))
            // for (let d of applyDays) {
                let prevEnd = "00:00"
                for (let i = 0; i < currTimes.length; i ++) {
                    if (compareTimes(prevEnd, currTimes[i][0]) > 0) {
                        customErrors[num]["overlap"] = true
                        progress = false
                        break
                    }
                    prevEnd = currTimes[i][1]
                }
                for (let i = 0; i < currTimes.length; i ++) {
                    let range = times[num][i]
                    if (range[0].length < 5 || range[1].length < 5) {
                        customErrors[num][i] = true
                        progress = false
                    } else if (compareTimes(range[0], range[1]) >= 0) {
                        customErrors[num]["order"] = true
                        customErrors[num][i] = true
                        progress = false
                    }
                    timeSlots.push([applyDays, ...range]) //day (0=sunday), startTime, endTime
                }
            // }
        }
        setErrors(customErrors)
        if (progress) {
            if (!data.buffer) {
                data.buffer = 0
            }
            data.appointments = appointments
            data.timeSlots = timeSlots
            console.log(data) //testing
            try {
                await instance({
                    method: 'post',
                    url: "/schedule/set-schedule",
                    data: data
                });
                props.toggleEdit()
                console.log("success")
            } catch (error) {
                if (error.response) {
                    console.log(error.response.data.error)
                    toggleError(error.response.data.error)
                } else {
                    toggleError("We're having issues connecting right now")
                }
            }
        }
    }
    
    let availWidgets = ([...availabilities]).map((num) => (
        <ScheduleCreatorWidget errors={() => {return schedErrors}} setAvail={(time, i, j) => setAvail(time, i, j, num)} key={num} num={num} days={() => {return days}} setDays={(day) => setDays(day, num)} deleteField={() => deleteField("availability", num)}/>
    ))
    let apptWidgets = ([...appointments]).map((num) => (
        <AppointmentTypeWidget errors={errors} register={register} key={num} num={num} deleteField={() => deleteField("appointments", num)}/>
    ))
    return (
        <form className="schedule-creator" onSubmit={handleSubmit(onSubmit)}>
            <div className="schedule-section">
                <h1 className="schedule-title">Set your Availability</h1>
                {availWidgets}
            <span className="schedule-add-text schedule-indent" onClick={() => addField("availability")}><FiPlus className="schedule-icon"/>Add another day</span>
            </div>
            <div className="schedule-section">
                <h1 className="schedule-title">Appointment Types</h1>
                <div className="schedule-appointments-container">
                    {apptWidgets}
                </div>
                <span className="schedule-add-text schedule-indent" onClick={() => addField("appointment")}><FiPlus className="schedule-icon"/>Add another type</span>
            </div>
            <div className="schedule-section">
                <h1 className="schedule-title">Time between Appointments</h1>
                <div className="schedule-breaks">
                    <span>
                        <p className="schedule-text inline">Leave</p>
                        <input name="buffer" className="schedule-input inline schedule-horizontal-spacer" type="number" min="0" max="60" defaultValue="0" ref={register}/>
                        <p className="schedule-text inline">mins between appointments</p>
                    </span>
                    <span className="schedule-top-spacer">
                        <input name="minimizeGaps" type="checkbox" ref={register}/>
                        <label id="minimize-gaps" className="schedule-text" htmlFor="minimizeGaps">Minimize small gaps in my schedule</label> 
                    </span>
                </div>
            </div>
            <span className="schedule-right">
                <button type="button" className="cancel-button">Cancel</button>
                <button type="submit" className="submit-button">Save</button>
            </span>
        </form>
    )
}