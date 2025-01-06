<script setup lang="ts">
import type { Event } from '@/stores/eventsStore'
import { useEventsStore } from '@/stores/eventsStore'
import { getAuth } from 'firebase/auth';

const auth = getAuth();
const currentUser = auth.currentUser;
const eventsStore = useEventsStore();
await eventsStore.fetchEvents();

const organizersStore = useOrganizersStore();
await organizersStore.fetchOrganizers();

const isJoining = ref(false);

definePageMeta({
  layout: 'default',
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

const formattedDate = computed(() =>
  event.value?.date?.toDate().toLocaleString('pl-PL')
);

const canJoin = computed(() =>
  event.value &&
  !event.value.participants.includes(currentUser?.email ?? '') &&
  event.value.participants.length < event.value.maxParticipants
);

const joinEvent = async () => {
  if (!canJoin.value) return;
  isJoining.value = true;
  try {
    await eventsStore.joinEvent(event.value.id, currentUser?.email ?? '');
  } catch (error) {
    console.error('Error joining event:', error);
  } finally {
    isJoining.value = false;
  }
};

</script>

<template>
    <main>
      <div v-if="organizersStore.isLoading" class="loading-spinner"></div>
      <template v-else>
        <div class="event-details">
    <h1>{{ event?.title }}</h1>
    <p>{{ event?.description }}</p>

    <div v-if="event?.location" class="event-location">
      <h3>Location:</h3>
      <p>{{ event.location.address }}, {{ event.location.city }}</p>
    </div>

    <p><strong>Date:</strong> {{ formattedDate }}</p>
    <p><strong>Price:</strong> {{ event?.price > 0 ? `${event.price} zł` : 'Free' }}</p>
    <p><strong>Participants:</strong> {{ event?.participants.length }} / {{ event?.maxParticipants }}</p>

    <button 
      v-if="canJoin" 
      @click="joinEvent"
      :disabled="isJoining"
    >
      {{ isJoining ? 'Joining...' : 'Join Event' }}
    </button>
    <p v-else>You are already registered or the event is full.</p>
  </div>
      </template>
    </main>
  </template>