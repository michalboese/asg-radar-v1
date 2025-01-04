<script setup lang="ts">
import { useUsersStore } from '@/stores/usersStore';

const usersStore = useUsersStore();
const emailQuery = ref('');
const selectedUserId = ref<string | null>(null);
const newRole = ref<'user' | 'organizer' | 'admin'>('user');
const successMessage = ref('');
const errorMessage = ref('');

// Pobieranie użytkowników podczas montowania komponentu
onMounted(async () => {
  await usersStore.fetchAllUsers();
});

// Filtrowanie użytkowników po emailu
const filteredUsers = computed(() =>
  usersStore.users.filter(user =>
    user.email.toLowerCase().includes(emailQuery.value.toLowerCase())
  )
);

// Aktualizacja roli użytkownika
const updateRole = async () => {
  if (!selectedUserId.value) return;

  try {
    await usersStore.updateUserRole(selectedUserId.value, newRole.value);
    successMessage.value = 'Rola użytkownika została zaktualizowana';
  } catch (err) {
    errorMessage.value = 'Nie udało się zaktualizować roli użytkownika';
  }
};
</script>

<template>
  <div class="admin-page">
    <h1>Panel administratora</h1>

    <!-- Wyszukiwanie użytkowników -->
    <div>
      <label for="emailQuery">Wprowadź email do wyszukiwania:</label>
      <input
        v-model="emailQuery"
        id="emailQuery"
        type="email"
        placeholder="Wyszukaj użytkownika po emailu"
      />
    </div>

    <!-- Lista użytkowników -->
    <div v-if="filteredUsers.length > 0" class="user-list">
      <h2>Wyniki wyszukiwania</h2>
      <ul>
        <li
          v-for="user in filteredUsers"
          :key="user.id"
          @click="selectedUserId = user.id ?? null"
          :class="{ selected: user.id === selectedUserId }"
        >
          <strong>Email:</strong> {{ user.email }} |
          <strong>Nick:</strong> {{ user.nickname }} |
          <strong>Rola:</strong> {{ user.role }}
        </li>
      </ul>
    </div>

    <div v-else>
      <p>Nie znaleziono użytkowników</p>
    </div>

    <!-- Zmiana roli użytkownika -->
    <div v-if="selectedUserId" class="update-role">
      <h2>Zmień rolę użytkownika</h2>
      <select v-model="newRole">
        <option value="user">User</option>
        <option value="organizer">Organizer</option>
        <option value="admin">Admin</option>
      </select>
      <button @click="updateRole">Zmień rolę</button>
    </div>

    <!-- Komunikaty -->
    <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
    <div v-if="successMessage" class="success">{{ successMessage }}</div>
  </div>
</template>

<style scoped>
.admin-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

.user-list ul {
  list-style: none;
  padding: 0;
}

.user-list li {
  padding: 0.5rem;
  cursor: pointer;
  border: 1px solid #ccc;
  margin-bottom: 0.5rem;
  border-radius: 5px;
}

.user-list li.selected {
  background-color: #414141;
  border-color: #007bff;
}

.error {
  color: red;
  margin-top: 1rem;
}

.success {
  color: green;
  margin-top: 1rem;
}

label {
  display: block;
  margin: 0.5rem 0;
}
</style>
