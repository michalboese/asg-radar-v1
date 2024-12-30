<script setup lang="ts">
import type { Organizer } from "@/stores/organizersStore";
import { useOrganizersStore } from '@/stores/organizersStore';

const organizersStore = useOrganizersStore();
await organizersStore.fetchOrganizers();

const organizerName = ref<string | null>(null);

const filteredOrganizers = computed(() =>
  organizersStore.organizers.filter((organizer) => {
    const matchesName = organizerName.value
      ? organizer.name.toLowerCase().includes(organizerName.value.toLowerCase())
      : true;

    return matchesName;
  })
);
</script>

<template>
  <div v-if="organizersStore.isLoading" class="loading-spinner"></div>
  <main v-else>
    <h1>
      Wyszukaj organizatora:
      <input
        type="text"
        v-model="organizerName"
        placeholder="Nazwa organizatora"
      />
    </h1>
    <NuxtLink
      v-for="organizer in filteredOrganizers"
      :key="organizer.id"
      :to="`/organizers/${organizer.slug}`"
      class="organizerItem"
    >
      <span class="text"> {{ organizer.name }} - {{ organizer.count }} </span>
    </NuxtLink>
  </main>
</template>

<style scoped lang="scss">
@use "@/assets/styles/colors.scss";

.organizerItem {
  color: colors.$green-medium;
  text-align: center;
  padding: 30px 0px;
  border: 1px solid colors.$green-dark;
  border-bottom: none;
  margin-bottom: 10px;
  display: block;
  position: relative;
  width: 480pt;
  margin: auto;
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
