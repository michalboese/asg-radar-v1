import { collection, getDocs } from 'firebase/firestore';
import type { Timestamp } from 'firebase-admin/firestore'

export interface Event {
  id: string,
  organizerId: string,
  title: string,
  intro: string,
  description: string,
  date: Timestamp
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
  },

  getters: {
    getEventsByOrganizer: (state) => (organizerId: string) =>
      state.events.filter((event) => event.organizerId === organizerId),
  },
});

