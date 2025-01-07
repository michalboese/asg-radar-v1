import { collection, getDocs, updateDoc, arrayUnion, doc, addDoc } from 'firebase/firestore';
import type { Timestamp } from 'firebase-admin/firestore'
import { useOrganizersStore } from '@/stores/organizersStore';

export interface Event {
  id?: string;
  organizerId: string;
  title: string;
  intro: string;
  description: string;
  date: Timestamp;
  location: {
      address: string;
      city: string;
      postalCode: string;
      coordinates: {
          lat: number;
          lng: number;
      };
  };
  maxParticipants: number;
  participants: string[];
  status: 'zaplanowane' | 'w trakcie' | 'zakończone' | 'odwołane';
  images: string[];
  price: number;
  duration: {
      start: string;
      end: string;
  };
  contact: {
      email: string;
      phone?: string;
  };
}
export const useEventsStore = defineStore('events', {
  state: () => ({
    events: [] as Event[],
    isLoading: false,
  }),

  actions: {
    async fetchEvents() {
      this.isLoading = true;
      try {
        const eventsRef = collection(useFirestore(), 'events');
        const snapshot = await getDocs(eventsRef);
        this.events = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Event[];
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    getEventById(id: string) {
      return this.events.find((event) => event.id === id);
    },

    async joinEvent(eventId: string, userId: string) {
      const event = this.getEventById(eventId);
      if (!event || event.participants.includes(userId)) {
        throw new Error('Cannot join this event');
      }
      const docRef = doc(useFirestore(), 'events', eventId);
      await updateDoc(docRef, {
        participants: arrayUnion(userId),
      });
      event.participants.push(userId);
    },

    async leaveEvent(eventId: string, userId: string) {
      const event = this.getEventById(eventId);
      if (!event || !event.participants.includes(userId)) {
        throw new Error('Cannot leave this event');
      }
      const docRef = doc(useFirestore(), 'events', eventId);
      await updateDoc(docRef, {
        participants: event.participants.filter((id) => id !== userId),
      });
      event.participants = event.participants.filter((id) => id !== userId);
    },

    async addEvent(newEvent: Omit<Event, 'id'>) {
      try {
        const eventsRef = collection(useFirestore(), 'events');
        const docRef = await addDoc(eventsRef, newEvent);
        // Dodaj wydarzenie do stanu
        this.events.push({
          id: docRef.id,
          ...newEvent,
        } as Event);

        // Increment the organizer's event count
        const organizersStore = useOrganizersStore();
        console.log('Incrementing event count for organizer:', newEvent.organizerId);
        await organizersStore.incrementOrganizerEventCount(newEvent.organizerId);
      } catch (error) {
        console.error('Error adding event:', error);
        throw new Error('Nie udało się dodać wydarzenia');
      }
    },

    async saveEvent(event: Event) {
      if (!event.id) {
        throw new Error('Event ID is required to save the event');
      }
      const docRef = doc(useFirestore(), 'events', event.id);
      await updateDoc(docRef, { ...event });
    }
  },

  getters: {
    getEventsByOrganizer: (state) => (organizerId: string) =>
      state.events.filter((event) => event.organizerId === organizerId),
  },
});

