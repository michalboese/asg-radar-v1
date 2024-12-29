<script setup lang="ts">
const user = useCurrentUser()
console.log('user')
console.log(user)

</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="scss">
@use "assets/styles/global.scss";
</style>
