<script setup lang="ts">
import { navigation } from '@/utils/navigation';
import { getAuth, signOut } from 'firebase/auth';


const { user, role, fetchUserRole } = useAuthUser();
const auth = getAuth();

// Pobranie roli użytkownika na montowanie komponentu
onMounted(async () => {
  await fetchUserRole();
  console.log('Rola użytkownika:', role.value);
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
  
  <ClientOnly>

    <UHeader>
      <template #logo>
        <UButton to="/" size="xl" target="_blank" icon="mdi:radar" color="primary" variant="ghost" label="ASG Radar"  />
      </template>

      <template #center>
        <UHeaderLinks :links="filteredNavigation" />
      </template>

      <template #right>
      <div class="user-section">
        <div v-if="user" >
          <span class="mr-1.5">Witaj, {{ user.displayName || user.email || 'Użytkowniku' }}!</span>
          <UButton @click="handleLogout" to="/" color="primary" variant="ghost" size="sm">Wyloguj</UButton>
        </div>
        <div v-else>
          <NuxtLink class="link" to="/login">Zaloguj się</NuxtLink>
        </div>
      </div>
      <UColorModeButton />
      </template>

      </UHeader> 
  </ClientOnly>

  <div class="layout">
    <slot />
  </div>
</template>

<style scoped lang="scss">
@use "/assets/styles/colors";

.layout {
  margin: 0 30px;
}


.user-section span {
  color: colors.$green-medium;
  font-size: 12pt;
}


</style>
