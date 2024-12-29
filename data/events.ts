import { useCollection, useFirestore } from 'vuefire'
import { collection } from 'firebase/firestore'
import type { Timestamp } from 'firebase-admin/firestore'
export interface Event {
    id: string,
    organizerId: string,
    title: string,
    intro: string,
    description: string,
    date: Timestamp
}

export const getEvents = () => {
  const eventsRef = collection(useFirestore(), 'events')
  const events = useCollection<Event>(eventsRef)

  console.log('events')
  console.log(events.data.value)
  return events.data
}
