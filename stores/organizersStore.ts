import { collection, getDocs } from 'firebase/firestore';

export interface Organizer {
  id: string;
  slug: string;
  name: string;
  email: string;
  count: number;
}

export const useOrganizersStore = defineStore('organizers', {
  state: () => ({
    organizers: [] as Organizer[],
    isLoading: false,
  }),

  actions: {
    async fetchOrganizers() {
      this.isLoading = true;
      try {
        const organizersRef = collection(useFirestore(), 'organizers');
        const snapshot = await getDocs(organizersRef);
        this.organizers = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Organizer[];
      } catch (error) {
        console.error('Error fetching organizers:', error);
      } finally {
        this.isLoading = false;
      }
    },

    async findOrganizerByEmail(email: string): Promise<Organizer | null> {
      const organizer = this.organizers.find((org) => org.email === email);
      return organizer || null;
    },
  },

  getters: {
    getOrganizerById: (state) => (id: string) =>
      state.organizers.find((organizer) => organizer.id === id),
  },
});