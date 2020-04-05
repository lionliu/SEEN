import React, { Component } from 'react'
import EventCard from './EventCard';


const eventListStyle = {
    
        padding: "0px",
        height: "100%",
        width: "100%",
        margin:" 0px auto 0px auto",
        overflow: "hidden",
        listStyle: "none"

}

export default class EventList extends Component {
    
    render() {

        const { Events } = this.props;

        const listEvents = Events.splice(0).reverse().map(event => (
            <EventCard key={event.timestamp} event={event} />))

        return (
            <div style={eventListStyle}>
                { listEvents }
            </div>
        )
    }
}
