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

  const organizerState = useOrganizerState();
</script>

<template>
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
        :class="{ current: $route.path === '/events/addEvent' }"
        to="/events/addEvent"
      >
        Nowe wydarzenie
      </NuxtLink>

      <NuxtLink
        class="link"
        :class="{ current: $route.path === '/events/myEvents' }"
        to="/events/myEvents"
      >
        Moje wydarzenia
      </NuxtLink>
      <ColorMode />
  <ClientOnly>
    <div class="link user" v-if="user">
      <div class="user">
        <span>Witaj, {{ user }}!</span>
      </div>
      <div class="link"><button @click="handleLogout">Wyloguj</button></div>
    </div>
    <div class="link user" v-else>
      <div class="link"><a href="/login">Zaloguj się</a></div>
    </div>
  </ClientOnly>
  </nav>
    <div class="layout">
      <nav class="breadcrumb">
        <NuxtLink
          class="link"
          to="/"
        >
          Home
        </NuxtLink>
        ➤
        <NuxtLink
          class="link"
          to="/organizers"
        >
          Organizatorzy
        </NuxtLink>
        ➤
        <ClientOnly>
          <NuxtLink
            class="link"
            :to="`/organizers/${organizerState.slug}`"
          >
            Organizator: {{ organizerState.name }}
          </NuxtLink>
        </ClientOnly>
      </nav>
      <slot />
    </div>
  </template>

<style scoped lang="scss">
@use '@/assets/styles/colors.scss';

.nav {
  margin: 20px;
  margin-top: 20px;
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

.layout {
  width: 620px;
  margin: 0px auto 50px;
}

.breadcrumb {
  margin-top: 10px;
  margin-bottom: 30px;
  position: relative;
  font-size: 14pt;
  color: colors.$green-dark;
}

.breadcrumb .link {
  height: 28px;
  margin-right:5px;
  display: inline-block;
  color: colors.$green-medium;
}

.breadcrumb .link:hover {
  color: colors.$green-light;
  cursor: pointer;
}

.user {
  margin-right: 0 !important;
  float: right;
}
</style>
