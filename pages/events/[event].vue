<script setup lang="ts">
import type { Event } from '@/stores/eventsStore'
import { useEventsStore } from '@/stores/eventsStore'
import { getAuth } from 'firebase/auth';
import { useUsersStore } from '@/stores/usersStore';

const auth = getAuth();
const currentUser = auth.currentUser;

const isOrganizer = computed(() => currentUser?.email === event.value.contact.email);

const eventsStore = useEventsStore();
await eventsStore.fetchEvents();

const usersStore = useUsersStore();
await usersStore.fetchAllUsers();

const participants = computed(() =>
  usersStore.users.filter((user) => event.value.participants.includes(user.email))
);

const organizersStore = useOrganizersStore();
await organizersStore.fetchOrganizers();

const isJoining = ref(false);

const images = useAllImages()

const isOpen = ref(false)
const isSave = ref(false)

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

const formattedDate = new Intl.DateTimeFormat('pl-PL', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour12: false,
}).format(event.value?.date.toDate());


const canJoin = computed(() =>
  event.value &&
  !event.value.participants.includes(currentUser?.email ?? '') &&
  event.value.participants.length < event.value.maxParticipants
);

const joinEvent = async () => {
  if (!canJoin.value) return;
  isJoining.value = true;
  try {
    await eventsStore.joinEvent(event.value.id ?? '', currentUser?.email ?? '');
  } catch (error) {
    console.error('Error joining event:', error);
  } finally {
    isJoining.value = false;
  }
};

const leaveEvent = async () => {
  isJoining.value = true;
  try {
    await eventsStore.leaveEvent(event.value.id ?? '', currentUser?.email ?? '');
  } catch (error) {
    console.error('Error leaving event:', error);
  } finally {
    isJoining.value = false;
  }
};

const removeFromEvent = async (userEmail: string) => {
  isJoining.value = true;
  try {
    await eventsStore.leaveEvent(event.value.id ?? '', userEmail);
  } catch (error) {
    console.error('Error leaving event:', error);
  } finally {
    isJoining.value = false;
  }
};

const saveEvent = async () => {
  try {
    await eventsStore.saveEvent(event.value);
    isSave.value = true;
  } catch (error) {
    console.error('Error saving event:', error);
  }
};

const statusClass = computed(() => {
  return {
    'status-canceled': event.value.status === 'odwołane',
    'status-planned': event.value.status === 'zaplanowane',
    'status-in-progress': event.value.status === 'w trakcie',
    'status-completed': event.value.status === 'zakończone'
  };
});

</script>

