import type { Organizer } from './organizers'

export interface Event {
    id: string,
    slug: string,
    organizer: Organizer,
    title: string,
    intro: string,
}

export interface EventDetails {
    id: string,
    slug: string,
    organizer: Organizer,
    title: string,
    description: string,
    date: string,   
}

export const getEventsUrl = () => (
    'http://localhost:3001/events'
)

export const getEventDetailsUrl = (eventSlug: string) => (
    `http://localhost:3001/eventDetails/${eventSlug}?_expand=organizer`
)

export const getEvents = async () => {
    const res = await fetch(getEventsUrl())
    return res.json()
}