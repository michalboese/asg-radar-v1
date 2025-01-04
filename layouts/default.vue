<script setup lang="ts">
import { useAuthUser } from '@/composables/useAuthUser';
import { navigation } from '@/utils/navigation';
import { getAuth, signOut } from 'firebase/auth';

const { user, role, fetchUserRole } = useAuthUser();
const auth = getAuth();

// Pobranie roli użytkownika na montowanie komponentu
onMounted(async () => {
  await fetchUserRole();
});

// Wylogowanie użytkownika
const handleLogout = async () => {
  try {
    await signOut(auth);
    console.log('Wylogowano pomyślnie');
  } catch (error) {
    console.error('Błąd podczas wylogowywania:', error);
  }
};

// Filtruj elementy nawigacji na podstawie roli użytkownika
const filteredNavigation = computed(() =>
  navigation.filter((item) => role.value && item.roles.includes(role.value))
);
</script>

<template>
  <div class="layout">
    <nav class="nav">
      <ul>
        <!-- Dynamiczne generowanie elementów nawigacji -->
        <li v-for="item in filteredNavigation" :key="item.path">
          <NuxtLink
            class="link"
            :class="{ current: $route.path === item.path }"
            :to="item.path"
          >
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>

      <!-- Informacje o użytkowniku -->
      <ClientOnly>
        <div class="user-section">
          <div v-if="user" >
            <span class="mr-5">Witaj, {{ user.displayName || user.email || 'Użytkowniku' }}!</span>
            <button @click="handleLogout" class="link">Wyloguj</button>
          </div>
          <div v-else>
            <NuxtLink class="link" to="/login">Zaloguj się</NuxtLink>
          </div>
        </div>
      </ClientOnly>
    </nav>
    <slot />
  </div>
</template>

<style scoped lang="scss">
@use "/assets/styles/colors";

.layout {
  margin: 20px;
}

.nav {
  margin-top: 10px;
  margin-bottom: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav ul {
  display: flex;
  gap: 20px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav .link {
  color: colors.$green-medium;
  font-size: 14pt;
  text-decoration: none;
}

.nav .link:hover {
  color: colors.$green-light;
}

.nav .link.current {
  color: colors.$green-light;
  text-decoration: underline;
  pointer-events: none;
}

.user-section {
  display: flex;
  gap: 10px;
  align-items: center;
}

.user-section span {
  color: colors.$green-medium;
  font-size: 14pt;
}

.user-section .link {
  color: colors.$green-medium;
  cursor: pointer;
  font-size: 14pt;
}

.user-section .link:hover {
  color: colors.$green-light;
}
</style>
