<template>
  <v-app>
    <AppHeader />
    <v-main>
      <Tabbar />
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
import Tabbar from './components/Tabbar.vue'
</script>
