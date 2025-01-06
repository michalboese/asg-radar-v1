<script setup lang="ts">
import type { Event } from '@/stores/eventsStore'
import type { Organizer } from '@/stores/organizersStore';

const { getRandomImage } = useRandomImage()

const { event } = defineProps<{ event: Event, organizer: Organizer }>()

const eventDate = event.date.toDate();
const formattedDate = new Intl.DateTimeFormat('pl-PL', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour12: false,
}).format(eventDate);

const statusClass = computed(() => {
  return {
    'status-canceled': event.status === 'odwołane',
    'status-planned': event.status === 'zaplanowane',
    'status-in-progress': event.status === 'w trakcie',
    'status-completed': event.status === 'zakończone'
  };
});
</script>

<template>
  <UCard>
    <template #header>
      <h1>{{ event.title }}</h1>
    </template>
    <div class="container">
      <div class="img">
        <img :src="getRandomImage()" alt="Event image" />
      </div>

    <div class="info">
      <UButton
        class="organizerLink"
        size="xl"
        variant="outline"
        :to="`/organizers/${organizer.slug}`"
        >
        Organizator: {{ organizer.name }}
      </UButton>
      <div class="event-info">
        <p>{{ event.location.city }}</p>
        <p>|</p>
        <div class="flex gap-2">Status: <div :class="statusClass">{{ event.status }}</div></div>
        <p>|</p>
        <p>{{ formattedDate }}</p>
        <p>{{ event.duration.start }}</p>
      </div>

      <div class="intro"><p>{{ event.intro }}</p></div>
      
    </div>
    </div>
    <template #footer>
        <UButton 
        size="sm" 
        variant="ghost" 
        :to="`/events/${event.id}`">
        Przejdź ...
      </UButton>
      </template>
  </UCard>
</template>

<style scoped lang="scss">
@use "@/assets/styles/colors.scss";

.event-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
}

.event-info p {
  margin: 0;
  line-height: 1.5;
}

.organizerLink {
  margin-bottom: 0.5rem;
  width: fit-content;
}

.container {
  display: flex;
  gap: 2rem;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.event-info {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}

.intro {
  font-size: 18px;
}

.img {
  min-width: 300px;
  max-width: 300px;
  height: auto;
}

.img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 3%;
}

.status-canceled {
  color: colors.$cancelled;
}

.status-planned {
  color: colors.$planned;
}

.status-in-progress {
  color: colors.$in-progress;
}

</style>