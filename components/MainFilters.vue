<script setup lang="ts">
import type { Filter } from "@/data/filters";

const emit = defineEmits<{
  (e: "filter-change", filters: Filter): void;
}>();

const selectedTitle = ref<string | null>(null);
const selectedOrganizer = ref<string | null>(null);

const applyFilters = () => {
  emit("filter-change", {
    title: selectedTitle.value || undefined,
    organizerName: selectedOrganizer.value || undefined,
  });
};

const removeFilters = () => {
  selectedTitle.value = null;
  selectedOrganizer.value = null;
  emit("filter-change", {
    title: undefined,
    organizerName: undefined,
  });
};
</script>

<template>
  <div class="flex">
    <h2>Filtry</h2>
    <label>
      Tytuł:
      <input type="text" v-model="selectedTitle" placeholder="Wpisz tytuł" />
    </label>
    <label>
      Organizator:
      <input
        type="text"
        v-model="selectedOrganizer"
        placeholder="Wpisz organizatora"
      />
    </label>
    <button @click="applyFilters">Zastosuj filtry</button>
    <button @click="removeFilters">Wyczyść filtry</button>
  </div>
</template>

<style scoped>
h2 {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 10px;
}

.flex {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.flex button {
  margin-top: 10px;
  width: 90px;
}
</style>
