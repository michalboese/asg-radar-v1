<script setup lang="ts">
import { useUsersStore } from '@/stores/usersStore';
import { useOrganizersStore } from '@/stores/organizersStore';

const organizersStore = useOrganizersStore();
await organizersStore.fetchOrganizers();

const usersStore = useUsersStore();
const emailQuery = ref('');
const selectedUserId = ref<string | null>(null);
const newRole = ref<'user' | 'organizer' | 'admin'>('user');
const successMessage = ref('');
const errorMessage = ref('');
const isOpen = ref(false)

const roles = ['user', 'organizer', 'admin'];

// Pobieranie użytkowników podczas montowania komponentu
onMounted(async () => {
  await usersStore.fetchAllUsers();
});

// Filtrowanie użytkowników po emailu i sortowanie po emailu
const filteredUsers = computed(() =>
  usersStore.users
    .filter(user =>
      user.email.toLowerCase().includes(emailQuery.value.toLowerCase())
    )
    .sort((a, b) => a.email.localeCompare(b.email))
);

// Aktualizacja roli użytkownika
const updateRole = async () => {
  if (!selectedUserId.value) return;
  try {
    if (newRole.value === 'organizer')
    {
      const selectedUser = usersStore.users.find((user) => user.id === selectedUserId.value);
      const existingOrganizer = organizersStore.organizers.find((org) => org.email === selectedUser?.email)

      if (existingOrganizer){
        throw new Error('Użytkownik jest już organizatorem');
      }

    }

    if (newRole.value === 'user')
    {
      const selectedUser = usersStore.users.find((user) => user.id === selectedUserId.value);
      const existingOrganizer = organizersStore.organizers.find((org) => org.email === selectedUser?.email)

      if (existingOrganizer){
        if (selectedUser?.email) {
          await organizersStore.deleteOrganizerByEmail(selectedUser.email);
        }
      }
    }

    await usersStore.updateUserRole(selectedUserId.value, newRole.value);
    successMessage.value = 'Rola użytkownika została zaktualizowana';
    isOpen.value = true;
  } catch (err) {
    errorMessage.value = (err as Error).message;
    isOpen.value = true;
  }
};
</script>

<template>
  <UPage class="w=fit-content mx-auto">
    <template #left>
    <UAside>
      <div v-if="selectedUserId" class="update-role  ml-6">
        <h2 class="mt-10 mx-auto">Zmień rolę użytkownika</h2>
        <USelect v-model="newRole" :options="roles" class="mt-4 w-1/2" />
        <UButton @click="updateRole" label="Zmień rolę" class="mt-4"/>
      </div>
    </UAside> 
    </template>

    <h1 class="mt-4 text-center">Panel administratora</h1>

    <UInput
      v-model="emailQuery"
      id="emailQuery"
      type="email"
      placeholder="Wyszukaj użytkownika po emailu"
      class="mt-4 w-1/2 mx-auto"
      size="lg"
    />

    <!-- Lista użytkowników -->
    <div v-if="filteredUsers.length > 0" class="mt-4 text-center">

      <UButton
      v-for="user in filteredUsers"
      :color="user.id === selectedUserId ? 'primary' : 'white'"
      :key="user.id"
      :variant="user.id === selectedUserId ? 'solid' : 'outline'"
      @click="selectedUserId = user.id ?? null"
      class="mt-6 mx-auto w-4/5"
      size="xl"
      >
      <strong>Email:</strong> {{ user.email }} |
      <strong>Pseudonim:</strong> {{ user.nickname }} |
      <strong>Imię:</strong> {{ user.firstName }} |
      <strong>Nazwisko:</strong> {{ user.lastName }} |
      <strong>Rola:</strong> {{ user.role }}
      </UButton>
      <!-- Fake users for testing -->
      <UButton
        v-for="user in 30"
        :key="user"
        color="white"
        variant="outline"
        class="mt-6 mx-auto w-4/5"
        size="xl"
      >
        <strong>Email:</strong> user{{ user }}@example.com |
        <strong>Pseudonim:</strong> nickname{{ user }} |
        <strong>Imię:</strong> FirstName{{ user }} |
        <strong>Nazwisko:</strong> LastName{{ user }} |
        <strong>Rola:</strong> user
      </UButton>

    </div>

    <div v-else>
      <p class="mt-4">Nie znaleziono użytkowników</p>
    </div>

</UPage>


<UModal v-model="isOpen" @close="() => { successMessage = ''; errorMessage = ''; }">
  <UPageCard v-if="errorMessage"
    title="Błąd!"
    :description="errorMessage"
    icon="i-heroicons-exclamation-circle"
  />
  <UPageCard v-if="successMessage"
    title="Sukces!"
    :description="successMessage"
    icon="i-heroicons-check-circle"
  />
</UModal>
</template>

