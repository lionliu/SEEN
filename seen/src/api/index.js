/*
    Connection with the api.
    Need to be running the backend first
*/

import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:5000/',
})

export const insertEvent = payload => api.post(`/events`, payload)
export const getAllEvents = () => api.get(`/events`)
export const getEventById = id => api.get(`/events/${id}`)

const apis = {
    insertEvent,
    getAllEvents,
    getEventById
}

export default apis
