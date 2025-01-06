<script setup lang="ts">
import type { Event } from '@/stores/eventsStore'
import type { Filter } from '@/data/filters'
import type { Organizer } from '@/stores/organizersStore'
import { useEventsStore } from '@/stores/eventsStore';
import { useOrganizersStore } from '@/stores/organizersStore';
import { format } from 'date-fns'

const zoom = ref(5)

const eventsStore = useEventsStore();
await eventsStore.fetchEvents();

const organizersStore = useOrganizersStore();
await organizersStore.fetchOrganizers();

const filters = ref<Filter>({})

const filteredEvents = computed(() =>
  eventsStore.events.filter((event: Event) => {
    const matchStatus =  event.status === "zaplanowane"
    const matchesTitle = filters.value.title
      ? event.title
        .toLowerCase()
        .includes(filters.value.title.toLowerCase())
      : true
    const matchesOrganizer = filters.value.organizerName
      ? event.organizerId
        .toLowerCase()
        .includes(filters.value.organizerName.toLowerCase())
      : true
    const matchesCity = filters.value.city
      ? event.location.city
        .toLowerCase()
        .includes(filters.value.city.toLowerCase())
      : true
    const matchesDate = filters.value.date
      ? format(new Date(event.date.toDate()), 'yyyy-MM-dd') === format(filters.value.date, 'yyyy-MM-dd')
      : true

    return  matchStatus && matchesTitle && matchesOrganizer && matchesCity && matchesDate 
  })
)

const handleFilterChange = (newFilters: Filter) => {
  filters.value = newFilters
}
</script>

<template>
  <ClientOnly>
  <div v-if="organizersStore.isLoading" class="loading-spinner"></div>
  <div v-else>
   <UPage>
    <template #left>
      <UAside>

        <MainFilters @filter-change="handleFilterChange" />

      </UAside>
    </template>

    <div class="events">
      <EventCard
        v-for="event in filteredEvents"
        :key="event.id"
        :event="event"
        :organizer="organizersStore.organizers.find((o) => o.slug === event.organizerId) || {} as Organizer">
      </EventCard>
    </div>
    <template #right>
      <LMap
      class="map"
      ref="map"
      :zoom="zoom"
      :center="[52.025459, 19.02832]"
      :use-global-leaflet="false"
      
    >
      <LTileLayer
        url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        layer-type="base"
        name="Stadia Maps Basemap"
      />

      <LLayerGroup>
        <div v-for="event in filteredEvents" :key="event.id">
          <LMarker :lat-lng="[event.location.coordinates.lat, event.location.coordinates.lng]" >
            <LPopup>{{ event.title }} <br>
              <ULink
                :to="`/events/${event.id}`"
                active-class="text-primary"
              >
                Link
              </ULink> 
            </LPopup>
          </LMarker>
        </div>
      </LLayerGroup>
    </LMap>
    </template>

  </UPage>
  </div>
</ClientOnly>
</template>

<style scoped lang="scss">
@use "@/assets/styles/colors.scss";

.events {
  margin-top: 40px;
  display: grid;
  gap: 20px;
}

.map {
  margin-top: 40px;
  z-index: 1;
  min-height: 700px;
  max-height: 700px;
}
</style>
