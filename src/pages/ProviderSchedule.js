import React, { Component } from 'react'

function ScheduleCreatorWidget(props) {
    let availability = props.availability
    let setAvailability = props.setAvailability
    let days = props.days
    let setDays = props.setDays
    let num = props.num
    let morning = [5, 6, 7, 8, 9, 10, 11]
    let afternoon = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    morning = morning.map((hour) => (
        <div className="schedule-hour">
            <p className={"schedule-button" + (availability().has("" + hour + ":00") ? " selected" : " unselected")} onClick={() => setAvailability("" + hour + ":00")}>{hour}:00 am</p>
            <p className={"schedule-button" + (availability().has("" + hour + ":15") ? " selected" : " unselected")} onClick={() => setAvailability("" + hour + ":15")}>{hour}:15 am</p>
            <p className={"schedule-button" + (availability().has("" + hour + ":30") ? " selected" : " unselected")} onClick={() => setAvailability("" + hour + ":30")}>{hour}:30 am</p>
            <p className={"schedule-button" + (availability().has("" + hour + ":45") ? " selected" : " unselected")} onClick={() => setAvailability("" + hour + ":45")}>{hour}:45 am</p>
        </div>
    ))
    afternoon = afternoon.map((hour) => (
        <div className="schedule-hour">
            <p className={"schedule-button" + (availability().has("" + hour + ":00") ? " selected" : " unselected")} onClick={() => setAvailability("" + hour + ":00")}>{hour}:00 pm</p>
            <p className={"schedule-button" + (availability().has("" + hour + ":15") ? " selected" : " unselected")} onClick={() => setAvailability("" + hour + ":15")}>{hour}:15 pm</p>
            <p className={"schedule-button" + (availability().has("" + hour + ":30") ? " selected" : " unselected")} onClick={() => setAvailability("" + hour + ":30")}>{hour}:30 pm</p>
            <p className={"schedule-button" + (availability().has("" + hour + ":45") ? " selected" : " unselected")} onClick={() => setAvailability("" + hour + ":45")}>{hour}:45 pm</p>
        </div>
    ))
    return (
        <div className="schedule-widget">
            <span className="schedule-center">
                <h1 className="schedule-header">Apply to:</h1>
                <div className="schedule-days">
                    <p className={"schedule-button" + (!days()[0] ? " unselected" : days()[0] === num ? " selected" : " null")} onClick={() => setDays(0)}>Sun</p>
                    <p className={"schedule-button" + (!days()[1] ? " unselected" : days()[1] === num ? " selected" : " null")} onClick={() => setDays(1)}>Mon</p>
                    <p className={"schedule-button" + (!days()[2] ? " unselected" : days()[2] === num ? " selected" : " null")} onClick={() => setDays(2)}>Tues</p>
                    <p className={"schedule-button" + (!days()[3] ? " unselected" : days()[3] === num ? " selected" : " null")} onClick={() => setDays(3)}>Weds</p>
                    <p className={"schedule-button" + (!days()[4] ? " unselected" : days()[4] === num ? " selected" : " null")} onClick={() => setDays(4)}>Thurs</p>
                    <p className={"schedule-button" + (!days()[5] ? " unselected" : days()[5] === num ? " selected" : " null")} onClick={() => setDays(5)}>Fri</p>
                    <p className={"schedule-button" + (!days()[6] ? " unselected" : days()[6] === num ? " selected" : " null")} onClick={() => setDays(6)}>Sat</p>
                </div>
            </span>
            <div className="schedule-two-col">
                <div className="schedule-col">
                    <h1 className="schedule-header">Morning</h1>
                    <div className="schedule-viewport">
                        <div className="schedule-morning schedule-times">
                            {morning}
                        </div>
                    </div>
                </div>
                <div className="schedule-col">
                    <h1 className="schedule-header">Afternoon</h1>
                    <div className="schedule-viewport">
                        <div className="schedule-afternoon schedule-times">
                            <div className="schedule-hour">
                                <p className={"schedule-button" + (availability().has("12:00") ? " selected" : " unselected")} onClick={() => setAvailability("12:00")}>12:00 pm</p>
                                <p className={"schedule-button" + (availability().has("12:15") ? " selected" : " unselected")} onClick={() => setAvailability("12:15")}>12:15 pm</p>
                                <p className={"schedule-button" + (availability().has("12:30") ? " selected" : " unselected")} onClick={() => setAvailability("12:30")}>12:30 pm</p>
                                <p className={"schedule-button" + (availability().has("12:45") ? " selected" : " unselected")} onClick={() => setAvailability("12:45")}>12:45 pm</p>
                            </div>
                            {afternoon}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

class ScheduleCreator extends Component {
    constructor(props) {
        super(props);
        this.days = this.days.bind(this)
        this.availability = this.availability.bind(this)
        this.setDays = this.setDays.bind(this)
        this.setAvailability = this.setAvailability.bind(this)
        this.state = {
            days: [0,0,0,0,0,0,0],
            availability: [new Set(), new Set(), new Set(), new Set(), new Set(), new Set(), new Set()],
        }
    }

    days() {
        return this.state.days
    }

    availability(num) {
        return this.state.availability[num]
    }

    setDays(day, num) {
        console.log(num)
        let days = this.state.days
        if (days[day] === num) {
            days[day] = 0
        } else {
            days[day] = num
        }
        this.setState({
            days: days
        })
    }

    setAvailability(num, time) {
        console.log(time)
        let availability = this.state.availability
        if (availability[num].has(time)) {
            console.log(availability)
            availability[num].delete(time)
            console.log(availability[num].has(time))
        } else {
            availability[num].add(time)
        }
        this.setState({
            availability: availability
        })
    }

    render() {
        return (
            <div>
                <h1>Edit your Availability</h1>
                <ScheduleCreatorWidget num={1} days={this.days} availability={() => this.availability(0)} setDays={(day) => this.setDays(day, 1)} setAvailability={(time) => this.setAvailability(0, time)}/>
                <ScheduleCreatorWidget num={2} days={this.days} availability={() => this.availability(1)} setDays={(day) => this.setDays(day, 2)} setAvailability={(time) => this.setAvailability(1, time)}/>
                <ScheduleCreatorWidget num={3} days={this.days} availability={() => this.availability(2)} setDays={(day) => this.setDays(day, 3)} setAvailability={(time) => this.setAvailability(2, time)}/>
                <ScheduleCreatorWidget num={4} days={this.days} availability={() => this.availability(3)} setDays={(day) => this.setDays(day, 4)} setAvailability={(time) => this.setAvailability(3, time)}/>
                <ScheduleCreatorWidget num={5} days={this.days} availability={() => this.availability(4)} setDays={(day) => this.setDays(day, 5)} setAvailability={(time) => this.setAvailability(4, time)}/>
                <ScheduleCreatorWidget num={6} days={this.days} availability={() => this.availability(5)} setDays={(day) => this.setDays(day, 6)} setAvailability={(time) => this.setAvailability(5, time)}/>
                <ScheduleCreatorWidget num={7} days={this.days} availability={() => this.availability(6)} setDays={(day) => this.setDays(day, 7)} setAvailability={(time) => this.setAvailability(6, time)}/>
            </div>
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
            <ScheduleCreator/>
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