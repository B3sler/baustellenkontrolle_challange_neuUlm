<template>
  <v-app-bar elevation="1" color="primary">
    <v-app-bar-title>
      <span class="font-weight-bold text-white">NeuBautUlm</span>
    </v-app-bar-title>
    <template #append>
      <RoleSwitch />
    </template>
  </v-app-bar>
</template>

<script setup lang="ts">
import RoleSwitch from './RoleSwitch.vue'
</script>
