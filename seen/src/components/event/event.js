import React, { Component } from 'react'
import { getAllEvents, getAllAps } from '../../api/index';
import EventList from './EventList'
import './event.css'

export default class event extends Component {

    state = {
        Events: [],
        Aps: [],
        filter: ""
    }

    componentDidMount() {
        getAllEvents()
        .then(res => {
            this.setState({
                Events: res.data, filter: "---" });
        })
        getAllAps()
            .then(res => {
                this.setState({
                    Aps: res.data
                });
            })
    }

    onChange = (event) => {

        this.setState({ filter: event.target.value });

    }

    render() {
        console.log("Renderizando");
        
        return(
            <div className="generalBox">
                <div className="pageTitle">
                    Events
                </div>
                
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Filter: 
                        <select value={this.state.filter} onChange={this.onChange}>
                            <option value="---">---</option>
                            <option value="Normal">Normal</option>
                            <option value="Blocked">Blocked</option>
                            <option value="PBlocked">Partially Blocked</option>
                            <option value="Vulnerable">Vulnerable</option>
                            <option value="Suspect">Suspect</option>
                            <option value="Cloned">Cloned</option>

                        </select>
                    </label>
                </form>

                {/* <div className="eventList">
                    { listEvents }
                </div> */}

                <EventList filter={this.state.filter} Events={this.state.Events.filter(event => {
                       if (this.state.filter === "---") {
                            return true;
                        } else {
                            return event.eventType === this.state.filter;
                        }
                        })}
                        Aps={this.state.Aps}
                ></EventList>
        
            </div>
        )
        
        
        // return this.state.Events.map(event => (
        //     <EventCard event={event}/>
        // ));
    }
}
