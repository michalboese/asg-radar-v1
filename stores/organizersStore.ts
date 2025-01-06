import { collection, getDocs, addDoc } from 'firebase/firestore';

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

    async createOrganizer(email: string, nickName: string): Promise<void> {
      this.isLoading = true;
      try {
        const slug = nickName.toLowerCase().replace(/\s+/g, '-');
        const newOrganizer: Omit<Organizer, 'id'> = {
          slug,
          name: nickName,
          email,
          count: 0,
        };
        
        const organizersRef = collection(useFirestore(), 'organizers');
        const docRef = await addDoc(organizersRef, newOrganizer);

        this.organizers.push({ id: docRef.id, ...newOrganizer });
      } catch (error) {
        console.error('Error creating organizer:', error);
      } finally {
        this.isLoading = false;
      }
    },
  },

  getters: {
    getOrganizerById: (state) => (id: string) =>
      state.organizers.find((organizer) => organizer.id === id),
  },
});