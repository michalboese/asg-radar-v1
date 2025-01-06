import { getAuth } from 'firebase/auth';
import { useUsersStore } from '@/stores/usersStore';

export const useAuthUser = () => {
  const auth = getAuth(); // Firebase Authentication
  const role = ref<string | null>(null); // Rola użytkownika
  const user = ref(auth.currentUser); // Zalogowany użytkownik

  // Pobieranie roli użytkownika z Firestore
  const fetchUserRole = async () => {
    const usersStore = useUsersStore();

    if (user.value) {
      try {
        role.value = await usersStore.getUserRole(user.value.uid);
        console.log('Rola użytkownika:', role.value);
      } catch (error) {
        console.error('Błąd podczas pobierania roli użytkownika:', error);
        role.value = null;
      }
    }
    else {
      console.log('Użytkownik niezalogowany');
      role.value = 'niezalogowany';
    }
  };

  // Nasłuchiwanie zmian użytkownika w Firebase Authentication
  auth.onAuthStateChanged(async (currentUser) => {
    user.value = currentUser;
    if (currentUser) {
      await fetchUserRole(); // Pobierz rolę użytkownika po zalogowaniu
    } else {
      role.value = null; // Wylogowany użytkownik nie ma roli
    }
  });

  return { user, role, fetchUserRole };
};