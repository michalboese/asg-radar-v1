<script setup lang="ts">
import type { Organizer } from '@/stores/organizersStore';
import { useEventsStore } from '@/stores/eventsStore';
import { useOrganizersStore } from '@/stores/organizersStore';

const eventsStore = useEventsStore();
await eventsStore.fetchEvents();

const organizersStore = useOrganizersStore();
await organizersStore.fetchOrganizers();

definePageMeta({
  layout: 'breadcrumb'
})

const organizerSlug = useParam('organizer');

const organizer = computed(() =>
  organizersStore.organizers.find((o) => o.slug === organizerSlug) || {} as Organizer
);

const organizerState = useOrganizerState();

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
        <h1>Organizator: {{ organizer.name }}</h1>
        <div>
          <EventCard
            v-for="event in eventsStore.events.filter((e) => e.organizerId === organizer.slug)"
            :key="event.id"
            :event="event"
            :organizer="organizer"
          />
        </div>
      </template>
    </main>
  </template>