<script setup lang="ts">
import type { Event } from '@/stores/eventsStore'
import type { Organizer } from '@/stores/organizersStore'
import { useEventsStore } from '@/stores/eventsStore';
import { useOrganizersStore } from '@/stores/organizersStore';
import { getAuth } from 'firebase/auth';

const currentUser = getAuth().currentUser;

const eventsStore = useEventsStore();
await eventsStore.fetchEvents();

const organizersStore = useOrganizersStore();
await organizersStore.fetchOrganizers();

// Sprawdzenie, czy aktualny użytkownik jest organizatorem
const currentOrganizer = computed(() =>
  organizersStore.organizers.find((org) => org.email === currentUser?.email)
);

// Filtr wydarzeń w zależności od roli użytkownika
const displayedEvents = computed(() => {
  if (currentOrganizer.value) {
    // Jeśli organizator, pokaż jego wydarzenia
    return eventsStore.events.filter(
      (event: Event) => event.organizerId === currentOrganizer.value?.slug
    );
  } else {
    // Jeśli użytkownik, pokaż wydarzenia, w których uczestniczy
    return eventsStore.events.filter((event: Event) =>
      event.participants.includes(currentUser?.email ?? '')
    );
  }
});
</script>

<template>
  <main>
    <h1>ASG Radar</h1>
    <div v-if="organizersStore.isLoading" class="loading-spinner"></div>
    <div v-else class="grid">
      <div class="events">
        <EventCard
          v-for="event in displayedEvents"
          :key="event.id"
          :event="event"
          :organizer="organizersStore.organizers.find((o) => o.slug === event.organizerId) || {} as Organizer"/>
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
