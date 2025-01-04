import { collection, getDocs, updateDoc, arrayUnion, doc, addDoc } from 'firebase/firestore';
import type { Timestamp } from 'firebase-admin/firestore'

export interface Event {
  id: string;
  organizerId: string;
  title: string;
  intro: string;
  description: string;
  date: Timestamp;
  location: {
      address: string;
      city: string;
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
      start: Timestamp;
      end: Timestamp;
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

    async addEvent(newEvent: Omit<Event, 'id'>) {
      try {
        const eventsRef = collection(useFirestore(), 'events');
        const docRef = await addDoc(eventsRef, newEvent);
        // Dodaj wydarzenie do stanu
        this.events.push({
          id: docRef.id,
          ...newEvent,
        } as Event);
      } catch (error) {
        console.error('Error adding event:', error);
        throw new Error('Nie udało się dodać wydarzenia');
      }
    },
  },

  getters: {
    getEventsByOrganizer: (state) => (organizerId: string) =>
      state.events.filter((event) => event.organizerId === organizerId),
  },
});

