<script setup lang="ts">
import type { User } from "@/data/users";
import { getUserDetailsUrl } from "@/data/users";

const userSlug = useParam("user");

const { data: user } = await useFetch<User>(getUserDetailsUrl(userSlug));
</script>

<template>
  <main>
    <h1>{{ user?.firstName }} {{ user?.lastName }}</h1>
    <h1>{{ user?.email }}</h1>
  </main>
</template>
