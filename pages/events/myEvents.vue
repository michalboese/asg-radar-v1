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

// Filtr wydarzeń w zależności od roli użytkownika i sortowanie według daty
const allEvents = computed(() => {
  let filteredEvents;
  if (currentOrganizer.value) {
    // Jeśli organizator, pokaż jego wydarzenia
    filteredEvents = eventsStore.events.filter(
      (event: Event) => event.organizerId === currentOrganizer.value?.slug
    );
  } else {
    // Jeśli użytkownik, pokaż wydarzenia, w których uczestniczy
    filteredEvents = eventsStore.events.filter((event: Event) =>
      event.participants.includes(currentUser?.email ?? '')
    );
  }
  // Sortowanie wydarzeń według daty
  return filteredEvents.sort((a, b) => new Date(a.date.toDate()).getTime() - new Date(b.date.toDate()).getTime())
});

const displayedEvents = ref(allEvents.value);
const currentFilter = ref('');

const filterStatus = (status: string) => {
  if (currentFilter.value === status) {
    currentFilter.value = '';
    displayedEvents.value = allEvents.value;
  } else {
    currentFilter.value = status;
    displayedEvents.value = allEvents.value.filter(event => event.status === status);
  }
};

const organizer = (event: Event) =>
  organizersStore.organizers.find((o) => o.slug === event.organizerId) || {} as Organizer;
</script>

<template>
  <UPage>
    <template #left>
      <UAside>
      <h1>Status wydarzeń</h1>
      <UDivider v-if="currentOrganizer" class="mt-4" label="które organizujesz"/>
      <UDivider v-else class="mt-4" label="w których uczestniczysz"/>
      <div class="flex flex-col w-1/2 mx-auto gap-4 mt-6">
        <UButton
            :variant="currentFilter === 'zaplanowane' ? 'solid' : 'outline'"
            label="Zaplanowane"
            class="justify-center"
            @click="filterStatus('zaplanowane')"
          />
          <UButton
            :variant="currentFilter === 'zakończone' ? 'solid' : 'outline'"
            color="black"
            label="Zakończone"
            class="justify-center"
            @click="filterStatus('zakończone')"
          />
          <UButton
            :variant="currentFilter === 'odwołane' ? 'solid' : 'outline'"
            color="red"
            label="Odwołane"
            class="justify-center"
            @click="filterStatus('odwołane')"
          />
      </div>
    </UAside>
    </template>
    <div v-if="organizersStore.isLoading" class="loading-spinner"></div>
    <div v-else>
      <div class="events">
        <EventCard
          v-for="event in displayedEvents"
          :key="event.id"
          :event="event"  
          :organizer="organizer(event)"/>
      </div>
    </div>
  </UPage>
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
