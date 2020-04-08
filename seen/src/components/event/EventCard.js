import React, { Component } from 'react'
import './eventCard.css'

const macMap = require("../../mac.json")

const colorMapping = {
    "Blocked": "red",
    "PBlocked": "salmon",
    "Vulnerable": "yellow",
    "Suspect": "dimgray",
    "Cloned": "darkgreen",
    "Normal": "#fff"
}

const containerStyle = {
    padding: "2px 16px"
}

export default class EventCard extends Component {

    

    render() {

        const { eventType, targetAddrMac, timestamp } = this.props.event;
        const type = this.props.type;

        const cardStyle = {
            boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)",
            transition: "0.3s",
            borderRadius: "5px",
            display: "flex",
            justifyContent: 'center',
            alignItems: "center",
            backgroundColor: colorMapping[eventType],
            height: "100%",
            margin: "10px",
        }

        return (
                <div style={cardStyle}>
                    <div style={containerStyle}>
                        <p>
                            <b>Event:</b> {eventType}
                        </p>
                        <p>
                            <b>Target MAC:</b> {targetAddrMac}
                        </p>
                        <p>
                            <b>Manucfacter:</b> {macMap[targetAddrMac.substring(0, 8)] === undefined ? "Manufacturer not found." : macMap[targetAddrMac.substring(0, 8)]}
                        </p>
                        <p>
                            <b>Dispositive Type:</b> {type}
                        </p>
                        <p>
                            <b>Timestamp:</b> {timestamp}
                        </p>
                    </div>
                </div>
        )
    }
}
