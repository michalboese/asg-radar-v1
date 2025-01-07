<script setup lang="ts">
import type { Organizer } from '@/stores/organizersStore';
import { useEventsStore } from '@/stores/eventsStore';
import { useOrganizersStore } from '@/stores/organizersStore';

const eventsStore = useEventsStore();
await eventsStore.fetchEvents();

const organizersStore = useOrganizersStore();
await organizersStore.fetchOrganizers();

definePageMeta({
  layout: 'default'
})

const organizerSlug = useParam('organizer');

const organizer = computed(() =>
  organizersStore.organizers.find((o) => o.slug === organizerSlug) || {} as Organizer
);

const organizerState = useOrganizerState();

const sortedEvents = computed(() => {
  return eventsStore.events
    .filter(event => event.organizerId === organizerSlug)
    .sort((a, b) => new Date(a.date.toDate()).getTime() - new Date(b.date.toDate()).getTime())
});

if (organizer.value) {
  organizerState.value = {
    name: organizer.value.name,
    slug: organizer.value.slug,
  }
}
</script>

<template>
    <main>
      <div v-if="organizersStore.isLoading" class="loading-spinner"></div>
      <template v-else>
        <h1 class="mt-10">Wydarzenia organizatora: {{ organizer.name }}</h1>
        <div class="events">
          <EventCard
            v-for="event in sortedEvents"
            :key="event.id"
            :event="event"
            :organizer="organizer"
          />
        </div>
      </template>
    </main>
  </template>

  <style scoped lang="scss">
  @use "@/assets/styles/colors.scss";

  .events {
    display: flex;  
    flex-direction: column;
    margin: auto;
    margin-top: 20px;
    margin-bottom: 100px;
    gap: 20px;
    width: 900px;
}
</style>