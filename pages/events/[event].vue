<script setup lang="ts">
import type { Event } from '@/stores/eventsStore'
import { useEventsStore } from '@/stores/eventsStore'

const eventsStore = useEventsStore();
await eventsStore.fetchEvents();

const organizersStore = useOrganizersStore();
await organizersStore.fetchOrganizers();

definePageMeta({
  layout: 'breadcrumb',
})

const eventSlug = useParam('event')

const event = computed(() =>
eventsStore.events.find((o) => o.id === eventSlug) || {} as Event
);

const organizer = computed(() =>
organizersStore.organizers.find((o) => o.slug === event.value.organizerId) || {} as Organizer
);

const organizerSlug = useOrganizerState()

if (event.value) {
    organizerSlug.value = {
      name: organizer.value.name,
      slug: organizer.value.slug,
    }
}
</script>

<template>
    <main>
      <div v-if="organizersStore.isLoading" class="loading-spinner"></div>
      <template v-else>
        <h1>
          {{ event.title }}
          <OrganizerLink :organizer="organizer" />
        </h1>
        <RenderMarkdown :source="event.description" />
        <br>  
        <br>  
        <h2>{{ event.date.toDate().toLocaleDateString() }}</h2>
      </template>
    </main>
  </template>