<template>
  <v-app>
    <v-main>
      <PillNav />
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import PillNav from './components/PillNav.vue'
</script>
