<script setup lang="ts">
import type { Event } from '@/stores/eventsStore'
import type { Filter } from '@/data/filters'
import type { Organizer } from '@/stores/organizersStore'
import { useEventsStore } from '@/stores/eventsStore';
import { useOrganizersStore } from '@/stores/organizersStore';

const eventsStore = useEventsStore();
await eventsStore.fetchEvents();

const organizersStore = useOrganizersStore();
await organizersStore.fetchOrganizers();

const filters = ref<Filter>({})

const filteredEvents = computed(() =>
  eventsStore.events.filter((event: Event) => {
    const matchesTitle = filters.value.title
      ? event.title.toLowerCase().includes(filters.value.title.toLowerCase())
      : true
    const matchesOrganizer = filters.value.organizerName
      ? event.organizerId
        .toLowerCase()
        .includes(filters.value.organizerName.toLowerCase())
      : true

    return matchesTitle && matchesOrganizer
  })
)

const handleFilterChange = (newFilters: Filter) => {
  filters.value = newFilters
}
</script>

<template>
  <main>
    <h1>ASG Radar</h1>
    <div v-if="organizersStore.isLoading" class="loading-spinner"></div>
    <div v-else class="grid">
      <div class="filters">
        <MainFilters @filter-change="handleFilterChange" />
      </div>
      <div class="events">
        <EventCard
          v-for="event in filteredEvents"
          :key="event.id"
          :event="event"
          :organizer="organizersStore.organizers.find((o) => o.slug === event.organizerId) || {} as Organizer"
        />
      </div>
      <div></div>
    </div>
  </main>
</template>

<style scoped lang="scss">
@use "@/assets/styles/colors.scss";

.grid {
  display: grid;
  grid-template-columns: 400px 1fr 250px;
  gap: 20px;
  width: 100%;
}

.filters {
  padding: 15px;
  border: 1px solid colors.$green-dark;
  border-radius: 5px;
  grid-column: 1;
  height: fit-content;
}

.events {
  display: grid;
  gap: 20px;
  grid-column: 2;
}
</style>
