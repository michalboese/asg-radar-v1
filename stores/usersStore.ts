import { collection, setDoc, getDocs, doc, Timestamp, getDoc, updateDoc } from 'firebase/firestore';
import { useOrganizersStore } from '@/stores/organizersStore';

// Typ użytkownika
export interface User {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    nickname: string;
    birthDate: Timestamp | null; // Firestore przechowuje daty jako Timestamp
    role: 'user' | 'organizer' | 'admin';
    createdAt?: Timestamp; // Data utworzenia w Firestore
  }
  
  // Typ stanu
  interface UsersState {
    users: User[];
    loading: boolean;
    error: string | null;
  }
  
  export const useUsersStore = defineStore('usersStore', {
    state: (): UsersState => ({
      users: [],
      loading: false,
      error: null,
    }),
  
    actions: {
      // Pobieranie użytkowników
      async fetchAllUsers(): Promise<void> {
        this.loading = true;
        this.error = null;
      
        try {
          const querySnapshot = await getDocs(collection(useFirestore(), 'users'));
          this.users = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              birthDate: data.birthDate?.toDate(),
              createdAt: data.createdAt?.toDate(),
            } as User;
          });
        } catch (err) {
          this.error = 'Błąd podczas pobierania użytkowników';
          console.error(err);
        } finally {
          this.loading = false;
        }
      },
  
      async addUser(user: Omit<User, 'id' | 'createdAt'>, uid: string): Promise<void> {
        this.loading = true;
        this.error = null;
      
        try {
          const newUser = {
            ...user,
            birthDate: user.birthDate ? Timestamp.fromDate(user.birthDate.toDate()) : null, // Konwersja na Timestamp
            createdAt: Timestamp.now(), // Automatyczne ustawienie Timestamp
          };
      
          await setDoc(doc(collection(useFirestore(), 'users'), uid), newUser);
      
          // Dodanie użytkownika do lokalnego stanu
          this.users.push({
            id: uid,
            ...newUser,
          });
        } catch (err) {
          this.error = 'Błąd podczas dodawania użytkownika do Firestore';
          console.error(err);
          throw err;
        } finally {
          this.loading = false;
        }
      },

      // Aktualizacja roli użytkownika
    async updateUserRole(userId: string, newRole: 'user' | 'organizer' | 'admin'): Promise<void> {
        this.loading = true;
        this.error = null;
  
        try {
          const userRef = doc(useFirestore(), 'users', userId);
          await updateDoc(userRef, { role: newRole });
          this.users = this.users.map((user) =>
            user.id === userId ? { ...user, role: newRole } : user,
          );
        if (newRole === 'organizer') {
          const user = this.users.find((u) => u.id === userId);
          console.log('user', user);
          if (user) {
            console.log('Tworzenie organizatora dla:', user.email);
            const organizersStore = useOrganizersStore();
            await organizersStore.createOrganizer(user.email, user.nickname);
          }
        }
        } catch (err) {
          this.error = 'Błąd podczas aktualizacji roli użytkownika';
          console.error(err);
        } finally {
          this.loading = false;
        }
      },

      // Pobieranie roli użytkownika
    async getUserRole(userId: string): Promise<string | null> {
        try {
            const userRef = doc(useFirestore(), 'users', userId);
            const userDoc = await getDoc(userRef);
            return userDoc.exists() ? (userDoc.data().role as string) : null;
        } catch (error) {
            console.error('Błąd podczas pobierania roli użytkownika:', error);
            return null;
        }
        },
        
    },
    
   getters: {
      // Filtrowanie użytkowników po roli
      getUsersByRole: (state) => (role: User['role']): User[] =>
        state.users.filter(user => user.role === role),
    },
  });