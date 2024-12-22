<script setup lang="ts">
import type { Event } from "@/data/events";

const { event } = defineProps<{ event: Event }>();

const isHover = ref(false);
</script>

<template>
  <div class="card" :class="{ hover: isHover }">
    <h2>{{ event.title }}</h2>
    <OrganizerLink :organizer="event.organizer" />
    <RenderMarkdown :source="event.intro" />
    <NuxtLink
      class="more"
      :to="`/events/${event.slug}`"
      @mouseenter="isHover = true"
      @mouseleave="isHover = false"
    >
      More ...
    </NuxtLink>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/styles/colors.scss";

.card {
  padding: 15px 15px 35px;
  border: 1px solid colors.$green-dark;
  border-radius: 5px;
  margin-bottom: 25px;
  font-size: 12pt;
  position: relative;
}

.card .title {
  font-size: 20pt;
}

.card .more {
  color: colors.$green-medium;
  font-size: 12pt;
  padding: 5px 10px;
  position: absolute;
  right: 0px;
  bottom: 0px;
}

.card.hover {
  border-color: colors.$green-medium;
}

.card.hover .title {
  color: colors.$green-light;
}

.card.hover .more {
  color: colors.$green-light;
}
</style>
