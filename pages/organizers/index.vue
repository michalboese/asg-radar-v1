<script setup lang="ts">
import type { Organizer } from '@/data/organizers'
import { getOrganizersUrl } from '@/data/organizers'

const { data: organizers } = await useFetch<Organizer[]>(
    getOrganizersUrl()
)
</script>

<template>
    <main>
        <h1>Wybierz organizatora</h1>
        <NuxtLink
            v-for="organizer in organizers"
            :key="organizer.id"
            :to="`/organizers/${organizer.slug}`"
            class="organizerItem"
        >
            <span class="text">
                {{ organizer.name }} - {{ organizer.count }}
            </span>
        </NuxtLink>
    </main>
</template>

<style scoped lang="scss">
@use '@/assets/styles/colors.scss';

.organizerItem {
  color: colors.$green-medium;
  text-align: center;
  padding: 30px 0px;
  border: 1px solid colors.$green-dark;
  border-bottom: none;
  margin-bottom: 10px;
  display: block;
  position: relative;
}

.organizerItem:hover {
  color: colors.$green-light;
  border-color: colors.$green-medium;
}

.organizerItem .text {
  font-size: 20pt;
  font-weight: 300;
}
</style>