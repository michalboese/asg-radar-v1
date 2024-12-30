<script setup>
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
const user = ref(null);

onMounted(() => {
  if (typeof window !== 'undefined') {
    const auth = getAuth(); // Pobierz instancję Firebase Auth
    onAuthStateChanged(auth, (authUser) => {
      user.value = authUser ? authUser.displayName || authUser.email : null;
    });
  }
});

const handleLogout = async () => {
  try {
    const auth = getAuth(); // Pobierz instancję Firebase Auth
    await signOut(auth); // Wyloguj użytkownika
    user.value = null;
    console.log('Wylogowano pomyślnie');
  } catch (error) {
    console.error('Błąd podczas wylogowywania:', error);
  }
};
</script>

<template>
  <div class="layout">
    <nav class="nav">
      <NuxtLink class="link" :class="{ current: $route.path === '/' }" to="/">
        Home
      </NuxtLink>

      <NuxtLink
        class="link"
        :class="{ current: $route.path === '/organizers' }"
        to="/organizers"
      >
        Organizatorzy
      </NuxtLink>

      <NuxtLink
        class="link"
        :class="{ current: $route.path === '/profile/1' }"
        to="/profile/1"
      >
        Profil
      </NuxtLink>
      <ClientOnly>
        <div class="link user" v-if="user">
          <div class="user">
            <span>Witaj, {{ user }}!</span>
          </div>
          <div class="link"><button @click="handleLogout">Wyloguj</button></div>
        </div>
        <div class="link user" v-else>
          <div class="link"><a href="/login">Zaloguj się</a></div>
          <div class="link"><a href="/register">Zarejestruj się</a></div> 
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
  position: relative;
}

.nav .link {
  color: colors.$green-medium;
  display: inline-block;
  font-size: 14pt;
  margin-right: 20px;
}

.nav .link:hover {
  color: colors.$green-light;
}

.nav .user {
  color: colors.$green-medium;
  display: inline-block;
  font-size: 14pt;
  margin-right: 20px;
  cursor: default;
}

.nav .user:hover {
  color: colors.$green-light;
}

.nav .link.current {
  color: colors.$green-light;
  text-decoration: underline;
  pointer-events: none;
}

.user {
  margin-right: 0 !important;
  float: right;
}

</style>
