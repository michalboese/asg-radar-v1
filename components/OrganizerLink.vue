<script setup lang="ts">
import type { Organizer } from '@/stores/organizersStore'

const { organizer } = defineProps<{ organizer: Organizer }>()
</script>

<template>
    <div class="organizer">
        <NuxtLink :to="`/organizers/${organizer.slug}`">Organizator: {{ organizer.name }}</NuxtLink>
    </div>
</template>

<style scoped lang="scss">
@use '@/assets/styles/colors.scss';

.organizer {
  display: block;
  margin: 15px 0px;
}

.organizer a {
  color: colors.$green-medium;
  border: 1px solid colors.$green-dark;
  border-radius: 5px;
  font-size: 12pt;
  padding: 5px 10px;
}

.organizer a:hover {
  color: colors.$green-light;
  border-color: colors.$green-medium;
}
</style>
