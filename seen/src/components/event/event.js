import React, { Component } from 'react'
import { getAllEvents } from '../../api/index';
import EventCard from './EventCard';
import './event.css'

export default class event extends Component {

    state = {
        Events: []
    }

    componentDidMount() {
        getAllEvents()
        .then(res => {
            this.setState({ Events: res.data });
        })
    }

    render() {
        const listEvents = this.state.Events.splice(0).reverse().map(event => (
            <EventCard event={event} />))

        return(
            <div className="generalBox">
                <div className="pageTitle">
                    Events
                </div>

                <div className="eventList">
                    { listEvents }
                </div>
        
            </div>
        )
        
        
        // return this.state.Events.map(event => (
        //     <EventCard event={event}/>
        // ));
    }
}
