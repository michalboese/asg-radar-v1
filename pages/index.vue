<script setup lang="ts">
import type { Event } from "@/data/events";
import type { Filter } from "@/data/filters";
import { getEventsUrl } from "@/data/events";

const events = ref<Event[] | null>(null);

(async () => {
  const { data } = await useFetch<Event[]>(getEventsUrl());
  events.value = data.value;
})();

const filters = ref<Filter>({});

const filteredEvents = computed(() =>
  events.value?.filter((event: Event) => {
    const matchesTitle = filters.value.title
      ? event.title.toLowerCase().includes(filters.value.title.toLowerCase())
      : true;
    const matchesOrganizer = filters.value.organizerName
      ? event.organizer.name
          .toLowerCase()
          .includes(filters.value.organizerName.toLowerCase())
      : true;

    return matchesTitle && matchesOrganizer;
  })
);

const handleFilterChange = (newFilters: Filter) => {
  filters.value = newFilters;
};
</script>

<template>
  <main>
    <h1>ASG Radar</h1>
    <div class="grid">
      <div class="filters">
        <MainFilters @filter-change="handleFilterChange" />
      </div>
      <div class="events">
        <EventCard
          v-for="event in filteredEvents"
          :key="event.id"
          :event="event"
        />
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
