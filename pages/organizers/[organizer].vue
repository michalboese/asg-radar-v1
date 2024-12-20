<script setup lang="ts">
import type { OrganizerDetails } from '@/data/organizers';
import { getOrganizerDetailsUrl } from '@/data/organizers';
import { useOrganizerState } from '~/composables/useOrganizerState';

definePageMeta({
  layout: 'breadcrumb'
})

const organizerSlug = useParam('organizer');

const { data: organizer } = await useFetch<OrganizerDetails>(getOrganizerDetailsUrl(organizerSlug));

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
      <template v-if="organizer">
        <h1>Organizator: {{ organizer.name }}</h1>
        <div>
          <EventCard
            v-for="event in organizer.events"
            :key="event.id"
            :event="event"
          />
        </div>
      </template>
    </main>
  </template>