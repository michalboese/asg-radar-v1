<script setup>

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
      <ColorMode />
    </nav>
    <div class="slot">
      <slot />
    </div>
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

.slot {
  width: 520px;
  margin: 0px auto 50px;
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
