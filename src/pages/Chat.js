import React, { Component } from 'react'
import {FiPaperclip, FiSend} from 'react-icons/fi'
import moment from 'moment'
import instance from '../helpers'
import logo from '../images/filler_icon.svg'
import profile from '../images/filler_profile.svg'

export default class Chat extends Component {
    constructor(props) {
        super(props)
        this.getChat = this.getChat.bind(this)
        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.submit = this.submit.bind(this)
        this.scroll = this.scroll.bind(this)
        this.mesRef = React.createRef();
        this.state = {
            order: [],
            convo: null,
            chat: []
        }
    }

    async componentDidMount() {
        try {
            let response = await instance({
                method: 'get',
                url: '/message/chat-order'
            })
            this.setState({order: response.data.order})
        } catch (err) {
            console.log(err)
        }
    }

    async getChat(bypass) {
        console.log(this.state.convo)
        console.log(this.state.order[this.state.convo].message)
        if (bypass || this.state.convo && this.state.order[this.state.convo].message) { //only if previous messages
            try {
                let response = await instance({
                    method: 'get',
                    url: '/message/get-chat/' + this.state.convo
                })
                this.setState({chat: response.data.chat, id: response.data.id}, this.scroll)
            } catch (err) {
                console.log(err)
            }
        } else {
            this.setState({chat: []})
        }
    }

    //currently doesn't work on the backend
    async markSeen(id) {
        console.log(id)
        try {
            await instance({
                method: 'put',
                url: '/message/mark-seen/' + id
            })
        } catch (err) {
            console.log(err)
        }
    }

    handleKeyDown(e) {
        if (e.key === 'Enter' && this.state.convo) {
            this.submit()
        }
    }

    async submit() {
        if (this.state.convo) {
            let message = document.getElementById('input').value
            if (message.length) {
                try {
                    await instance({
                        method: 'post',
                        url: '/message/send/' + this.state.convo,
                        data: {
                            message
                        }
                    })
                    this.getChat(true)
                } catch (err) {
                    console.log(err)
                }
            } 
            document.getElementById('input').value = ''
        }
    }

    scroll() {
        this.mesRef.current.scrollTop = this.mesRef.current.scrollHeight;
    }

    render() {
        let order = Object.values(this.state.order)
        let convos = order.filter(c => c.message)
        convos.sort((a,b) => {
            if (moment(a.message.time_sent).isBefore( moment(b.message.time_sent) )) {
                return 1
            }
            return -1
        })
        convos = convos.map((c,i) => {
            let d = c.details
            let m = c.message
            return (
                <div key={d.id} 
                    className={"convo" + (i !== convos.length-1 && convos[i+1].details.id !== this.state.convo ? " convo-border" : "") + (d.id === this.state.convo ? " convo-selected" : "")} 
                    onClick={() => {
                        if (!m.seen && m.sent_to == this.state.id) {
                            m.seen = true
                            this.markSeen(d.id)
                        }
                        this.setState({convo: d.id}, this.getChat)
                    }}> 
                    <img src={profile} alt="" className="practice-logo"/>
                    <div className="convo-info">
                        <p className="section-text bold">{(d.prefix ? d.prefix + " " : "") + d.first_name + " " + d.last_name + (d.suffix ? d.suffix + " " : "")}</p>
                        {d.name ? <p className="section-text">{d.name}</p> : <div></div>}
                    </div>
                    {!m.seen && m.sent_to == this.state.id ? <div className="unread-dot"/> : <div></div>}
                </div>
            )
        })
        let others = order.filter(c => !c.message)
        others = others.map((c, i) => {
            let d = c.details
            return (
                <div key={d.id} 
                    className={"convo" + (i !== others.length-1 && others[i+1].details.id !== this.state.convo ? " convo-border" : "") + (d.id === this.state.convo ? " convo-selected" : "")} 
                    onClick={() => this.setState({convo: d.id}, this.getChat)}>
                    <img src={profile} alt="" className="practice-logo"/>
                    <div className="convo-info">
                        <p className="section-text">{d.first_name + " " + d.last_name}</p>
                    </div>
                </div>
            )
        })
        let messages = this.state.chat.map(m => {
            let t = moment(m.time_sent)
            // let date = null
            // if (t.isSame(moment(), "day")) {
            //     date = "Today"
            // } else if (t.isSame(moment().subtract(1,"day"), "day")) {
            //     date = "Yesterday"
            // } else if (t.isSame(moment(), "week")) {
            //     date = t.format("ddd")
            // } else if (t.isSame(moment(), "year")) {
            //     date = t.format("M/D")
            // } else {
            //     date = t.format("M/D/YY")
            // }
            return (
                <div key={m.id} className={m.sent_by === this.state.id ? "convo-line right" : "convo-line left"}>
                    {/* {m.sent_by === this.state.id ? <div className="time-sent">{date} at {t.format("h:mm a")}</div> : <span></span>} */}
                    <div className={m.sent_by === this.state.id ? "convo-bubble convo-sent" : "convo-bubble convo-received"}>
                        <p className="convo-text">{m.message}</p>
                    </div>
                    {/* {m.sent_by !== this.state.id ? <div className="time-sent">{date} at {t.format("h:mm a")}</div> : <span></span>} */}
                </div>
            )
        })
        return (
            <div className="page">
                <div className="chat">
                    <div className="white-box chat-sidebar">
                        <div className="chats-section">
                            <h1 className="section-header bold">Conversations</h1>
                            {this.state.order ? convos : ""}
                        </div>
                        <div className="chats-section">
                            <h1 className="section-header bold">Your Providers</h1>
                            {this.state.order ? others : ""}
                        </div>
                    </div>
                    <div className="white-box chat-panel">
                        <div className="chat-messages" ref={this.mesRef}>
                            {messages}
                        </div>
                        <div className="chat-bar">
                            <textarea id="input" className="chat-input" placeholder="Send a message..." onKeyDown={this.handleKeyDown}/>
                            <FiPaperclip className="chat-icons"/>
                            <FiSend className="chat-icons" onClick={this.submit}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

