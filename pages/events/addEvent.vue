<script setup>
import { useEventsStore } from '@/stores/eventsStore';

const eventsStore = useEventsStore();

const newEvent = ref({
  organizerId: 'tactical-masters',
  title: '',
  intro: '',
  description: '',
  date: '',
  location: {
    address: 'ul. Przykładowa 1',
    city: 'Warszawa',
    coordinates: { lat: 0, lng: 0 },
  },
  maxParticipants: 0,
  participants: [],
  status: 'zaplanowane',
  images: [],
  price: 0,
  duration: {
    start: '',
    end: '',
  },
  contact: { email: '', phone: '' },
});

const submitEvent = async () => {
  try {
    // Konwersja daty na Timestamp
    newEvent.value.date = new Date(newEvent.value.date);
    newEvent.value.duration.start = new Date(newEvent.value.date);
    newEvent.value.duration.end = new Date(newEvent.value.date); // Dostosuj zgodnie z wymogami

    await eventsStore.addEvent(newEvent.value);
    alert('Wydarzenie zostało dodane!');
    clearForm();
  } catch (error) {
    console.error('Błąd podczas dodawania wydarzenia:', error);
    alert('Nie udało się dodać wydarzenia.');
  }
};

const clearForm = () => {
  Object.keys(newEvent.value).forEach((key) => {
    if (typeof newEvent.value[key] === 'object') {
      newEvent.value[key] = Array.isArray(newEvent.value[key]) ? [] : {};
    } else {
      newEvent.value[key] = '';
    }
  });
};
</script>


<template>
    <div class="container py-4">
      <h1>Dodaj nowe wydarzenie</h1>
      <form @submit.prevent="submitEvent">
        <div class="mb-3">
          <label for="title" class="form-label">Tytuł</label>
          <input v-model="newEvent.title" type="text" id="title" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="intro" class="form-label">Wstęp</label>
          <input v-model="newEvent.intro" type="text" id="intro" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">Opis</label>
          <textarea v-model="newEvent.description" id="description" class="form-control" required></textarea>
        </div>
        <div class="mb-3">
          <label for="date" class="form-label">Data</label>
          <input v-model="newEvent.date" type="datetime-local" id="date" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="maxParticipants" class="form-label">Maksymalna liczba uczestników</label>
          <input v-model.number="newEvent.maxParticipants" type="number" id="maxParticipants" class="form-control" required />
        </div>
        <div class="mb-3">
          <label for="price" class="form-label">Cena</label>
          <input v-model.number="newEvent.price" type="number" id="price" class="form-control" />
        </div>
        <div class="mb-3">
          <label for="contactEmail" class="form-label">Email kontaktowy</label>
          <input v-model="newEvent.contact.email" type="email" id="contactEmail" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-primary">Dodaj wydarzenie</button>
      </form>
    </div>
  </template>