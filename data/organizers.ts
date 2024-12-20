import type { Event } from './events'

export interface Organizer {
    id: string,
    slug: string,
    name: string,
    count: number
}

export interface OrganizerDetails {
    id: string,
    slug: string,
    name: string,
    events: Event[]
}

export const getOrganizersUrl = () => (
    'http://localhost:3001/organizers'
  )

export const getOrganizerDetailsUrl = (organizerSlug: string) => (
    `http://localhost:3001/organizers/${organizerSlug}?_embed=events`
)