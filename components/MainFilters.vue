<script setup lang="ts">
import type { Filter } from "@/data/filters";
import { useEventsStore } from '@/stores/eventsStore';
import { format } from 'date-fns'

const date = ref(new Date())

const formattedDate = computed(() => {
  return new Intl.DateTimeFormat('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour12: false,
  }).format(date.value);
});

const eventsStore = useEventsStore();
await eventsStore.fetchEvents();

const cities = computed(() => {
  const events = eventsStore.events || [];
  return Array.from(new Set(events
    .filter((event) => event.status === 'zaplanowane')
    .map((event) => event.location?.city || '')
  ));
});
const emit = defineEmits<{
  (e: "filter-change", filters: Filter): void;
}>();

const selectedTitle = ref('')
const selectedOrganizer = ref('')
const selectedCity = ref('')


const dateActive = ref(false)

const applyFilters = () => {
  emit("filter-change", {
    title: selectedTitle.value || undefined,
    organizerName: selectedOrganizer.value || undefined,
    city: selectedCity.value || undefined,
    date: dateActive.value ? date.value : undefined,
  });
};

const removeFilters = () => {
  selectedTitle.value = '';
  selectedOrganizer.value = '';
  selectedCity.value = '';
  dateActive.value = false;
  date.value = new Date();
  emit("filter-change", {
    title: undefined,
    organizerName: undefined,
  });
};
</script>

<template>
   <ClientOnly>
  <div class="flex">
    <h2>Filtry</h2>
    <UInput
    v-model="selectedTitle"
    name="selectedTitle"
    placeholder="Tytuł"
    icon="i-heroicons-magnifying-glass-20-solid"
    autocomplete="off"
    :ui="{ icon: { trailing: { pointer: '' } } }"
  >
    <template #trailing>
      <UButton
        v-show="selectedTitle !== ''"
        color="gray"
        variant="link"
        icon="i-heroicons-x-mark-20-solid"
        :padded="true"
        @click="selectedTitle = ''"
      />
    </template>
  </UInput>

  <UInput
    v-model="selectedOrganizer"
    name="selectedOrganizer"
    placeholder="Organizator"
    icon="i-heroicons-user-circle-20-solid"
    autocomplete="off"
    :ui="{ icon: { trailing: { pointer: '' } } }"
  >
    <template #trailing>
      <UButton
        v-show="selectedOrganizer !== ''"
        color="gray"
        variant="link"
        icon="i-heroicons-x-mark-20-solid"
        :padded="true"
        @click="selectedOrganizer = ''"
      />
    </template>
  </UInput>

 
  <UInputMenu 
    v-model="selectedCity" 
    :options="cities"   
    icon="i-heroicons-building-office-2-20-solid" 
    placeholder="Miasto" >
    <template #option-empty="{ query }">
      Brak wyników dla <q>{{ query }}</q>
    </template>
    <template #empty>
      Brak wyników
    </template>
  </UInputMenu>
  <div class="dateContainer">
    <UCheckbox v-model="dateActive" name="dateActive" class="dateActive"/>
    
    <UPopover :popper="{ placement: 'bottom-start' }">
      
      <UButton icon="i-heroicons-calendar-days-20-solid" :label="formattedDate" :color="dateActive ? 'primary' : 'gray'"/>

      <template #panel="{ close }">
        
        <DatePicker v-model="date" @close="close" :isActive="dateActive"/>

      </template>
    </UPopover>
  </div>
  <div class="buttonContainer">
    <UButton @click="applyFilters" color="primary" variant="solid">Zastosuj filtry</UButton>
    <UButton @click="removeFilters" color="gray" variant="ghost">Wyczyść filtry</UButton>
  </div>
  </div>
</ClientOnly>
</template>

<style scoped>
h2 {
  margin-bottom: 10px;
}

label {
  display: block;
  margin-bottom: 10px;
}

.flex {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dateContainer {
  display: flex;
  align-items: center;
  gap: 20px;
}

.dateActive {
  margin: 0;
  margin-left: 10px;
}

.buttonContainer {
  display: flex;
  flex-direction: row;
  gap: 10px;
}
</style>
