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
    <div v-if="organizersStore.isLoading" class="loading-spinner"></div>
    <div v-else>
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
