<script setup lang="ts">
import type { Event } from '@/data/events';
import { getEventsUrl } from '@/data/events';

const { data: events } = await useFetch<Event[]>(getEventsUrl());
</script>

<template>
  <main>
    <h1>ASG Radar</h1>
    <div>
      <EventCard v-for="event in events" :key="event.id" :event="event" />
    </div>
  </main>
</template>