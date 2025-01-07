<script setup lang="ts">
import { useEventsStore } from '@/stores/eventsStore';
import type { Event } from '@/stores/eventsStore';
import { useOrganizersStore } from '@/stores/organizersStore';
import { getAuth } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

const currentUser = getAuth().currentUser;

const eventsStore = useEventsStore();

const organizersStore = useOrganizersStore();
await organizersStore.fetchOrganizers();

const isOpen = ref(false)

const lat = ref(52.025459)
const lng = ref(19.02832)

// Funkcja obsługująca zmianę współrzędnych markera
const updatePosition = (event: any) => {
  const newLatLng = event.target.getLatLng();
  lat.value = newLatLng.lat;
  lng.value = newLatLng.lng;
  console.log('New position:', newLatLng);
};

const date = ref(new Date())
const formattedDate = computed(() => {
  return new Intl.DateTimeFormat('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour12: false,
  }).format(date.value);
});

const startTime = ref<string>('')
const endTime = ref<string>('')

// Sprawdzenie, czy aktualny użytkownik jest organizatorem
const currentOrganizer = computed(() =>
  organizersStore.organizers.find((org) => org.email === currentUser?.email)
);


const newEvent = ref<Event>({
  organizerId: currentOrganizer.value?.slug ?? '',
  title: '',
  intro: '',
  description: '',
  date: Timestamp.now(),
  location: {
    address: '',
    city: '',
    postalCode: '',
    coordinates: { lat: 0, lng: 0 },
  },
  maxParticipants: 0,
  participants: [],
  status: 'zaplanowane' as 'zaplanowane' | 'w trakcie' | 'zakończone' | 'odwołane',
  images: [],
  price: 0,
  duration: {
    start: '',
    end: '',
  },
  contact: { email: currentOrganizer.value?.email ?? '', phone: '' },
});

const submitEvent = async () => {
  // Funkcja walidująca wymagane pola
  const validateEvent = () => {
    if (!date.value || 
    !startTime.value || 
    !endTime.value || 
    !newEvent.value.title.trim() || 
    !newEvent.value.description.trim() || 
    !newEvent.value.location.address.trim() || 
    !newEvent.value.location.city.trim() || 
    !newEvent.value.contact.email.trim()) return 'Wszystkie pola muszą być wypełnione.';
    return null; // Jeśli wszystko jest poprawne, zwracamy null
  };

  // Sprawdzamy walidację
  const validationError = validateEvent();
  if (validationError) {
    isOpen.value = true;
    return; // Przerywamy działanie funkcji
  }

  try {
    // Konwersja pól na odpowiednie formaty
    newEvent.value.date = Timestamp.fromDate(date.value);
    newEvent.value.duration.start = startTime.value.toString();
    newEvent.value.duration.end = endTime.value.toString();
    newEvent.value.location.coordinates = { lat: lat.value, lng: lng.value };

    // Dodanie wydarzenia do bazy danych
    await eventsStore.addEvent(newEvent.value);

    navigateTo('/events/myEvents');
  } catch (error) {
    console.error('Błąd podczas dodawania wydarzenia:', error);
    alert('Nie udało się dodać wydarzenia.');
  }
};

</script>


<template> 
  <ClientOnly>
    <UPage>
    <UCard class="w-fit mx-auto mt-10 mb-10">
    <template #header>
      <h1>Dodaj nowe wydarzenie</h1>
    </template>

    <div class="container w-full max-w-2xl mx-auto flex flex-col gap-6">
    
    <UFormGroup label="Tytuł">
      <UInput v-model="newEvent.title" placeholder="" icon="i-heroicons-bars-2" />
    </UFormGroup>

    <UFormGroup label="Intro" description="Krótki wstęp opisujący wydarzenie.">
      <UInput v-model="newEvent.intro" placeholder="" icon="i-heroicons-bolt" />
    </UFormGroup>

    <UFormGroup label="Opis" description="Szczegółowy opis wydarzenia.">
      <UTextarea autoresize v-model="newEvent.description" variant="outline" :rows="5" />
    </UFormGroup>

    <div class="flex flex-row gap-6">
      <UFormGroup label="Data wydarzenia">
        <UPopover :popper="{ placement: 'bottom-start' }">
          <UButton icon="i-heroicons-calendar-days-20-solid" :label="formattedDate" color="primary"/>
          <template #panel="{ close }">
            <DatePicker v-model="date" @close="close" :isActive="true"/>
          </template>
        </UPopover>
      </UFormGroup>
      
      <UFormGroup label="Godzina rozpoczęcia">
        <UInput v-model="startTime" type="time"/>
      </UFormGroup>
      
      <UFormGroup label="Godzina zakończenia">
        <UInput v-model="endTime" type="time"/>
      </UFormGroup>
    </div>

    <div class="flex gap-4">

      <UFormGroup label="Kod pocztowy" class="w-1/5">
        <UInput v-model="newEvent.location.postalCode" placeholder="45-217" icon="i-heroicons-envelope" />
      </UFormGroup>

      <UFormGroup label="Miasto" class="w-2/5">
        <UInput v-model="newEvent.location.city" placeholder="Opole" icon="i-heroicons-building-office-2" />
      </UFormGroup>

      <UFormGroup label="Adres" class="w-2/5">
        <UInput v-model="newEvent.location.address" placeholder="Przykładowa, 12" icon="i-heroicons-chevron-right" />
      </UFormGroup>
      
    </div>
    
    <div class="flex gap-4">

      <UFormGroup label="Szerokość geograficzna" class="w-1/2">
        <UInput v-model="lat" icon="i-heroicons-map-pin" type="number"/>
      </UFormGroup>

      <UFormGroup label="Długość geograficzna" class="w-1/2">
        <UInput v-model="lng" icon="i-heroicons-map-pin" type="number"/>
      </UFormGroup>


      </div>

    <UFormGroup label="Maksymalna liczba uczestników">
      <UInput v-model="newEvent.maxParticipants" type="number"/>
    </UFormGroup>

    <UFormGroup label="Cena">
      <UInput v-model="newEvent.price" type="number">
        <template #trailing>
          <span class="text-gray-500 dark:text-gray-400 text-xs">PLN</span>
        </template>
      </UInput>
    </UFormGroup>

    
    </div>
    <template #footer>
      <UButton class="w-fit" icon="i-heroicons-plus" color="primary" size="lg" @click="submitEvent">Dodaj wydarzenie</UButton>
    </template>
  </UCard>

    <template #right>
      <UAside>
        <h2 class="mb-4">Przesuń znacznik!</h2>
      <LMap
      class="map"
      ref="map"
      :zoom="5"
      :center="[52.025459, 19.02832]"
      :use-global-leaflet="false"
      
    >
      <LTileLayer
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        layer-type="base"
        name="Stadia Maps Basemap"
      />

      <LLayerGroup>
          <LMarker :draggable="true" :lat-lng="[lat, lng]" @dragend="updatePosition">
          </LMarker>
      </LLayerGroup>
    </LMap>
  </UAside>
    </template>
  </UPage>
  <UModal v-model="isOpen">
    <UPageCard
    title="Błąd"
    description="Wszystkie pola muszą być wypełnione."
    icon="i-heroicons-exclamation-circle"
  />
    </UModal>
  </ClientOnly>
  </template>

<style scoped lang="scss">
.map {
  z-index: 1;
  min-height: 700px;
  max-height: 700px;
  border-radius: 0.6em;
}
</style>