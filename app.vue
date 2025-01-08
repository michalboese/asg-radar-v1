<script setup lang="ts">
const user = useCurrentUser()

const links = [{
  label: 'Znajdź coś dla siebie'
}]

</script>

<template>

 <UMain>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UMain>

  <UFooter :links="links" class="mb-4 mt-8">
    <template #left>
      Copyright © {{ new Date().getFullYear() }} ASG Radar
    </template>

    <template #right>
      <UButton icon="i-simple-icons-x" color="gray" variant="ghost" target="_blank" />
      <UButton icon="i-simple-icons-discord" color="gray" variant="ghost" target="_blank" />
      <UButton icon="i-simple-icons-github" color="gray" variant="ghost" target="_blank" />
    </template>
  </UFooter>
</template>

<style lang="scss">
@use "assets/styles/global.scss";

</style>