<template>
  <ClientOnly>
    <main class="mb-20">
      <div v-if="organizersStore.isLoading" class="loading-spinner"></div>
      <template v-else>
        <div class="w-full flex flex-row gap-4 mt-4">
          <div class="w-3/5">
          <UCard class="event-details">
            <template #header>
              <UInput v-if="isOrganizer" v-model="event.title"/>
              <h1 v-else>{{ event.title }}</h1>
            </template>
 
            <UButton
              class="organizerLink"
              size="xl"
              variant="outline"
              :to="`/organizers/${organizer.slug}`"
              >
              Organizator: {{ organizer.name }}
            </UButton>

            <div class="flex flex-row mt-4 items-center">
              
              <p class="mr-2">{{ event.location.city }}</p>
              <p>|</p>
              <UButton @click="isOpen = true" variant="ghost" :label="event.location.address"/>
              <p class="mr-2">|</p>
              <div class="flex gap-2">Status: <div class="mr-2" :class="statusClass">{{ event.status }}</div></div>
              <p class="mr-2">|</p>
              <p>{{ formattedDate }}</p>

            </div>
            <div v-if="isOrganizer" class="flex flex-row gap-4 mt-4 items-center">
              
              <UInput type="time" v-if="isOrganizer" v-model="event.duration.start" placeholder="Start"/>
              <p>|</p>
              <UInput type="time" v-if="isOrganizer" v-model="event.duration.end" placeholder="Koniec"/>
              <p>|</p>
              <UInput style="width: 85px;" type="number" v-if="isOrganizer" v-model="event.price" placeholder="Cena" > 
                <template #trailing>
                  <span class="text-gray-500 dark:text-gray-400 text-xs">PLN</span>
                </template>
              </UInput>
            </div>
            <div v-else class="flex flex-row gap-4 mt-4 items-center">
              
              <p>Start: {{ event.duration.start }}</p>
              <p>|</p>
              <p>Koniec: {{ event.duration.end }}</p>
              <p>|</p>
              <p>Cena: {{ event.price }} zł</p>

            </div>
            <UDivider class="mt-4" label="Wprowadzenie"/>
            <UInput class="mt-2" v-if="isOrganizer" v-model="event.intro"/>
            <p v-else class="mt-4">{{ event.intro }}</p>
            <UDivider class="mt-4" label="Opis"/>
            <UTextarea autoresize class="mt-2" v-if="isOrganizer" v-model="event.description"/>
            <pre v-else class="text-sm mt-4">{{ event.description }}</pre>
            <UDivider class="mt-4" />
            <UCarousel v-slot="{ item }" :items="images" :ui="{ item: 'basis-full' }" class="rounded-lg overflow-hidden ml-10 mr-10 mt-8" arrows>
              <img :src="item" width="1920" height="1080" class="w-full" draggable="false">
            </UCarousel>
            
            <template #footer>
              <div class="flex ">

              <div v-if="event?.status === 'zaplanowane'">
                  <UButton 
                  icon="i-heroicons-check-circle" 
                  v-if="canJoin" 
                  @click="joinEvent"
                  :disabled="isJoining"
                  label="Dołącz"/>
                  
                  <UButton 
                  icon="i-heroicons-x-circle" 
                  v-else 
                  @click="leaveEvent"
                  color="red"
                  :disabled="isJoining"
                  label="Opuść"/>
                </div>

                <UButton class="ml-auto" @click="saveEvent" v-if="isOrganizer" label="Zapisz zmiany" icon="i-heroicons-bookmark"/>
              </div>
              <p class="mb-4 mt-4"> {{ event?.participants.length }} / {{ event?.maxParticipants }} uczestników :</p>
              <div v-for="user in participants" class="flex flex-row gap-4 items-center">
                <UIcon name="i-heroicons-user-circle" class="w-6 h-6" />
                <p>{{ user.nickname }}</p>
                <p>{{ user.firstName }}</p>
                <p>{{ user.lastName}}</p>
                <UButton 
                  icon="i-heroicons-x-circle" 
                  @click="removeFromEvent(user.email)"
                  color="red"
                  :disabled="isJoining"
                  label="Usuń"/>
              </div>
            </template>
          </UCard>
          </div>
          <div class="w-2/5">
              <UCard class="event-details right-expanded">
                <template #header>
                  <h1>Chat</h1>
                </template>

                <Placeholder class="h-32" />

                <template #footer>
                  <Placeholder class="h-8" />
                </template>
              </UCard>
            </div>
          
        </div>
      </template>
    </main>
    <UModal v-model="isOpen">
        <LMap style="height: 450px; width: 650px;" :zoom="6" :center="[event.location.coordinates.lat, event.location.coordinates.lng]">
              <LTileLayer
                  url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                  layer-type="base"
                  name="Stadia Maps Basemap"
                />
                <LLayerGroup>
                    <LMarker :lat-lng="[event.location.coordinates.lat, event.location.coordinates.lng]">
                    </LMarker>
                </LLayerGroup>
          </LMap>
    </UModal>

    <UModal v-model="isSave">
      <UPageCard 
        title="Sukces!"
        description="Pomyślnie zapisano zmiany"
        icon="i-heroicons-check-circle"
      />
    </UModal>
  </ClientOnly>
  </template>

  <style scoped lang="scss">
@use "@/assets/styles/colors.scss";
.status-canceled {
  color: colors.$cancelled;
}

.status-planned {
  color: colors.$planned;
}

.status-in-progress {
  color: colors.$in-progress;
}

pre {
  white-space: pre-wrap; /* Zachowuje łamanie wierszy */
  word-wrap: break-word; /* Zabezpieczenie przed przepełnieniem */
}
  </style>
