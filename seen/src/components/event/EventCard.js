import React, { Component } from 'react'
import './eventCard.css'

export default class EventCard extends Component {
    render() {

        const { eventType, targetAddrMac, timestamp } = this.props.event;

        return (
            // <li>
                <div className="card">
                    <div className="container">
                        <p>
                            Event: {eventType}
                        </p>
                        <p>
                            Target MAC: {targetAddrMac}
                        </p>
                        <p>
                            Timestamp: {timestamp}
                        </p>
                    </div>
                </div>
            // </li>
           
        )
    }
}
