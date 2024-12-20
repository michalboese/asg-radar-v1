<script setup lang="ts">
import type { EventDetails } from '@/data/events'
import { getEventDetailsUrl } from '@/data/events'

definePageMeta({
  layout: 'breadcrumb',
})

const eventSlut = useParam('event')

const { data: event } = await useFetch<EventDetails>(getEventDetailsUrl(eventSlut))

const organizerSlug = useOrganizerState()

if (event.value) {
    organizerSlug.value = {
        name: event.value.organizer.name,
        slug: event.value.organizer.slug,
    }
}
</script>

<template>
    <main>
      <template v-if="event">
        <h1>
          {{ event.title }}
          <OrganizerLink :organizer="event.organizer" />
        </h1>
        <RenderMarkdown :source="event.description" />
        <br>  
        <br>  
        <h2>{{ event.date }}</h2>
      </template>
    </main>
  </template>